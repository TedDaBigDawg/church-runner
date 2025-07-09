// "use client";

// import { useState, useEffect } from "react";
// import { getUserProfile, updateUserProfile } from "@/actions/profile-actions";
// import { getChurchInfo, updateChurchInfo } from "@/actions/church-info-actions";
// import { Form, FormField, FormLabel } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useRouter } from "next/navigation";
// import { z } from "zod";
// import { churchInfoSchema } from "@/lib/validations";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   phone: string | null;
//   role: string;
// }

// interface ChurchInfo {
//   id: string;
//   name: string;
//   address: string;
//   phone: string;
//   email: string;
//   mission: string;
//   vision: string;
//   history: string;
// }

// export default function AdminProfilePage() {
//   const router = useRouter();
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [churchInfo, setChurchInfo] = useState<ChurchInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [updatingProfile, setUpdatingProfile] = useState(false);
//   const [updatingChurch, setUpdatingChurch] = useState(false);
//   const [profileMessage, setProfileMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);
//   const [churchMessage, setChurchMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [profileData, churchData] = await Promise.all([
//           getUserProfile(),
//           getChurchInfo(),
//         ]);
//         setProfile(profileData);
//         setChurchInfo(churchData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   async function handleProfileSubmit(formData: FormData) {
//     setUpdatingProfile(true);
//     setProfileMessage(null);

//     try {
//       const result = await updateUserProfile(formData);

//       if (result.error) {
//         setProfileMessage({ type: "error", text: result.error });
//       } else if (result.success) {
//         setProfile(result.user);
//         setProfileMessage({
//           type: "success",
//           text: "Profile updated successfully",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setProfileMessage({ type: "error", text: "Failed to update profile" });
//     } finally {
//       setUpdatingProfile(false);
//     }
//   }

//   async function handleChurchInfoSubmit(formData: FormData) {
//     setUpdatingChurch(true);
//     setChurchMessage(null);

//     try {
//       const result = await updateChurchInfo(formData);

//       if (result.error) {
//         setChurchMessage({ type: "error", text: result.error });
//       } else if (result.success) {
//         setChurchInfo(result.churchInfo);
//         setChurchMessage({
//           type: "success",
//           text: "Church information updated successfully",
//         });
//       }
//       router.refresh();
//     } catch (error) {
//       console.error("Error updating church info:", error);
//       setChurchMessage({
//         type: "error",
//         text: "Failed to update church information",
//       });
//     } finally {
//       setUpdatingChurch(false);
//     }
//   }

//   if (loading) {
//     return (
//          <div className="bg-gray-50 text-black min-h-screen">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//        <div className="bg-gray-50 text-black min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
//           <p className="text-gray-600">
//             Manage your profile and church information.
//           </p>
//         </div>

//         <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
//           <TabsList className="mb-8">
//             <TabsTrigger value="profile">Personal Profile</TabsTrigger>
//             <TabsTrigger value="church">Church Information</TabsTrigger>
//           </TabsList>

//           <TabsContent value="profile">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Personal Information</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {profileMessage && (
//                   <div
//                     className={`mb-4 p-3 rounded-md ${
//                       profileMessage.type === "success"
//                         ? "bg-green-50 text-green-700"
//                         : "bg-red-50 text-red-700"
//                     }`}
//                   >
//                     {profileMessage.text}
//                   </div>
//                 )}

//                 <Form action={handleProfileSubmit}>
//                   <FormField>
//                     <FormLabel htmlFor="name">Full Name</FormLabel>
//                     <FormInput
//                       id="name"
//                       name="name"
//                       required
//                       defaultValue={profile?.name || ""}
//                     />
//                   </FormField>

//                   <FormField>
//                     <FormLabel htmlFor="email">Email Address</FormLabel>
//                     <FormInput
//                       id="email"
//                       name="email"
//                       type="email"
//                       disabled
//                       defaultValue={profile?.email || ""}
//                     />
//                     <p className="text-sm text-gray-500 mt-1">
//                       Email cannot be changed for security reasons.
//                     </p>
//                   </FormField>

