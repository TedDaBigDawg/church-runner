"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { createEvent } from "@/actions/event-actions";
import { getChurchInfo } from "@/actions/church-info-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().optional(),
  capacity: z.string().optional(),
  useDefaultLocation: z.boolean().default(true),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function NewEventPage() {
  const [error, setError] = useState<string | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<string>("");

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      useDefaultLocation: true,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;
  const useDefaultLocation = watch("useDefaultLocation");

  useEffect(() => {
    async function fetchChurchInfo() {
      try {
        const churchInfo = await getChurchInfo();
        setDefaultAddress(churchInfo.address);
      } catch (error) {
        console.error("Error fetching church info:", error);
        setError("Failed to fetch church information");
      }
    }
    fetchChurchInfo();
  }, []);

  async function onSubmit(data: EventFormData) {
    setError(null);

    try {
      // Create FormData for server action
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("description", data.description);
      formData.set("date", data.date);
      formData.set("time", data.time);
      formData.set("useDefaultLocation", data.useDefaultLocation.toString());

      // Only set location if not using default
      if (!data.useDefaultLocation && data.location) {
        formData.set("location", data.location);
      } else {
        formData.set("location", "");
      }

      if (data.capacity) {
        formData.set("capacity", data.capacity);
      }

      const result = await createEvent(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event");
    }
  }

  // Get today's date for min date validation
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
          <p className="text-gray-600">Create a new church event.</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Christmas Carol Service"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the event"
                          rows={3}
                          {...field}
                        />
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
                        <Input type="date" min={today} {...field} />
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
                                  placeholder="e.g., Main Church Hall"
                                  {...field}
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
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Leave blank for unlimited"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Link href="/admin/events">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Event"}
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
