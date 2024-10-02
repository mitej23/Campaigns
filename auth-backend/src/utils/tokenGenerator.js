import jwt from "jsonwebtoken"

// create access and refresh token functions
export const generateAccessToken = async (payload) => {
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, secret, options);
}

export const generateRefreshToken = async (payload) => {
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '10d' };
  return jwt.sign(payload, secret, options);
}