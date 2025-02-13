import { z } from "zod";

const loginValidator = z.object({
  email: z.string({
    required_error:"Email is required"
  }).email(),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error:"password must be string"
  })
})

export const AuthValidation = {
  loginValidator
}