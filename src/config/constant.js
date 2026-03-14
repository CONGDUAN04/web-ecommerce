export const ACCOUNT_TYPE = {
    SYSTEM: "SYSTEM",
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB",
};

export const ROLE = {
    ADMIN: "Admin",
    USER: "User",
};

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
};