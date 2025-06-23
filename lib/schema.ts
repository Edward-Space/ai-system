import { z } from "zod";
import FORM_DATA_SCHEMA from "./validate";

export const loginSchema = z.object({
  username: FORM_DATA_SCHEMA.full_name,
  password: FORM_DATA_SCHEMA.password_login,
});
export type TLoginSchema = z.infer<typeof loginSchema>;

export const createBotSchema = z.object({
  name: FORM_DATA_SCHEMA.full_name,
  description: z.string().optional(),
});
export type TCreateBotSchema = z.infer<typeof createBotSchema>;

export const createKnowledgeSchema = z.object({
  name: FORM_DATA_SCHEMA.full_name,
  description: z.string().optional(),
  import_type: z.string().optional(),
});
export type TCreateKnowledgeSchema = z.infer<typeof createKnowledgeSchema>;
