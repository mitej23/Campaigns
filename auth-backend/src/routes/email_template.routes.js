import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addEmailTemplate, updateEmailTemplate } from '../controller/email_template.controller.js';


const router = Router()

router.post('/create-email-template', verifyJWT, addEmailTemplate);
router.put('/update-email-template', verifyJWT, updateEmailTemplate);




export default router