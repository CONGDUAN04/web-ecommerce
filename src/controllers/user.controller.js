// import { postCreateUserServices } from "../services/user.services.js";
export const postCreateUser = async (req, res) => {
    const { name, email, address } = req.body;
    const user = await postCreateUserServices(name, email, address);
    return res.status(200).json({
        ErrorCode: 0,
        data: user
    });
}
