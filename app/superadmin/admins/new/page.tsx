"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createAdmin } from "@/actions/admin-actions";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { Input } from "@/components/ui/input";
import { RegisterValues } from "@/app/register/page";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";

export default function NewAdminPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  async function handleSubmit(data: RegisterValues) {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    startTransition(() => {
      createAdmin(data)
        .then((result) => {
          if (result?.error) {
            setError(result.error);
            setIsSubmitting(false);
          } else {
            setSuccess("Administrator created successfully!");
            setIsSubmitting(false);
          }
        })
        .catch((error) => {
          console.error("Error creating admin:", error);
          setError("Failed to create administrator");
          setIsSubmitting(false);
        });
    });
  }

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Administrator
          </h1>
          <p className="text-gray-600">Create a new administrator account.</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Administrator Details</CardTitle>
          </CardHeader>

          <CardContent>
            {error && <ErrorMessage message={error} className="mb-4" />}
            {success && <SuccessMessage message={success} className="mb-4" />}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className=" flex flex-col gap-2"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <Input {...field} id="name" name="name" required />
                      <FormMessage className=" text-red-800" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email Address</FormLabel>
                      <Input
                        {...field}
                        id="email"
                        name="email"
                        type="email"
                        required
                      />
                      <FormMessage className=" text-red-800" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters and include
                        uppercase, lowercase, and numbers
                      </p>
                      <FormMessage className=" text-red-800" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phone">
                        Phone Number (Optional)
                      </FormLabel>
                      <Input {...field} id="phone" name="phone" type="tel" />
                      <FormMessage className=" text-red-800" />
                    </FormItem>
                  )}
                  control={form.control}
                />
                <div className="mt-6 flex justify-end space-x-4">
                  <Link href="/superadmin/admins">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Administrator"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
