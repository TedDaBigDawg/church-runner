"use client";

import { useState } from "react";
import Link from "next/link";
import { register } from "@/actions/auth-actions";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { registerSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

export type RegisterValues = z.infer<typeof registerSchema>;
export default function RegisterPage() {
  const router = useRouter();
  // const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      phone: "",
    },
    mode: "onChange",
  });

  // async function handleSubmit(formData: RegisterValues) {
  //   // setError(null);
  //   // setIsSubmitting(true);

  //   try {
  //     // const name = formData.get("name") as string;
  //     // const email = formData.get("email") as string;
  //     // const password = formData.get("password") as string;
  //     // const phone = (formData.get("phone") as string) || undefined;

  //     // const result = registerSchema.safeParse({ name, email, password, phone });
  //     if (!result.success) {
  //       const fieldErrors = result.error.flatten().fieldErrors;
  //       const firstError =
  //         fieldErrors.name?.[0] ||
  //         fieldErrors.email?.[0] ||
  //         fieldErrors.password?.[0] ||
  //         fieldErrors.phone?.[0] ||
  //         "Invalid form data";

  //       setError(firstError);
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     const registerResult = await register(formData);

  //     if (registerResult?.error) {
  //       if (registerResult.error.includes("already exists")) {
  //         setError(
  //           "An account with this email already exists. Please use a different email or try logging in."
  //         );
  //       } else {
  //         setError(registerResult.error);
  //       }
  //     }
  //     const redirectUrl = "/login";
  //     router.push(redirectUrl || "/");
  //     router.refresh();
  //   } catch (err: any) {
  //     setError(
  //       err.message || "An unexpected error occurred. Please try again."
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }

  const handleSubmit = async (data: RegisterValues) => {
    try {
      const res = await register(data);
      if (res != null) {
        setIsSubmitting(true);
        const redirectUrl = "/login";
        router.push(redirectUrl || "/");
        router.refresh();
      }
      return;
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center text-black justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold">
            Create an account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className=" flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage className=" text-red-800" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage className=" text-red-800" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage className=" text-red-800" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage className=" text-red-800" />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting} className=" hover:bg-primary">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1a1a1a] hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
