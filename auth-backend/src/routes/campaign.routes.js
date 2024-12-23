import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addCampaign, addContact, addSomeContacts, getAllCampaigns, getIdvCampaigns, publishCampaign, removeContact, saveEditor, updateCampaign } from '../controller/campaign.controller.js';


const router = Router()

router.get("/", verifyJWT, getAllCampaigns)
router.get("/:id", verifyJWT, getIdvCampaigns)
router.post('/create-campaign', verifyJWT, addCampaign);
router.put('/update-campaign', verifyJWT, updateCampaign);
router.post('/add-contact', verifyJWT, addContact)
router.post('/add-some-contact', verifyJWT, addSomeContacts)
router.post('/remove-contact', verifyJWT, removeContact)
router.post('/save-editor', verifyJWT, saveEditor)
router.post('/publish-campaign', verifyJWT, publishCampaign)




export default router