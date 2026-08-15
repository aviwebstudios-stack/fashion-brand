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
      ? "text-[#f4f1e8]/50 hover:text-[#f4f1e8]"
      : "text-[#2b2b26]/50 hover:text-[#2b2b26]";

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`${className} pr-10`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition ${iconColor}`}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}