import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = (plainText) => {
    return bcrypt.hash(plainText, saltRounds);
};
