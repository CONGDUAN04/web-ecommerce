import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;

const hashPassword = async (plainText) => {
  if (!plainText) throw new Error("Password is required");
  return bcrypt.hash(plainText, saltRounds);
};

const comparePassword = async (plainText, hashedPassword) => {
  if (!plainText || !hashedPassword) return false;
  return bcrypt.compare(plainText, hashedPassword);
};

export { hashPassword, comparePassword };
