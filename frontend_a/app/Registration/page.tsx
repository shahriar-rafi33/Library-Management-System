"use client";

import { useState } from "react";
import { z } from "zod";
import Title from "@/Content/Title";
import Input from "@/Content/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api,getAxiosErrorMessage } from "@/lib/api";

export const adminSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone must contain only digits" }),

  age: z
    .coerce
    .number()
    .int({ message: "Age must be an integer" })
    .min(18, { message: "Age must be at least 18" })
    .max(80, { message: "Age must not exceed 80" }),
});

export const librarianSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone must contain only digits" }),

  age: z
    .coerce
    .number()
    .int({ message: "Age must be an integer" })
    .min(18, { message: "Age must be at least 18" })
    .max(70, { message: "Age must not exceed 70" }),

  designation: z
    .string()
    .min(1, { message: "Designation is required" }),

  isActive: z
    .coerce
    .boolean(),
});


export default function RegisterPage() {
  const router = useRouter();
  const [type, setType] = useState<"admin" | "librarian">("admin");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    firstName: "",
    lastName: "",
    designation: "",
    isActive: true,
  });

  function handleChange(e: any) {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  }

  function zodToErrors(err: z.ZodError) {
    const map: Record<string, string> = {};
    err.issues.forEach((i) => (map[String(i.path[0] ?? "form")] = i.message));
    return map;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setLoading(true);

    try {
      if (type === "admin") {
        const data = {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          age: form.age,
        };

        const parsed = adminSchema.safeParse(data);
        if (!parsed.success) {
          setErrors(zodToErrors(parsed.error));
          return;
        }

        const response = await api.post("/admin/register", parsed.data);
        console.log("ADMIN REGISTER:", response.data);

        setSuccess(true);
        setTimeout(() => router.push("/LogIn"), 700);
        return;
      }

      const data = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        age: form.age,
        designation: form.designation,
        isActive: form.isActive,
      };

      const parsed = librarianSchema.safeParse(data);
      if (!parsed.success) {
        setErrors(zodToErrors(parsed.error));
        return;
      }

      const response = await api.post("/librarian/register", parsed.data);
      console.log("LIBRARIAN REGISTER:", response.data);

      setSuccess(true);
      setTimeout(() => router.push("/LogIn"), 700);
    } catch (error) {
      setErrors({ form: getAxiosErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <Title title="Register" />
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <label className="block mb-2 font-medium">Register as</label>
      <select
        className="border rounded px-3 py-2 mb-4 w-full"
        value={type}
        onChange={(e) => {
          setType(e.target.value as any);
          setErrors({});
          setSuccess(false);
        }}
      >
        <option value="admin">Admin</option>
        <option value="librarian">Librarian</option>
      </select>

      <form onSubmit={handleSubmit} noValidate>
        {type === "admin" ? (
          <>
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            <Input label="Age" name="age" value={String(form.age)} onChange={handleChange} error={errors.age} />
          </>
        ) : (
          <>
            <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            <Input label="Age" name="age" value={String(form.age)} onChange={handleChange} error={errors.age} />
            <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} error={errors.designation} />
          </>
        )}

        {errors.form && <p className="text-red-600 text-sm mb-3">{errors.form}</p>}

        <button className="px-4 py-2 bg-red-700 text-white rounded" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-3 text-sm">
          Already have an account? <Link className="underline" href="/LogIn">Login</Link>
        </p>

        {success && <p className="text-green-600 text-sm mt-3">Registration successful!</p>}
      </form>
    </div>
  );
}
