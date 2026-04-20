import { z } from "zod";
import { UPLOAD_TYPE_KEYS } from "../../constants/uploadFolder.js";

export const uploadSignatureSchema = z.object({
  body: z.object({
    type: z.enum(UPLOAD_TYPE_KEYS),
  }),
});
