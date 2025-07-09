"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateMass } from "@/actions/mass-actions";
import { getChurchInfo } from "@/actions/church-info-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Mass {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  availableIntentionsSlots: number;
  availableThanksgivingsSlots: number;
  _count: {
    massIntentions: number;
    thanksgivings: number;
  };
}

const formSchema = z.object({
  title: z.string().min(1, "Mass title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().optional(),
  useDefaultLocation: z.boolean().default(false),
  intentionSlots: z.coerce
    .number()
    .min(0, "Intention slots must be at least 0"),
  thanksgivingSlots: z.coerce
    .number()
    .min(0, "Thanksgiving slots must be at least 0"),
});

type FormData = z.infer<typeof formSchema>;

export default function EditMassPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [mass, setMass] = useState<Mass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      useDefaultLocation: false,
      intentionSlots: 0,
      thanksgivingSlots: 0,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const useDefaultLocation = watch("useDefaultLocation");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch mass and church info in parallel
        const [massResponse, churchInfo] = await Promise.all([
          fetch(`/api/masses/${params.id}`),
          getChurchInfo(),
        ]);

        if (!massResponse.ok) {
          throw new Error("Failed to fetch mass");
        }

        const massData = await massResponse.json();

        // Format date and time for the input fields
        const massDate = new Date(massData.date);
        const formattedDate = massDate.toISOString().split("T")[0];
        const formattedTime = massDate.toTimeString().slice(0, 5);

        const processedMass = {
          ...massData,
          date: formattedDate,
          time: formattedTime,
        };

        setMass(processedMass);
        setDefaultAddress(churchInfo.address);

        // Calculate total slots (available + booked)
        const totalIntentionSlots =
          massData.availableIntentionsSlots + massData._count.massIntentions;
        const totalThanksgivingSlots =
          massData.availableThanksgivingsSlots + massData._count.thanksgivings;

        // Check if the mass location is the same as the default address
        const isUsingDefault = massData.location === churchInfo.address;

        // Set form values
        form.reset({
          title: massData.title,
          date: formattedDate,
          time: formattedTime,
          location: isUsingDefault ? "" : massData.location,
          useDefaultLocation: isUsingDefault,
          intentionSlots: totalIntentionSlots,
          thanksgivingSlots: totalThanksgivingSlots,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load mass details");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, form]);

  // Update validation rules when booked slots change
  useEffect(() => {
    if (mass) {
      const intentionSchema = z.coerce
        .number()
        .min(
          mass._count.massIntentions,
          `Must be at least ${mass._count.massIntentions} (currently booked)`
        );

      const thanksgivingSchema = z.coerce
        .number()
        .min(
          mass._count.thanksgivings,
          `Must be at least ${mass._count.thanksgivings} (currently booked)`
        );
    }
  }, [mass]);

  async function onSubmit(data: FormData) {
    try {
      // Create FormData object for server action
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("date", data.date);
      formData.set("time", data.time);
      formData.set("useDefaultLocation", data.useDefaultLocation.toString());
      formData.set("intentionSlots", data.intentionSlots.toString());
      formData.set("thanksgivingSlots", data.thanksgivingSlots.toString());

      // If using default location, clear any custom location
      if (data.useDefaultLocation) {
        formData.set("location", "");
      } else {
        formData.set("location", data.location || "");
      }

      const result = await updateMass(params.id as string, formData);

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Mass updated successfully",
        });
        router.push("/admin/masses");
      }
    } catch (error) {
      console.error("Error updating mass:", error);
      toast({
        title: "Error",
        description: "Failed to update mass",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center">Loading mass details...</p>
        </div>
      </div>
    );
  }

  if (error && !mass) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/admin/masses">
              <Button>Back to Masses</Button>
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Mass</h1>
          <p className="text-gray-600">
            Update mass details and slot availability.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mass Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mass Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useDefaultLocation"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mb-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          Use default church address
                        </FormLabel>
                      </div>
                      {useDefaultLocation ? (
                        <div className="p-3 bg-gray-100 rounded-md">
                          <p className="text-gray-700">
                            {defaultAddress || "Loading default address..."}
                          </p>
                        </div>
                      ) : (
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g., Main Church"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intentionSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mass Intention Slots (Currently{" "}
                        {mass?._count.massIntentions} booked)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={mass?._count.massIntentions || 0}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thanksgivingSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Thanksgiving Slots (Currently{" "}
                        {mass?._count.thanksgivings} booked)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={mass?._count.thanksgivings || 0}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-6 flex justify-end space-x-4">
                  <Link href="/admin/masses">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Mass"}
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
