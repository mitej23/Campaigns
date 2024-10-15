import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addCampaign, getAllCampaigns, updateCampaign } from '../controller/campaign.controller.js';


const router = Router()

router.get("/", verifyJWT, getAllCampaigns)
router.post('/create-campaign', verifyJWT, addCampaign);
router.put('/update-campaign', verifyJWT, updateCampaign);




export default router