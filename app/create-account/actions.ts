"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import z from "zod";

// const checkUsername = (username: string) => !username.includes("hogkim");
const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (username: string) => {
  const userName = await db.user.findUnique({
    where: {
      // 콜론 앞의 username은 db의 username필드, 콜론 뒤의 username은 함수의 매개 변수 username
      username: username,
    },
    select: {
      id: true,
    },
  });
  // userName이 존재할 때 false를 return하고 싶으므로.
  return !Boolean(userName);
};

const checkUniqueEmail = async (email: string) => {
  const userEmail = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(userEmail);
};

const formSchema = z
  .object({
    username: z
      .string()
      .toLowerCase()
      .trim()
      .refine(checkUniqueUsername, "This username is already taken."),
    // .refine(checkUsername, 'no "hogkim"s allowed'),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        "There is an account already registered with that email."
      ),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // check if username is taken
    const user = await db.user.findUnique({
      where: {
        username: result.data.username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      // show an error
    }
    // check if the email is already used
    const userEmail = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
      },
    });
    if (userEmail) {
      // show an error
    }
    console.log(userEmail);
    // hash password
    // save the user to db
    // log the user in
    // redirect "/home"
  }
}
