import { and, eq, lte } from 'drizzle-orm';
import cron from 'node-cron';
import { db } from '../db/index.js';
import {
    emailQueue,
    emails,
    emailConditions,
    emailSendQueue,
    emailOpens
} from '../db/schema.js';

const BATCH_SIZE = 50;

function addMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

async function processEmailBatch() {
    let processedCount = 0;

    try {
        const currentTime = new Date();
        const pendingEmails = await db.query.emailQueue.findMany({
            where: and(
                eq(emailQueue.status, 'pending'),
                lte(emailQueue.scheduledTime, currentTime)
            ),
            with: {
                email: {
                    with: {
                        emailConditions: {
                            with: {
                                trueEmail: true,
                                falseEmail: true
                            }
                        }
                    }
                }
            },
            limit: BATCH_SIZE
        });

        for (const queueItem of pendingEmails) {
            try {
                await db.transaction(async (tx) => {
                    // Check if the email has conditions
                    if (queueItem.email.hasCondition) {
                        const condition = queueItem.email.emailConditions[0];

                        const emailOpen = await tx.query.emailOpens.findFirst({
                            where: and(
                                eq(emailOpens.emailId, queueItem.emailId),
                                eq(emailOpens.contactId, queueItem.contactId)
                            )
                        });

                        // Use the appropriate delay minutes based on condition
                        const nextEmail = emailOpen ? condition.trueEmail : condition.falseEmail;
                        const delayMinutes = emailOpen ? condition.trueDelayHours : condition.falseDelayHours;

                        if (nextEmail) {
                            // Calculate next schedule time using minutes
                            const scheduledTime = addMinutesToDate(new Date(), delayMinutes || 0);

                            await tx.insert(emailQueue).values({
                                contactId: queueItem.contactId,
                                emailId: nextEmail.id,
                                scheduledTime,
                                status: 'pending'
                            });

                            console.info('Scheduled conditional email', {
                                contactId: queueItem.contactId,
                                emailId: nextEmail.id,
                                scheduledTime,
                                delayMinutes
                            });
                        }
                    } else {
                        // Handle sequential emails
                        const nextEmail = await tx.query.emails.findFirst({
                            where: eq(emails.parentEmailId, queueItem.emailId)
                        });

                        if (nextEmail) {
                            // Use delayHours field which actually contains minutes
                            const scheduledTime = addMinutesToDate(new Date(), nextEmail.delayHours);

                            await tx.insert(emailQueue).values({
                                contactId: queueItem.contactId,
                                emailId: nextEmail.id,
                                scheduledTime,
                                status: 'pending'
                            });

                            console.info('Scheduled sequential email', {
                                contactId: queueItem.contactId,
                                emailId: nextEmail.id,
                                scheduledTime,
                                delayMinutes: nextEmail.delayHours
                            });
                        }
                    }

                    // Move current email to send queue
                    await tx.insert(emailSendQueue).values({
                        contactId: queueItem.contactId,
                        emailId: queueItem.emailId,
                        sendTime: new Date(),
                        status: 'pending'
                    });

                    // Update the status of the current queue item
                    await tx.update(emailQueue)
                        .set({
                            status: 'processed',
                            updatedAt: new Date()
                        })
                        .where(eq(emailQueue.id, queueItem.id));

                    processedCount++;

                    console.info('Processed queue item', {
                        queueItemId: queueItem.id,
                        contactId: queueItem.contactId,
                        emailId: queueItem.emailId
                    });
                });
            } catch (error) {
                console.error('Error processing email queue item:', {
                    queueItemId: queueItem.id,
                    error: error.message,
                    stack: error.stack
                });
                continue;
            }
        }

        console.info('Email queue batch processing completed', {
            processedCount,
            totalItems: pendingEmails.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in batch processing:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
}

// Run the cron job every minute
export function setupEmailQueueCron() {
    // Process email queue every minute
    cron.schedule('* * * * *', async () => {
        console.info('Starting email queue processing', {
            timestamp: new Date().toISOString()
        });

        try {
            await processEmailBatch();
        } catch (error) {
            console.error('Cron job failed:', {
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
