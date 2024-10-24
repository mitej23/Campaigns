import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addEmailAccount, checkAllEmailStatuses, getEmails } from '../controller/email_account.controller.js';

const router = Router()

router.post("/add", verifyJWT, addEmailAccount)
router.get("/check-email-statuses", verifyJWT, checkAllEmailStatuses)
router.get('/emails', verifyJWT, getEmails)


export default router