import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from "../utils/tokenGenerator.js";
import { getGoogleOAuthTokens, getGoogleUser } from "../utils/googleAuth.js";

// get user id of the user and teh n only return back inside the token.
const registerUser = async (req, res) => {
  try {
    // validation
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existedUser = await db.select().from(users).where(eq(users.email, email));
    if (existedUser.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // create user
    let tempUser = { email, name }
    const hashedPassword = await bcrypt.hash(password, 10);


    const options = {
      httpOnly: true,
      secure: true
    }

    const result = await db.insert(users).values({ ...tempUser, password: hashedPassword, }).returning()
    const refreshToken = await generateRefreshToken({ ...tempUser, id: result[0].id })
    const accessToken = await generateAccessToken({ ...tempUser, id: result[0].id });

    const userResult = await db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.email, email))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email
      })

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(201)
      .json(userResult[0]);


  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }


}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existedUser = await db.select().from(users).where(eq(users.email, email));
    if (existedUser.length === 0) {
      return res.status(404).json({ message: "User doesn't exists" });
    }

    const user = existedUser[0]
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const refreshToken = await generateRefreshToken({ id: user.id, name: user.name, email: user.email })
    const accessToken = await generateAccessToken({ id: user.id, name: user.name, email: user.email });

    const options = {
      httpOnly: true,
      secure: true
    }

    const result = await db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.email, email))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email
      })

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json(result[0]);

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const logoutUser = async (req, res) => {
  try {
    await db.update(users).set({ refreshToken: null }).where(eq(users.email, req.user.email)).returning().then((result) => {
      console.log(result)
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    });

    const options = {
      httpOnly: true,
      secure: true
    }
    return res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json({ message: 'Logout successful' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: 'Unauthorized Access' });
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET)
    let tempUser = await db.select().from(users).where(eq(users.id, decodedToken.id))

    if (tempUser.length === 0) {
      return res.status(401).json({ message: 'Invalid Refresh Token' });
    }


    if (incomingRefreshToken !== tempUser[0].refreshToken) {
      return res.status(401).json({ message: 'Refresh Token is expired or user' });
    }

    let user = {
      id: tempUser[0].id,
      name: tempUser[0].name,
      email: tempUser[0].email
    }

    const refreshToken = await generateRefreshToken({ ...user })
    const accessToken = await generateAccessToken({ ...user });

    const options = {
      httpOnly: true,
      secure: true
    }

    const result = await db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.email, user.email))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email
      })

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json(result[0]);


  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const googleOAuthHandler = async (req, res) => {
  const code = req.query.code

  try {
    // get the id and access token with the code
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    console.log({ id_token, access_token });

    const googleUser = await getGoogleUser({ id_token, access_token });
    //jwt.decode(id_token);
    console.log({ googleUser });

    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }

    const userData = {
      email: googleUser.email,
      name: googleUser.name
    }

    // upsert the user 
    await db.insert(users)  // Insert into the users table
      .values(userData)  // User data
      .onConflictDoNothing({
        target: users.email,  // Conflict target on email
      })

    const result = await db.select().from(users).where(eq(users.email, userData.email))

    const refreshToken = await generateRefreshToken({ ...userData, id: result[0].id })
    const accessToken = await generateAccessToken({ ...userData, id: result[0].id });

    const userResult = await db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.email, userData.email))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email
      })


    const options = {
      httpOnly: true,
      secure: true
    }

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(201)
      .json(userResult[0]);

  } catch (error) {
    console.log(error)
  }
}

export { registerUser, loginUser, logoutUser, refreshAccessToken, googleOAuthHandler }