//                   <FormField>
//                     <FormLabel htmlFor="phone">Phone Number</FormLabel>
//                     <FormInput
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       defaultValue={profile?.phone || ""}
//                     />
//                   </FormField>

//                   <div className="mt-6">
//                     <Button type="submit" disabled={updatingProfile}>
//                       {updatingProfile ? "Updating..." : "Update Profile"}
//                     </Button>
//                   </div>
//                 </Form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="church">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Church Information</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {churchMessage && (
//                   <div
//                     className={`mb-4 p-3 rounded-md ${
//                       churchMessage.type === "success"
//                         ? "bg-green-50 text-green-700"
//                         : "bg-red-50 text-red-700"
//                     }`}
//                   >
//                     {churchMessage.text}
//                   </div>
//                 )}

//                 <Form action={handleChurchInfoSubmit}>
//                   <div className="grid gap-6 md:grid-cols-2">
//                     <FormField>
//                       <FormLabel htmlFor="name">Church Name</FormLabel>
//                       <FormInput
//                         id="name"
//                         name="name"
//                         required
//                         defaultValue={churchInfo?.name || ""}
//                       />
//                     </FormField>

//                     <FormField>
//                       <FormLabel htmlFor="email">Church Email</FormLabel>
//                       <FormInput
//                         id="email"
//                         name="email"
//                         type="email"
//                         required
//                         defaultValue={churchInfo?.email || ""}
//                       />
//                     </FormField>

//                     <FormField>
//                       <FormLabel htmlFor="phone">Church Phone</FormLabel>
//                       <FormInput
//                         id="phone"
//                         name="phone"
//                         required
//                         defaultValue={churchInfo?.phone || ""}
//                       />
//                     </FormField>

//                     <FormField>
//                       <FormLabel htmlFor="address">Church Address</FormLabel>
//                       <FormInput
//                         id="address"
//                         name="address"
//                         required
//                         defaultValue={churchInfo?.address || ""}
//                       />
//                     </FormField>
//                   </div>

//                   <FormField className="mt-6">
//                     <FormLabel htmlFor="mission">Mission Statement</FormLabel>
//                     <FormTextarea
//                       id="mission"
//                       name="mission"
//                       rows={3}
//                       required
//                       defaultValue={churchInfo?.mission || ""}
//                     />
//                   </FormField>

//                   <FormField>
//                     <FormLabel htmlFor="vision">Vision Statement</FormLabel>
//                     <FormTextarea
//                       id="vision"
//                       name="vision"
//                       rows={3}
//                       required
//                       defaultValue={churchInfo?.vision || ""}
//                     />
//                   </FormField>

//                   <FormField>
//                     <FormLabel htmlFor="history">Church History</FormLabel>
//                     <FormTextarea
//                       id="history"
//                       name="history"
//                       rows={5}
//                       required
//                       defaultValue={churchInfo?.history || ""}
//                     />
//                   </FormField>

//                   <div className="mt-6">
//                     <Button type="submit" disabled={updatingChurch}>
//                       {updatingChurch
//                         ? "Updating..."
//                         : "Update Church Information"}
//                     </Button>
//                   </div>
//                 </Form>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getUserProfile, updateUserProfile } from "@/actions/profile-actions";
import { getChurchInfo, updateChurchInfo } from "@/actions/church-info-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { churchInfoSchema, profileUpdateSchema } from "@/lib/validations";

type ProfileFormData = z.infer<typeof profileUpdateSchema>;
type ChurchInfoFormData = z.infer<typeof churchInfoSchema>;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

