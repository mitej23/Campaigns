import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { campaignContact, campaigns, emailAccounts } from "../db/schema.js";

const getAllCampaigns = async (req, res) => {
  try {
    const { id } = req.user;

    const allCampaigns = await db
      .select()
      .from(campaigns)
      .leftJoin(emailAccounts, eq(emailAccounts.id, campaigns.emailAccountsId))
      .where(eq(campaigns.userId, id))

    return res
      .status(200)
      .json({ message: 'List of all campaigns.', data: allCampaigns });


  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ error: 'Internal server error' });
  }
}

// allow user to add email which is not verified
const addCampaign = async (req, res) => {
  try {
    const { name, emailAccountsId } = req.body;
    const { id } = req.user;

    const [campaign] = await db.insert(campaigns).values({
      name,
      status: 'Unpublished',
      emailAccountsId,
      userId: id
    }).returning();

    return res
      .status(201)
      .json({ message: 'Campaign created successfully', campaign });

  } catch (error) {
    console.error(error);
    if (error.constraint_name === 'user_id_campaign_name_idx') {
      return res
        .status(409)
        .json({ error: 'A campaign with this name already exists.' });
    }

    return res
      .status(500)
      .json({ error: 'Internal server error' });
  }
}

const updateCampaign = async (req, res) => {
  try {
    const { name, campaignId } = req.body;
    const { id } = req.user;

    const [updatedCampaign] = await db.update(campaigns)
      .set({ name })
      .where(eq(campaigns.userId, id))
      .where(eq(campaigns.id, campaignId))
      .returning();

    if (!updatedCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign updated successfully', campaign: updatedCampaign });
  } catch (error) {
    console.error(error);

    if (error.constraint_name === 'user_id_campaign_name_idx') {
      return res
        .status(409)
        .json({ error: 'A campaign with this name already exists.' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}

const publishCampaign = async (req, res) => {
  // check firstly whether the campaign emailAccountId is verified
  // check whether it is not already published.
}


const addContact = async (req, res) => {
  try {
    const { contactId, campaignId } = req.body
    const { id } = req.user;

    const [contactCampaign] = await db.insert(campaignContact).values({
      contactId,
      campaignId,
      userId: id
    }).returning();

    return res
      .status(201)
      .json({ message: 'Contact added to campaign successfully', contactCampaign });



  } catch (error) {
    console.log(error)

    res.status(500).json({ error: 'Internal server error' });
  }
}

const removeContact = async (req, res) => {
  try {
    const { campaignContactId } = req.body
    const { id } = req.user;

    const [contactCampaignDeleted] = await db
      .delete(campaignContact)
      .where(eq(campaignContact.userId, id))
      .where(eq(campaignContact.id, campaignContactId))
      .returning();

    if (!contactCampaignDeleted) {
      return res.status(409).json({ error: 'Contact not found inside the campaign' });
    }

    return res
      .status(201)
      .json({ message: 'Contact removed from the campaign successfully', contactCampaignDeleted });



  } catch (error) {
    console.log(error)

    res.status(500).json({ error: 'Internal server error' });
  }
}


export { getAllCampaigns, addCampaign, updateCampaign, addContact, removeContact }