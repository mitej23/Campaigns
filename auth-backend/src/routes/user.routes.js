import { Router } from 'express'
import { db } from '../db/index.js'
import { users } from '../db/schema.js';
import { googleOAuthHandler, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controller/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router()

router.get('/', async (req, res) => {
  const result = await db.select().from(users).limit(10);
  res.json(result)
})

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.get("/google/callback", googleOAuthHandler)

export default router