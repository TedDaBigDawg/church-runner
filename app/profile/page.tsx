"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserProfile, updateUserProfile } from "@/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema } from "@/lib/validations";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

type ProfileFormData = {
  name: string;
  phone: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = form;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
        // Reset form with fetched data
        reset({
          name: data.name,
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: "error", text: "Failed to load profile" });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setMessage(null);

    try {
      // Convert to FormData for server action
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);

      const updateResult = await updateUserProfile(formData);

      if (updateResult.error) {
        setMessage({ type: "error", text: updateResult.error });
      } else if (updateResult.success) {
        setProfile(updateResult.user);
        setMessage({ type: "success", text: "Profile updated successfully" });
        // Reset form state to mark as clean
        reset(data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  const onReset = () => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone || "",
      });
      setMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600">
            View and update your personal information.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {message &&
              (message.type === "success" ? (
                <SuccessMessage message={message.text} className="mb-4" />
              ) : (
                <ErrorMessage message={message.text} className="mb-4" />
              ))}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter your full name"
                      aria-invalid={errors.name ? "true" : "false"}
                      className={errors.name ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  Email cannot be changed for security reasons.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      aria-invalid={errors.phone ? "true" : "false"}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onReset}
                  disabled={!isDirty}
                >
                  Reset Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
