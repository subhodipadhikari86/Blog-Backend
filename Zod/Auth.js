import z, { number } from "zod";
export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(6, { message: "Name Must be at Least 6 Characters Long" })
    .max(100),
  email: z
    .string()
    .trim()
    .email({ message: "Please Enter a Valid Email Address" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password Must be 6 characters Long" })
    .refine((val)=>{
        return val.includes('@')
    },{
        message:"Password Should Contain @"
    })
});

export const LogInSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please Enter a Valid Email Address" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password can't be Empty" }),
});