interface ChurchInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  mission: string;
  vision: string;
  history: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [churchInfo, setChurchInfo] = useState<ChurchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [churchMessage, setChurchMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Church info form
  const churchForm = useForm<ChurchInfoFormData>({
    resolver: zodResolver(churchInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      mission: "",
      vision: "",
      history: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, churchData] = await Promise.all([
          getUserProfile(),
          getChurchInfo(),
        ]);

        setProfile(profileData);
        setChurchInfo(churchData);

        // Reset forms with fetched data
        if (profileData) {
          profileForm.reset({
            name: profileData.name,
            phone: profileData.phone || "",
          });
        }

        if (churchData) {
          churchForm.reset({
            name: churchData.name,
            email: churchData.email,
            phone: churchData.phone,
            address: churchData.address,
            mission: churchData.mission,
            vision: churchData.vision,
            history: churchData.history,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [profileForm, churchForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);

      const result = await updateUserProfile(formData);

      if (result.error) {
        setProfileMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setProfile(result.user);
        setProfileMessage({
          type: "success",
          text: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  const onChurchSubmit = async (data: ChurchInfoFormData) => {
    setChurchMessage(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await updateChurchInfo(formData);

      if (result.error) {
        setChurchMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setChurchInfo(result.churchInfo);
        setChurchMessage({
          type: "success",
          text: "Church information updated successfully",
        });
      }
      router.refresh();
    } catch (error) {
      console.error("Error updating church info:", error);
      setChurchMessage({
        type: "error",
        text: "Failed to update church information",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50  min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600">
            Manage your profile and church information.
          </p>
        </div>

        <Tabs defaultValue="profile" className="max-w-4xl text-black mx-auto">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Personal Profile</TabsTrigger>
            <TabsTrigger value="church">Church Information</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                {profileMessage && (
                  <Alert
                    className={`mb-4 ${
                      profileMessage.type === "success"
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <AlertDescription
                      className={
                        profileMessage.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {profileMessage.text}
                    </AlertDescription>
                  </Alert>
                )}

                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      {...profileForm.register("name")}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-600">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      disabled
                      value={profile?.email || ""}
                    />
                    <p className="text-sm text-gray-500">
                      Email cannot be changed for security reasons.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <Input
                      id="profile-phone"
                      type="tel"
                      {...profileForm.register("phone")}
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-sm text-red-600">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={profileForm.formState.isSubmitting}
                    className="mt-6"
                  >
                    {profileForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="church">
            <Card>
              <CardHeader>
                <CardTitle>Church Information</CardTitle>
              </CardHeader>
              <CardContent>
                {churchMessage && (
                  <Alert
                    className={`mb-4 ${
                      churchMessage.type === "success"
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <AlertDescription
                      className={
                        churchMessage.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {churchMessage.text}
                    </AlertDescription>
                  </Alert>
                )}

                <form
                  onSubmit={churchForm.handleSubmit(onChurchSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="church-name">Church Name</Label>
                      <Input
                        id="church-name"
                        {...churchForm.register("name")}
                      />
                      {churchForm.formState.errors.name && (
                        <p className="text-sm text-red-600">
                          {churchForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="church-email">Church Email</Label>
                      <Input
                        id="church-email"
                        type="email"
                        {...churchForm.register("email")}
                      />
                      {churchForm.formState.errors.email && (
                        <p className="text-sm text-red-600">
                          {churchForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="church-phone">Church Phone</Label>
                      <Input
                        id="church-phone"
                        {...churchForm.register("phone")}
                      />
                      {churchForm.formState.errors.phone && (
                        <p className="text-sm text-red-600">
                          {churchForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="church-address">Church Address</Label>
                      <Input
                        id="church-address"
                        {...churchForm.register("address")}
                      />
                      {churchForm.formState.errors.address && (
                        <p className="text-sm text-red-600">
                          {churchForm.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="church-mission">Mission Statement</Label>
                    <Textarea
                      id="church-mission"
                      rows={3}
                      {...churchForm.register("mission")}
                    />
                    {churchForm.formState.errors.mission && (
                      <p className="text-sm text-red-600">
                        {churchForm.formState.errors.mission.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="church-vision">Vision Statement</Label>
                    <Textarea
                      id="church-vision"
                      rows={3}
                      {...churchForm.register("vision")}
                    />
                    {churchForm.formState.errors.vision && (
                      <p className="text-sm text-red-600">
                        {churchForm.formState.errors.vision.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="church-history">Church History</Label>
                    <Textarea
                      id="church-history"
                      rows={5}
                      {...churchForm.register("history")}
                    />
                    {churchForm.formState.errors.history && (
                      <p className="text-sm text-red-600">
                        {churchForm.formState.errors.history.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={churchForm.formState.isSubmitting}
                  >
                    {churchForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Church Information"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
