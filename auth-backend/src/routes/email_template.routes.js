import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addEmailTemplate, getAllEmailTemplates, getEmailTemplate, updateEmailTemplate } from '../controller/email_template.controller.js';


const router = Router()

router.get('/', verifyJWT, getAllEmailTemplates)
router.get('/:id', verifyJWT, getEmailTemplate)
router.post('/create-email-template', verifyJWT, addEmailTemplate);
router.post('/update-email-template', verifyJWT, updateEmailTemplate);




export default router