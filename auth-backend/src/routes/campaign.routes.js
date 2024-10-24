import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addCampaign, addContact, getAllCampaigns, getIdvCampaigns, removeContact, updateCampaign } from '../controller/campaign.controller.js';


const router = Router()

router.get("/", verifyJWT, getAllCampaigns)
router.get("/:id", verifyJWT, getIdvCampaigns)
router.post('/create-campaign', verifyJWT, addCampaign);
router.put('/update-campaign', verifyJWT, updateCampaign);
router.post('/add-contact', verifyJWT, addContact)
router.post('/remove-contact', verifyJWT, removeContact)




export default router