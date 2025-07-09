// // "use client"

// // import { useState, useEffect } from "react"
// // import Link from "next/link"
// // import { createThanksgiving } from "@/actions/thanksgiving-actions"
// // import { Form, FormField, FormLabel, FormTextarea, FormSelect } from "@/components/ui/form"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// // import { getMassesWithAvailability } from "@/actions/mass-actions"
// // import { formatDate, formatTime } from "@/lib/utils"

// // interface Mass {
// //   id: string
// //   title: string
// //   date: Date
// //   location: string
// //   availableThanksgivingsSlots: number
// // }

// // export default function NewThanksgivingPage() {
// //   const [error, setError] = useState<string | null>(null)
// //   const [masses, setMasses] = useState<Mass[]>([])
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     async function fetchMasses() {
// //       try {
// //         const massesData = await getMassesWithAvailability()
// //         // Filter masses that have available thanksgiving slots
// //         setMasses(massesData.data?.filter((mass) => mass.availableThanksgivingsSlots > 0) ?? [])
// //       } catch (error) {
// //         console.error("Error fetching masses:", error)
// //         setError("Failed to load available masses")
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchMasses()
// //   }, [])

// //   async function handleSubmit(formData: FormData) {
// //     setError(null)

// //     const result = await createThanksgiving(formData)

// //     if (result?.error) {
// //       setError(result.error)
// //     }
// //   }

// //   return (
// //        <div className="bg-gray-50 text-black min-h-screen">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="mb-8">
// //           <h1 className="text-2xl font-bold text-gray-900">Book Thanksgiving Service</h1>
// //           <p className="text-gray-600">Fill out the form below to book a thanksgiving service.</p>
// //         </div>

// //         <Card className="max-w-2xl mx-auto">
// //           <CardHeader>
// //             <CardTitle>Thanksgiving Service Details</CardTitle>
// //           </CardHeader>

// //           <CardContent>
// //             {loading ? (
// //               <p className="text-center py-4">Loading available masses...</p>
// //             ) : masses.length === 0 ? (
// //               <div className="text-center py-4">
// //                 <p className="text-gray-500 mb-4">No masses with available thanksgiving slots at this time.</p>
// //                 <p className="text-gray-500">Please check back later or contact the church office.</p>
// //               </div>
// //             ) : (
// //               <Form action={handleSubmit}>
// //                 {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">{error}</div>}

// //                 <FormField>
// //                   <FormLabel htmlFor="massId">Select Mass</FormLabel>
// //                   <FormSelect id="massId" name="massId" required>
// //                     <option value="">Select a mass</option>
// //                     {masses.map((mass) => (
// //                       <option key={mass.id} value={mass.id}>
// //                         {mass.title} - {formatDate(mass.date)} at {formatTime(mass.date)}(
// //                         {mass.availableThanksgivingsSlots} slots available)
// //                       </option>
// //                     ))}
// //                   </FormSelect>
// //                 </FormField>

// //                 <FormField>
// //                   <FormLabel htmlFor="description">Reason for Thanksgiving</FormLabel>
// //                   <FormTextarea
// //                     id="description"
// //                     name="description"
// //                     rows={3}
// //                     placeholder="e.g., Birthday, Anniversary, New Job, etc."
// //                     required
// //                   />
// //                 </FormField>

// //                 <div className="mt-6 flex justify-end space-x-4">
// //                   <Link href="/dashboard/thanksgiving">
// //                     <Button variant="outline" type="button">
// //                       Cancel
// //                     </Button>
// //                   </Link>
// //                   <Button type="submit">Submit Request</Button>
// //                 </div>
// //               </Form>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   )
// // }

// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { createThanksgiving } from "@/actions/thanksgiving-actions"
// import { Form, FormField, FormLabel, FormTextarea, FormSelect } from "@/components/ui/form"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { getMassesWithAvailability } from "@/actions/mass-actions"
// import { formatDate, formatTime } from "@/lib/utils"

// interface Mass {
//   id: string
//   title: string
//   date: Date
//   location: string
//   availableThanksgivingsSlots: number
// }

// interface FormState {
//   error: string | null
//   loading: boolean
//   submitting: boolean
// }

// export default function NewThanksgivingPage() {
//   const [masses, setMasses] = useState<Mass[]>([])
//   const [formState, setFormState] = useState<FormState>({
//     error: null,
//     loading: true,
//     submitting: false,
//   })

//   const fetchMasses = async () => {
//     try {
//       setFormState((prev) => ({ ...prev, loading: true, error: null }))
//       const massesData = await getMassesWithAvailability()
//       const availableMasses = massesData.data?.filter((mass) => mass.availableThanksgivingsSlots > 0) ?? []
//       setMasses(availableMasses)
//     } catch (error) {
//       console.error("Error fetching masses:", error)
//       setFormState((prev) => ({
//         ...prev,
//         error: "Failed to load available masses",
//       }))
//     } finally {
//       setFormState((prev) => ({ ...prev, loading: false }))
//     }
//   }

//   useEffect(() => {
//     fetchMasses()
//   }, [])

//   const handleSubmit = async (formData: FormData) => {
//     setFormState((prev) => ({ ...prev, submitting: true, error: null }))

//     try {
//       const result = await createThanksgiving(formData)
//       if (result?.error) {
//         setFormState((prev) => ({
//           ...prev,
//           error: result.error,
//           submitting: false,
//         }))
//       }
//     } catch (error) {
//       setFormState((prev) => ({
//         ...prev,
//         error: "An unexpected error occurred",
//         submitting: false,
//       }))
//     }
//   }

//   const renderMassOption = (mass: Mass) => (
//     <option key={mass.id} value={mass.id}>
//       {mass.title} - {formatDate(mass.date)} at {formatTime(mass.date)}({mass.availableThanksgivingsSlots} slots
//       available)
//     </option>
//   )

//   const renderLoadingState = () => <p className="text-center py-4">Loading available masses...</p>

//   const renderEmptyState = () => (
//     <div className="text-center py-4">
//       <p className="text-gray-500 mb-4">No masses with available thanksgiving slots at this time.</p>
//       <p className="text-gray-500">Please check back later or contact the church office.</p>
//     </div>
//   )

//   const renderForm = () => (
//     <Form action={handleSubmit}>
//       {formState.error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">{formState.error}</div>}

//       <FormField>
//         <FormLabel htmlFor="massId">Select Mass</FormLabel>
//         <FormSelect id="massId" name="massId" required disabled={formState.submitting}>
//           <option value="">Select a mass</option>
//           {masses.map(renderMassOption)}
//         </FormSelect>
//       </FormField>

//       <FormField>
//         <FormLabel htmlFor="description">Reason for Thanksgiving</FormLabel>
//         <FormTextarea
//           id="description"
//           name="description"
//           rows={3}
//           placeholder="e.g., Birthday, Anniversary, New Job, etc."
//           required
//           disabled={formState.submitting}
//         />
//       </FormField>

//       <div className="mt-6 flex justify-end space-x-4">
//         <Link href="/dashboard/thanksgiving">
//           <Button variant="outline" type="button" disabled={formState.submitting}>
//             Cancel
//           </Button>
//         </Link>
//         <Button type="submit" disabled={formState.submitting}>
//           {formState.submitting ? "Submitting..." : "Submit Request"}
//         </Button>
//       </div>
//     </Form>
//   )

//   const renderContent = () => {
//     if (formState.loading) return renderLoadingState()
//     if (masses.length === 0) return renderEmptyState()
//     return renderForm()
//   }

//   return (
//        <div className="bg-gray-50 text-black min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Book Thanksgiving Service</h1>
//           <p className="text-gray-600">Fill out the form below to book a thanksgiving service.</p>
//         </div>

//         <Card className="max-w-2xl mx-auto">
//           <CardHeader>
//             <CardTitle>Thanksgiving Service Details</CardTitle>
//           </CardHeader>
//           <CardContent>{renderContent()}</CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createThanksgiving } from "@/actions/thanksgiving-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMassesWithAvailability } from "@/actions/mass-actions";
import { formatDate, formatTime } from "@/lib/utils";
import { thanksgivingSchema } from "@/lib/validations";

interface Mass {
  id: string;
  title: string;
  date: Date;
  location: string;
  availableThanksgivingsSlots: number;
}

type ThanksgivingFormData = z.infer<typeof thanksgivingSchema>;

export default function NewThanksgivingPage() {
  const [masses, setMasses] = useState<Mass[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ThanksgivingFormData>({
    resolver: zodResolver(thanksgivingSchema),
    defaultValues: {
      massId: "",
      description: "",
    },
  });

  const selectedMassId = watch("massId");

  const fetchMasses = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const massesData = await getMassesWithAvailability();
      const availableMasses =
        massesData.data?.filter(
          (mass) => mass.availableThanksgivingsSlots > 0
        ) ?? [];
      setMasses(availableMasses);
    } catch (error) {
      console.error("Error fetching masses:", error);
      setFetchError("Failed to load available masses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasses();
  }, []);

  const onSubmit = async (data: ThanksgivingFormData) => {
    try {
      clearErrors();

      // Convert form data to FormData for server action
      const formData = new FormData();
      formData.append("massId", data.massId);
      formData.append("description", data.description);

      const result = await createThanksgiving(formData);

      if (result?.error) {
        setError("root", {
          type: "server",
          message: result.error,
        });
      }
    } catch (error) {
      setError("root", {
        type: "server",
        message: "An unexpected error occurred",
      });
    }
  };

  const renderMassOption = (mass: Mass) => {
    const displayText = `${mass.title} - ${formatDate(
      mass.date
    )} at ${formatTime(mass.date)} (${
      mass.availableThanksgivingsSlots
    } slots available)`;
    return (
      <SelectItem key={mass.id} value={mass.id}>
        {displayText}
      </SelectItem>
    );
  };

  const renderLoadingState = () => (
    <div className="text-center py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      <p className="text-gray-500 mt-4">Loading available masses...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="text-gray-400 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Available Masses
      </h3>
      <p className="text-gray-500 mb-4">
        No masses with available thanksgiving slots at this time.
      </p>
      <p className="text-gray-500">
        Please check back later or contact the church office.
      </p>
      <Button
        variant="secondary"
        onClick={fetchMasses}
        className="mt-4 bg-secondary hover:bg-secondary"
        disabled={loading}
      >
        Refresh
      </Button>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-8">
      <div className="text-red-400 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error Loading Masses
      </h3>
      <p className="text-red-600 mb-4">{fetchError}</p>
      <Button variant="outline" onClick={fetchMasses} disabled={loading}>
        Try Again
      </Button>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="massId">Select Mass *</Label>
        <Select
          value={selectedMassId}
          onValueChange={(value) => setValue("massId", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={errors.massId ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a mass" />
          </SelectTrigger>
          <SelectContent>{masses.map(renderMassOption)}</SelectContent>
        </Select>
        {errors.massId && (
          <p className="text-sm text-red-600">{errors.massId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Reason for Thanksgiving *</Label>
        <Textarea
          id="description"
          {...register("description")}
          rows={4}
          placeholder="e.g., Birthday, Anniversary, New Job, etc."
          disabled={isSubmitting}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Link href="/dashboard/thanksgiving">
          <Button variant="outline" type="button" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
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
    if (fetchError) return renderErrorState();
    if (masses.length === 0) return renderEmptyState();
    return renderForm();
  };

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Book Thanksgiving Service
          </h1>
          <p className="text-gray-600">
            Fill out the form below to book a thanksgiving service.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto text-black">
          <CardHeader>
            <CardTitle>Thanksgiving Service Details</CardTitle>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
