"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateEvent } from "@/actions/event-actions";
import { getChurchInfo } from "@/actions/church-info-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().optional(),
  capacity: z.string().optional(),
  useDefaultLocation: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number | null;
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      useDefaultLocation: false,
    },
  });

  const useDefaultLocation = form.watch("useDefaultLocation");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch event and church info in parallel
        const [eventResponse, churchInfo] = await Promise.all([
          fetch(`/api/events/${params.id}`),
          getChurchInfo(),
        ]);

        if (!eventResponse.ok) {
          throw new Error("Failed to fetch event");
        }

        const eventData = await eventResponse.json();

        // Format date for the input field
        const eventDate = new Date(eventData.date);
        const formattedDate = eventDate.toISOString().split("T")[0];
        const formattedTime = eventDate.toTimeString().slice(0, 5);

        const formattedEvent = {
          ...eventData,
          date: formattedDate,
          time: formattedTime,
        };

        setEvent(formattedEvent);
        setDefaultAddress(churchInfo.address);

        // Check if the event location is the same as the default address
        const isUsingDefault = eventData.location === churchInfo.address;

        // Reset form with fetched data
        form.reset({
          title: formattedEvent.title,
          description: formattedEvent.description,
          date: formattedEvent.date,
          time: formattedEvent.time,
          location: isUsingDefault ? "" : eventData.location,
          capacity: eventData.capacity?.toString() || "",
          useDefaultLocation: isUsingDefault,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, form]);

  async function onSubmit(data: FormData) {
    setError(null);
    setIsSubmitting(true);

    try {
      // Create FormData object for the server action
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("description", data.description);
      formData.set("date", data.date);
      formData.set("time", data.time);
      formData.set("capacity", data.capacity || "");
      formData.set("useDefaultLocation", data.useDefaultLocation.toString());

      // If using default location, clear any custom location
      if (data.useDefaultLocation) {
        formData.set("location", "");
      } else {
        formData.set("location", data.location || "");
      }

      const result = await updateEvent(params.id as string, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/events");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Alert className="max-w-md mx-auto mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href="/admin/events">
              <Button>Back to Events</Button>
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600">Update event details.</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {error && (
                  <Alert className="mb-4">
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
                        <Input {...field} />
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
                        <Textarea {...field} rows={3} />
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
                        <Input {...field} type="date" />
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
                        <Input {...field} type="time" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Main Church Hall"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="Leave blank for unlimited"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Link href="/admin/events">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Event"}
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
