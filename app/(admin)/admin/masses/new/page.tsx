"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { createMass } from "@/actions/mass-actions";
import { getChurchInfo } from "@/actions/church-info-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const massFormSchema = z.object({
  title: z.string().min(1, "Mass title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().optional(),
  useDefaultLocation: z.boolean().default(true),
  intentionSlots: z.coerce.number().min(0, "Must be 0 or greater").default(5),
  thanksgivingSlots: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .default(3),
});

type MassFormData = z.infer<typeof massFormSchema>;

export default function NewMassPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MassFormData>({
    resolver: zodResolver(massFormSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      useDefaultLocation: true,
      intentionSlots: 5,
      thanksgivingSlots: 3,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = form;

  const useDefaultLocation = watch("useDefaultLocation");

  useEffect(() => {
    async function fetchChurchInfo() {
      try {
        const churchInfo = await getChurchInfo();
        setDefaultAddress(churchInfo.address);
      } catch (error) {
        console.error("Error fetching church info:", error);
        toast({
          title: "Error",
          description: "Failed to fetch church information",
          variant: "destructive",
        });
      }
    }
    fetchChurchInfo();
  }, [toast]);

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setValue("date", today);
  }, [setValue]);

  const onSubmit = async (data: MassFormData) => {
    setIsSubmitting(true);

    try {
      // Create FormData for the server action
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("date", data.date);
      formData.set("time", data.time);
      formData.set("useDefaultLocation", data.useDefaultLocation.toString());
      formData.set(
        "location",
        data.useDefaultLocation ? "" : data.location || ""
      );
      formData.set("intentionSlots", data.intentionSlots.toString());
      formData.set("thanksgivingSlots", data.thanksgivingSlots.toString());

      const result = await createMass(formData);

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Mass created successfully",
      });

      router.push("/admin/masses");
      router.refresh();
    } catch (error) {
      console.error("Error creating mass:", error);
      toast({
        title: "Error",
        description: "Failed to create mass",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Mass</h1>
          <p className="text-gray-600">
            Create a new mass with intention and thanksgiving slots.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mass Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Mass Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Mass Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Sunday Mass"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("date")}
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" {...register("time")} />
                {errors.time && (
                  <p className="text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="useDefaultLocation"
                    checked={useDefaultLocation}
                    onCheckedChange={(checked) => {
                      setValue("useDefaultLocation", checked === true);
                    }}
                  />
                  <Label
                    htmlFor="useDefaultLocation"
                    className="cursor-pointer"
                  >
                    Use default church address
                  </Label>
                </div>

                {useDefaultLocation ? (
                  <div className="p-3 bg-gray-100 rounded-md">
                    <p className="text-gray-700">
                      {defaultAddress || "Loading default address..."}
                    </p>
                  </div>
                ) : (
                  <>
                    <Input
                      id="location"
                      placeholder="e.g., Main Church"
                      {...register("location", {
                        required: !useDefaultLocation
                          ? "Location is required when not using default address"
                          : false,
                      })}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600">
                        {errors.location.message}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Mass Intention Slots */}
              <div className="space-y-2">
                <Label htmlFor="intentionSlots">Mass Intention Slots</Label>
                <Input
                  id="intentionSlots"
                  type="number"
                  min="0"
                  {...register("intentionSlots")}
                />
                {errors.intentionSlots && (
                  <p className="text-sm text-red-600">
                    {errors.intentionSlots.message}
                  </p>
                )}
              </div>

              {/* Thanksgiving Slots */}
              <div className="space-y-2">
                <Label htmlFor="thanksgivingSlots">Thanksgiving Slots</Label>
                <Input
                  id="thanksgivingSlots"
                  type="number"
                  min="0"
                  {...register("thanksgivingSlots")}
                />
                {errors.thanksgivingSlots && (
                  <p className="text-sm text-red-600">
                    {errors.thanksgivingSlots.message}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/admin/masses">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Mass"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
