import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { emailTemplates } from "../db/schema.js";

const getAllEmailTemplates = async (req, res) => {
  try {
    const { id } = req.user

    const allEmailTemplates = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.userId, id))

    return res
      .status(200)
      .json({ message: 'List of all email templates.', data: allEmailTemplates });


  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ error: 'Internal server error' });
  }
}

const addEmailTemplate = async (req, res) => {
  try {
    const { name, subject, content } = req.body;
    const { id: userId } = req.user;

    const [template] = await db.insert(emailTemplates).values({
      name,
      subject,
      content,
      userId
    }).returning();

    return res
      .status(201)
      .json({ message: 'Email template created successfully', template });

  } catch (error) {
    console.error(error);

    if (error.constraint_name == "user_template_name_idx") {
      return res
        .status(409)
        .json({ error: "An email template with this name already exists." });
    }

    return res
      .status(500)
      .json({ error: 'Internal server error' });
  }
};

const updateEmailTemplate = async (req, res) => {
  try {
    const { name, subject, content, templateId } = req.body;

    const [updatedTemplate] = await db
      .update(emailTemplates)
      .set({
        name,
        subject,
        content
      })
      .where(eq(templateId, emailTemplates.id))
      .returning();

    return res
      .status(200)
      .json({ message: 'Email template updated successfully', updatedTemplate });

  } catch (error) {
    if (error.constraint_name == "user_template_name_idx") {
      return res
        .status(409)
        .json({ error: "An email template with this name already exists." });
    }

    return res
      .status(500)
      .json({ error: 'Internal server error' });
  }
}



export { getAllEmailTemplates, addEmailTemplate, updateEmailTemplate };