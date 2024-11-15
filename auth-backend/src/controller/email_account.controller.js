import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { emailAccounts } from "../db/schema.js";
import { GetIdentityVerificationAttributesCommand, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../utils/sesClient.js";

const createVerifyEmailIdentityCommand = (emailAddress) => {
	return new VerifyEmailIdentityCommand({ EmailAddress: emailAddress });
};

const getEmails = async (req, res) => {
	try {
		const { id } = req.user;

		// Fetch all email accounts for the user
		const emailAccs = await db.select()
			.from(emailAccounts)
			.where(eq(emailAccounts.userId, id))

		return res
			.status(200)
			.json({ message: 'List of verified email accounts', data: emailAccs });

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}

const addEmailAccount = async (req, res) => {
	try {
		const { emailId } = req.body;
		const { id } = req.user;

		if (emailId === "") {
			return res
				.status(204)
				.json({ message: 'Email Id cannot be empty' });
		}

		// Check if the email already exists for this user
		const existingAccount = await db.select()
			.from(emailAccounts)
			.where(and(eq(emailAccounts.userId, id), eq(emailAccounts.emailId, emailId)))
			.limit(1);

		if (existingAccount.length > 0) {
			return res.status(409).json({ error: 'An email with this ID already exists for this user.' });
		}

		const [account] = await db.insert(emailAccounts).values({
			emailId,
			status: 'Pending',
			userId: id
		}).returning();

		// AWS SES verification
		const verifyEmailIdentityCommand = createVerifyEmailIdentityCommand(emailId);
		await sesClient.send(verifyEmailIdentityCommand);

		return res
			.status(200)
			.json({ message: 'Email confirmation sent successfully', account });

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const checkAllEmailStatuses = async (req, res) => {
	try {
		const { id } = req.user;

		// Fetch all email accounts for the user
		const userAccounts = await db.select()
			.from(emailAccounts)
			.where(eq(emailAccounts.userId, id));

		if (userAccounts.length === 0) {
			return res.status(200).json({ error: 'No email accounts found for this user' });
		}

		const emailIds = userAccounts.map(account => account.emailId);

		// Check status with AWS SES for all email IDs
		const command = new GetIdentityVerificationAttributesCommand({
			Identities: emailIds,
		});
		const response = await sesClient.send(command);

		const updatedStatuses = [];

		for (const account of userAccounts) {
			const awsStatus = response.VerificationAttributes[account.emailId]?.VerificationStatus || 'NotFound';

			// Update status in the database if it has changed
			if (awsStatus !== account.status) {
				await db.update(emailAccounts)
					.set({ status: awsStatus })
					.where(eq(emailAccounts.id, account.id));

				updatedStatuses.push({
					emailId: account.emailId,
					oldStatus: account.status,
					newStatus: awsStatus
				});
			}

			account.status = awsStatus; // Update the status for the response
		}

		return res.status(200).json({
			accounts: userAccounts,
			updatedStatuses: updatedStatuses.length > 0 ? updatedStatuses : undefined
		});

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};




export { addEmailAccount, checkAllEmailStatuses, getEmails }