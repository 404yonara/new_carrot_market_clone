"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

const CreateAccount = () => {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="username"
          errors={state?.fieldErrors.username}
          type="text"
          required
          placeholder="Username"
          minLength={3}
          maxLength={10}
        />
        <Input
          name="email"
          errors={state?.fieldErrors.email}
          type="email"
          required
          placeholder="Email"
        />
        <Input
          name="password"
          errors={state?.fieldErrors.password}
          type="password"
          required
          placeholder="Password"
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          name="confirmPassword"
          errors={state?.fieldErrors.confirmPassword}
          type="password"
          required
          placeholder="Confirm Password"
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
};

export default CreateAccount;
