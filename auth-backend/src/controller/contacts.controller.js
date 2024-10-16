import { eq } from "drizzle-orm";
import { contacts } from "../db/schema.js";
import { db } from "../db/index.js";


const getAllContacts = async (req, res) => {
	try {
		const { id } = req.user;

		const allContacts = await db
			.select()
			.from(contacts)
			.where(eq(contacts.usersId, id))

		return res
			.status(200)
			.json({ message: 'List of all contacts.', data: allContacts });

	} catch (error) {
		console.log(error)

		return res
			.status(500)
			.json({ error: 'Internal server error' });
	}
}

const addContact = async (req, res) => {
	try {
		const { name, email } = req.body
		const { id } = req.user;

		const existingContact = await db
			.select()
			.from(contacts)
			.where(eq(contacts.usersId, id))
			.where(eq(contacts.email, email))
			.limit(1);

		if (existingContact.length > 0) {
			return res.status(409).json({ error: 'User already exists in your contact list.' });
		}

		const [contact] = await db.insert(contacts).values({
			name,
			email,
			usersId: id
		}).returning()

		return res
			.status(201)
			.json({ message: 'Contact added successfully', contact });


	} catch (error) {
		console.log(error)

		return res
			.status(500)
			.json({ error: 'Internal server error' });
	}
}

const updateContact = async (req, res) => {
	try {
		const { id } = req.user;
		const { name, email, contactId } = req.body

		const [updatedContact] = await db
			.update(contacts)
			.set({ name, email })
			.where(eq(contacts.id, contactId))
			.returning()

		if (!updateContact) {
			return res.status(404).json({ error: 'Contact not found' });
		}

		res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });


	} catch (error) {
		console.log(error)

		return res
			.status(500)
			.json({ error: 'Internal server error' });
	}
}

export { getAllContacts, addContact, updateContact }
