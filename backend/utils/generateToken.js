import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
    const currentTime = Math.floor(Date.now() / 1000);
    console.log('Token generated at:', new Date(currentTime * 1000));
    console.log('Generating token with JWT_SECRET:', process.env.JWT_SECRET); // Debug
    const token = jwt.sign(
        { id: userId, role: role, iat: currentTime },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );
    console.log('Generated token:', token);
    return token;
};