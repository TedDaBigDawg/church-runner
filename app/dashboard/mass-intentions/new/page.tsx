"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { createMassIntention } from "@/actions/mass-intention-actions";
import { getMassesWithAvailability } from "@/actions/mass-actions";
import { formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { massIntentionSchema } from "@/lib/validations";

interface Mass {
  id: string;
  title: string;
  date: Date;
  location: string;
  availableIntentionsSlots: number;
}

type MassIntentionFormData = z.infer<typeof massIntentionSchema>;

export default function NewMassIntentionPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [masses, setMasses] = useState<Mass[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<MassIntentionFormData>({
    resolver: zodResolver(massIntentionSchema),
    defaultValues: {
      massId: "",
      name: "",
      intention: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = form;

  // Watch form values for real-time updates
  const watchedValues = watch();

  useEffect(() => {
    const fetchMasses = async () => {
      try {
        const massesData = await getMassesWithAvailability();
        const availableMasses = (massesData.data ?? []).filter(
          (mass) => mass.availableIntentionsSlots > 0
        );
        setMasses(availableMasses);
      } catch (error) {
        console.error("Error fetching masses:", error);
        setError("Failed to load available masses");
      } finally {
        setLoading(false);
      }
    };

    fetchMasses();
  }, []);

  const onSubmit = async (data: MassIntentionFormData) => {
    setError(null);

    try {
      // Convert to FormData for server action
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await createMassIntention(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      reset();
      router.push("/dashboard/mass-intentions");
      router.refresh();
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const renderLoadingState = () => (
    <div className="text-center py-8">
      <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
      <p className="text-gray-500">Loading available masses...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">
        No masses with available intention slots at this time.
      </p>
      <p className="text-gray-500">
        Please check back later or contact the church office.
      </p>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Mass Selection */}
      <div className="space-y-2">
        <Label htmlFor="massId">Select Mass *</Label>
        <Controller
          name="massId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mass" />
              </SelectTrigger>
              <SelectContent>
                {masses.map((mass) => (
                  <SelectItem key={mass.id} value={mass.id}>
                    {mass.title} - {formatDate(mass.date)} at{" "}
                    {formatTime(mass.date)} ({mass.availableIntentionsSlots}{" "}
                    slots available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.massId && (
          <p className="text-sm text-red-500">{errors.massId.message}</p>
        )}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name (for whom the Mass is offered) *</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="name"
              placeholder="Enter the name"
              className={errors.name ? "border-red-500" : ""}
            />
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Intention Field */}
      <div className="space-y-2">
        <Label htmlFor="intention">Intention *</Label>
        <Controller
          name="intention"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="intention"
              rows={4}
              placeholder="e.g., For the repose of the soul, For healing, etc."
              className={errors.intention ? "border-red-500" : ""}
            />
          )}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {errors.intention
              ? errors.intention.message
              : "Describe the intention for this Mass"}
          </span>
          <span>{watchedValues.intention?.length || 0}/500</span>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Link href="/dashboard/mass-intentions">
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </Button>
      </div>
    </form>
  );

  const renderContent = () => {
    if (loading) return renderLoadingState();
    if (masses.length === 0) return renderEmptyState();
    return renderForm();
  };

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Request Mass Intention
          </h1>
          <p className="text-gray-600">
            Fill out the form below to request a Mass intention.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mass Intention Details</CardTitle>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
