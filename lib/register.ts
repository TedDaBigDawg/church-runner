import { z } from "zod";
const phoneNumberRegex = /^\+234[789][01]\d{8}$/;

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Your name is too short" }),
  email: z.string().email(),
  password: z.string().min(2, { message: "Enter a valid passsword" }),
  phone: z.string(),
});
