"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { updateAdmin, resetAdminPassword } from "@/actions/admin-actions";
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
import { SuccessMessage } from "@/components/ui/success-message";
import { RegisterValues } from "@/app/register/page";
import { editSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { z } from "zod";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export default function EditAdminPage() {
  const params = useParams();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const response = await fetch(`/api/admins/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch administrator");
        }
        const data = await response.json();
        setAdmin(data);
      } catch (error) {
        console.error("Error fetching administrator:", error);
        setError("Failed to load administrator details");
      } finally {
        setLoading(false);
      }
    }

    fetchAdmin();
  }, [params.id]);

  type EditValues = z.infer<typeof editSchema>;

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      email: admin?.email ?? "",
      name: admin?.name ?? "",
      phone: admin?.phone ?? "",
    },
    mode: "onChange",
  });

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await updateAdmin(params.id as string, formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setAdmin(result.admin);
        setSuccess("Administrator updated successfully");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword() {
    setError(null);
    setSuccess(null);
    setIsResettingPassword(true);

    try {
      const result = await resetAdminPassword(params.id as string);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(
          `Password reset successfully. New password: ${result.newPassword}`
        );
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsResettingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center">Loading administrator details...</p>
        </div>
      </div>
    );
  }

  if (error && !admin) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/superadmin/admins">
              <Button>Back to Administrators</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Administrator
          </h1>
          <p className="text-gray-600">
            Update administrator details or reset password.
          </p>
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
                onSubmit={form.handleSubmit(handleResetPassword)}
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
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

          <CardFooter className="flex flex-col items-start border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reset Password
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This will generate a new random password for the administrator.
              They will need to change it after logging in.
            </p>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-800"
              onClick={handleResetPassword}
              disabled={isResettingPassword}
            >
              {isResettingPassword ? "Resetting..." : "Reset Password"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
