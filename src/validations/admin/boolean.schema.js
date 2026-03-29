import { z } from "zod";

export const zBoolean = z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
}, z.boolean());
