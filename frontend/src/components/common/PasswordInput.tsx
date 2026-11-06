import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "light" | "dark";
}

export default function PasswordInput({
  variant = "light",
  className = "",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const iconColor =
    variant === "dark"
      ? "text-brand-cream/75 hover:text-brand-cream"
      : "text-brand-text/70 hover:text-brand-text";

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`${className} pr-10`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className={`absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center transition ${iconColor}`}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}