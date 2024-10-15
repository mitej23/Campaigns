import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { campaigns, users } from "../db/schema.js";

const getAllCampaigns = async (req, res) => {
  try {
    const { id } = req.user;

    const allCampaigns = await db.select().from(campaigns).where(eq(campaigns.userId, id))

    console.log(allCampaigns)

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

const addCampaign = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.user;

    const [campaign] = await db.insert(campaigns).values({
      name,
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

    const [updatedCampaign] = await db.update(campaigns)
      .set({ name })
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



export { getAllCampaigns, addCampaign, updateCampaign }