import React from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
};

export default function Input({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}: Props) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-white">{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black
                   focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
