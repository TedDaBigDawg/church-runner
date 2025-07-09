"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { updatePaymentGoal } from "@/actions/payment-actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  category: z.enum(["TITHE", "OFFERING", "SPECIAL_PROJECT", "OTHER"], {
    required_error: "Please select a category",
  }),
  targetAmount: z.coerce
    .number()
    .min(0.01, "Target amount must be greater than 0"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PaymentGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string | null;
}

const categoryOptions = [
  { value: "TITHE", label: "Tithe" },
  { value: "OFFERING", label: "Offering" },
  { value: "SPECIAL_PROJECT", label: "Special Project" },
  { value: "OTHER", label: "Other" },
];

export default function EditPaymentGoalPage() {
  const params = useParams();
  const router = useRouter();
  const [goal, setGoal] = useState<PaymentGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      targetAmount: 0,
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    async function fetchGoal() {
      try {
        const response = await fetch(`/api/payments/goals/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch goal");
        }
        const data = await response.json();

        // Format dates for the input fields
        const startDate = new Date(data.startDate);
        const formattedStartDate = startDate.toISOString().split("T")[0];
        let formattedEndDate = "";
        if (data.endDate) {
          const endDate = new Date(data.endDate);
          formattedEndDate = endDate.toISOString().split("T")[0];
        }

        const goalData = {
          ...data,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };

        setGoal(goalData);

        // Reset form with fetched data
        form.reset({
          title: goalData.title,
          description: goalData.description,
          category: goalData.category as FormData["category"],
          targetAmount: goalData.targetAmount,
          startDate: goalData.startDate,
          endDate: goalData.endDate || "",
        });
      } catch (error) {
        console.error("Error fetching goal:", error);
        setError("Failed to load goal details");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchGoal();
    }
  }, [params.id, form]);

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert form data to FormData object for server action
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("targetAmount", data.targetAmount.toString());
      formData.append("startDate", data.startDate);
      if (data.endDate) {
        formData.append("endDate", data.endDate);
      }

      const result = await updatePaymentGoal(params.id as string, formData);

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to goals list on success
        router.push("/admin/payments/goals");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Loading goal details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !goal) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Alert className="max-w-md mx-auto mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href="/admin/payments/goals">
              <Button>Back to Goals</Button>
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
            Edit Fundraising Goal
          </h1>
          <p className="text-gray-600">
            Update the details of this fundraising goal.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Goal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal title" {...field} />
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
                          placeholder="Enter goal description"
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Link href="/admin/payments/goals">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "Updating..." : "Update Goal"}
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
