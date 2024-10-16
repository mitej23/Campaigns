import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addContact, getAllContacts, updateContact } from '../controller/contacts.controller.js';


const router = Router()

router.get("/", verifyJWT, getAllContacts)
router.post('/add-contact', verifyJWT, addContact);
router.put('/update-contact', verifyJWT, updateContact);




export default router