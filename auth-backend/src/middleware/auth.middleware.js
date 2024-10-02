import jwt from 'jsonwebtoken'
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ "message": "Unauthorized request" })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    let temp = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, decodedToken.id))
    req.user = temp[0]
    next()

  } catch (error) {
    console.log(error)
    return res.status(401).json({ "message": "Invalid Access Token" })
  }
}