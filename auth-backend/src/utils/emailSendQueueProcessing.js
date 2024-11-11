import cron from 'node-cron';
import { eq, and, lte, arrayContains } from 'drizzle-orm';
import {
	emailSendQueue,
	sentEmails,
	contacts,
	emails,
	emailTemplates,
	emailAccounts,
	campaigns,
} from '../db/schema.js';
import { db } from '../db/index.js';
import { v4 as uuidv4 } from "uuid";
import { createSendEmailCommand } from './sendEmail.js';
import { sesClient } from './sesClient.js';


export class EmailQueueProcessor {
	BATCH_SIZE = 50;
	baseUrl;

	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	async processEmailQueue() {
		const currentTime = new Date();

		// Get pending emails
		const queuedEmails = await db.query.emailSendQueue.findMany({
			where: and(
				eq(emailSendQueue.status, 'pending')
			),
			with: {
				contact: true,
				email: {
					with: {
						template: true,
						campaign: {
							with: {
								emailAccount: true
							}
						}
					}
				}
			},
			limit: this.BATCH_SIZE
		})

		if (!queuedEmails.length) {
			return [];
		}

		const newModQueuedEmails = queuedEmails.map((e) => {
			return {
				queueId: e.id,
				userId: e.email.campaign.userId,
				campaignId: e.email.campaignId,
				emailsTableId: e.email.id,
				contactId: e.contact.id,
				fromEmailId: e.email.campaign.emailAccount.emailId,
				toEmailId: e.contact.email,
				subject: e.email.template.subject,
				content: e.email.template.content,
				contactName: e.contact.name,
				contactEmail: e.contact.email,
				status: e.status,
			}
		})


		const processedEmails = [];

		// Process each email
		for (const queuedEmail of newModQueuedEmails) {

			// Generate tracking ID - this will be used in both email opens and sent emails
			const trackingId = `${queuedEmail.contactId}-${queuedEmail.emailsTableId}`;
			const emailId = uuidv4();

			// Process the email content
			const processedContent = await this.processEmailContent({
				content: queuedEmail.content,
				subject: queuedEmail.subject,
				contactName: queuedEmail.contactName,
				contactEmail: queuedEmail.contactEmail,
				trackingId,
			});

			// Record the processed email
			await db.insert(sentEmails).values({
				id: emailId,
				userId: queuedEmail.userId,
				campaignId: queuedEmail.campaignId,
				emailId: queuedEmail.emailsTableId,
				contactId: queuedEmail.contactId,
				fromEmail: queuedEmail.fromEmailId,
				toEmail: queuedEmail.contactEmail,
				subject: processedContent.subject,
				processedContent: processedContent.content,
				trackingId,
				status: 'pending',
			});

			processedEmails.push({
				id: emailId,
				queueId: queuedEmail.queueId,
				campaignId: queuedEmail.campaignId,
				emailId: queuedEmail.emailsTableId,
				contactId: queuedEmail.contactId,
				to: queuedEmail.contactEmail,
				from: queuedEmail.fromEmailId,
				subject: processedContent.subject,
				content: processedContent.content,
				trackingId,
			});

			// Update email queue status
			await db
				.update(emailSendQueue)
				.set({ status: 'processing' })
				.where(eq(emailSendQueue.id, queuedEmail.queueId));
		}

		return processedEmails;
	}

	async processEmailContent({
		content,
		subject,
		contactName,
		contactEmail,
		trackingId,
	}) {
		// Replace template variables
		let processedContent = content.replace(/<span[^>]*>{{name}}<\/span>/g, contactName);
		processedContent = processedContent.replace(/<span[^>]*>{{email}}<\/span>/g, contactEmail);

		// Add tracking pixel - using the same tracking ID that's stored in sentEmails
		const trackingPixel = `<img src="${this.baseUrl}/tracking/${trackingId}" width="1" height="1" style="display:none;" />`;
		processedContent = processedContent + trackingPixel;

		// Process subject line variables

		return {
			content: processedContent,
			subject: subject,
		};
	}
}

// Example usage in your email sending system
async function handleSendEmail(email) {
	try {
		// Your email sending logic here
		const sendEmailCommand = createSendEmailCommand(
			email.to,
			email.from,
			email.subject,
			email.content
		);

		try {
			await sesClient.send(sendEmailCommand);
			await db
				.update(sentEmails)
				.set({
					status: 'sent',
					updatedAt: new Date()
				})
				.where(eq(sentEmails.id, email.id));

			// Update queue status
			await db
				.update(emailSendQueue)
				.set({ status: 'completed' })
				.where(eq(emailSendQueue.id, email.queueId));
		} catch (caught) {
			console.log(caught)
			if (caught && caught.name === "MessageRejected") {
				return messageRejectedError;
			}
			throw caught;
		}

	} catch (error) {
		console.log(error)
		// Update sent email status with failure
		await db
			.update(sentEmails)
			.set({
				status: 'failed',
				failureReason: error.message,
				updatedAt: new Date()
			})
			.where(eq(sentEmails.id, email.id));

		// Update queue status
		await db
			.update(emailSendQueue)
			.set({ status: 'failed' })
			.where(
				and(
					eq(emailSendQueue.emailId, email.emailId),
					eq(emailSendQueue.contactId, email.contactId)
				)
			);
	}
}

const processor = new EmailQueueProcessor('http://localhost:3000');

// In your cron job:
async function processPendingEmails() {
	const processedEmails = await processor.processEmailQueue();
	console.log("Email send queue processing: " + processedEmails.length)

	for (const email of processedEmails) {
		try {
			// Your email sending logic here
			await handleSendEmail(email);

			// Update status to sent
			await db
				.update(emailSendQueue)
				.set({ status: 'sent' })
				.where(eq(emailSendQueue.id, email.queueId));
		} catch (error) {
			// Handle error and update status to failed
			console.log(error)
			await db
				.update(emailSendQueue)
				.set({ status: 'failed' })
				.where(eq(emailSendQueue.id, email.queueId));
		}
	}
}

// Run the cron job every minute
export function setupEmailSendQueueCron() {
	// Process email queue every minute
	cron.schedule('* * * * *', async () => {
		console.info('Starting email send queue processing', {
			timestamp: new Date().toISOString()
		});

		try {
			await processPendingEmails();
		} catch (error) {
			console.error('Cron job email send queue failed:', {
				error: error.message,
				stack: error.stack,
				timestamp: new Date().toISOString()
			});
		}
	}, {
		scheduled: true,
		timezone: "UTC"
	});
}