import { z } from "zod";
import { idParamSchema } from "../admin/params.js"; // import từ global params

// GET /notifications? page & limit optional
export const getNotificationsQuerySchema = z.object({
  query: z
    .object({
      page: z.string().optional(),
      limit: z.string().optional(),
    })
    .optional(),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

// PATCH /notifications/:id/read
export const markNotificationReadSchema = idParamSchema;

// DELETE /notifications/:id
export const deleteNotificationSchema = idParamSchema;
