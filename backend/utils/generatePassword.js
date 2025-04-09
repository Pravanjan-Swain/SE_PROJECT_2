import bcrypt from 'bcryptjs';

// Default salt rounds if not specified in environment
const DEFAULT_SALT_ROUNDS = 10;

export const generateHashedPassword = async (newPassword) => {
  // Validate input
  if (!newPassword || typeof newPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  // Ensure salt rounds is a valid number
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || DEFAULT_SALT_ROUNDS;
  if (isNaN(saltRounds) || saltRounds < 1) {
    throw new Error('Invalid salt rounds configuration');
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};