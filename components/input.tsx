import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}

const Input = ({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  console.log(rest);
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="w-full h-10 transition bg-transparent border-none rounded-md focus:outline-none ring-1 focus:ring-4 ring-neutral-200 focus:ring-orange-500 placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="font-medium text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
};

export default Input;
