import bcrypt from "bcrypt";
const saltRounds = 10;
const hashPassword = async (plainText) => {
    return await bcrypt.hash(plainText, saltRounds)
}
const comparePassword = async (plainText, hashPassword) => {
    return await bcrypt.compare(plainText, hashPassword);
}
export {
    hashPassword,
    comparePassword
}