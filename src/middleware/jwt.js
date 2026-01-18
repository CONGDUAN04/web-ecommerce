import jwt from "jsonwebtoken";

const checkValidJWT = (req, res, next) => {
    const path = req.originalUrl.replace(/^\/api/, '');
    // ✅ whitelist: bỏ qua check JWT cho login (có thể thêm /register nếu muốn)
    const whiteList = [
        "/login",
        "/register",
        "/add-product-to-cart",
        "/logout"
    ];

    const isWhiteList = whiteList.some(route => path.startsWith(route));
    if (isWhiteList) {
        next();
        return;
    }
    console.log("REQ PATH:", req.path);
    console.log("IS WHITELIST:", isWhiteList);

    const token = req.headers['authorization']?.split(' ')[1];
    try {
        if (!token) {
            return res.status(401).json({
                data: null,
                message: "Không có token trong header"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                data: null,
                message: "Thiếu JWT_SECRET trong server config"
            });
        }

        const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: dataDecoded.id,
            username: dataDecoded.username,
            fullName: dataDecoded.fullName,
            address: dataDecoded.address,
            phone: dataDecoded.phone,
            password: dataDecoded.password,
            accountType: dataDecoded.accountType,
            avatar: dataDecoded.avatar,
            roleId: dataDecoded.roleId,
            role: dataDecoded.role,
        };

        next(); // ✅ chỉ gọi next khi token hợp lệ
    } catch (error) {
        return res.status(401).json({
            data: null,
            message: "Token không hợp lệ (không truyền lên token hoặc token hết hạn)"
        });
    }
}

export const isLogin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    if (req.user?.role?.name !== "ADMIN") return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    next();
};

export {
    checkValidJWT
};