import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { sentEmails } from "../db/schema.js";

const getEmailsSent = async (req, res) => {
	try {
		const { id } = req.user;

		const result = await db.query.sentEmails.findMany({
			where: and(eq(sentEmails.userId, id), eq(sentEmails.status, "sent")),
			orderBy: (sentEmails, { desc }) => [desc(sentEmails.createdAt)],
			with: {
				campaign: true,
				contact: true
			}
		})

		return res
			.status(200)
			.json({ message: 'List of all emails.', data: result });

	} catch (error) {
		console.log(error)

		return res
			.status(500)
			.json({ error: 'Internal server error' });
	}
}

export default getEmailsSent