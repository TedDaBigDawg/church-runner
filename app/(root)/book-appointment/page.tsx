"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { keyframes } from "framer-motion";
import { appointmentSchema, TIMESLOTS } from "@/lib/validations";

export default function BookAppointmentForm() {
  type AppointmentValues = z.infer<typeof appointmentSchema>;

  const form = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: "",
      email: "",
      firstName: "",
      lastName: "",
      notes: "",
      phoneNumer: "",
      // service: "Assessment",
      time: "1:00 PM",
    },
    mode: "onChange",
  });

  const handleSubmit = (data: AppointmentValues) => {
    console.log("Appointment booking:", data);
  };

  return (
    <div className="min-h-screen text-[#000] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">
            Fill out the form below to schedule your appointment
          </p>
        </div>

        <div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="firstName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your firstname "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className=" text-red-800" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="lastName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your lastname "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className=" text-red-800" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              required
                              placeholder="Enter your email "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className=" text-red-800" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="phoneNumer"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className=" text-red-800" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointment Details
                  </h3>

                  {/* <FormField
                    name="service"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>

                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className=" bg-white text-black">
                            {SERVICES.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className=" text-red-800" />
                      </FormItem>
                    )}
                  /> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="date"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preffered Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Enter your phone number "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className=" text-red-800" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="time"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preffered Time</FormLabel>

                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose your preffered time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className=" bg-white text-black">
                              {TIMESLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className=" text-red-800" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Additional Information
                  </h3>

                  <FormField
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes or Special Requests</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Start typing... " {...field} />
                        </FormControl>
                        <FormMessage className=" text-red-800" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full">
                    Book Appointment
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-3">
                    You will receive a confirmation email once your appointment
                    is booked.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
