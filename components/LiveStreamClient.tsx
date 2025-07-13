"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  Video,
  Calendar,
  Clock,
  MapPin,
  Target,
  FileText,
  Heart,
  Play,
} from "lucide-react";
import LiveStream from "@/components/LiveStream";

import { Role } from "@prisma/client";
import { toast } from "sonner";
import { QuickActionButton } from "@/lib/shared";
import {
  getMassesWithLiveStream,
  saveLiveStreamUrl,
} from "@/actions/live-stream";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Mass {
  id: string;
  title: string;
  date: string;
  location: string;
  liveStreamUrl: string | null;
  status: string;
}

interface LiveStreamClientProps {
  user: { role: Role };
  initialMasses: Mass[];
}

export default function LiveStreamClient({
  user,
  initialMasses,
}: LiveStreamClientProps) {
  const [masses, setMasses] = useState<Mass[]>(initialMasses);
  const [urlInput, setUrlInput] = useState("");
  const [selectedMassId, setSelectedMassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideoMassId, setSelectedVideoMassId] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState<"All" | "Live" | "Upcoming" | "Past">(
    "All"
  );

  useEffect(() => {
    async function refreshMasses() {
      try {
        const fetchedMasses = await getMassesWithLiveStream();
        const massesWithStringDate = fetchedMasses.map((mass) => ({
          ...mass,
          date:
            typeof mass.date === "string" ? mass.date : mass.date.toISOString(),
        }));
        setMasses(massesWithStringDate);
        const liveMass = massesWithStringDate.find((m) => isLive(m.date));
        if (liveMass?.liveStreamUrl) {
          setSelectedVideoMassId(liveMass.id);
        }
      } catch (error) {
        toast("Failed to load masses");
      }
    }
    refreshMasses();
  }, []);

  const getYouTubeVideoId = (url: string | null) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    return match ? match[1] : null;
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMassId || !urlInput) return;

    setIsLoading(true);
    try {
      await saveLiveStreamUrl(selectedMassId, urlInput);
      toast("Livestream URL saved");
      const updatedMasses = await getMassesWithLiveStream();
      const massesWithStringDate = updatedMasses.map((mass) => ({
        ...mass,
        date:
          typeof mass.date === "string" ? mass.date : mass.date.toISOString(),
      }));
      setMasses(massesWithStringDate);
      setUrlInput("");
      setSelectedMassId(null);
    } catch (error) {
      toast("Failed to save URL");
    } finally {
      setIsLoading(false);
    }
  };

  const isLive = (massDate: string) => {
    const now = new Date();
    const massTime = new Date(massDate);
    const diff = (massTime.getTime() - now.getTime()) / (1000 * 60);
    return diff >= -60 && diff <= 60;
  };

  const handleMassSelect = (massId: string) => {
    setSelectedVideoMassId(massId);
  };

  const filteredMasses = masses.filter((mass) => {
    const massDate = new Date(mass.date);
    const isLiveNow = isLive(mass.date);
    if (filter === "All") return true;
    if (filter === "Live") return isLiveNow;
    if (filter === "Upcoming") return massDate > new Date() && !isLiveNow;
    if (filter === "Past") return massDate < new Date() && !isLiveNow;
    return true;
  });

  const selectedMass = masses.find((m) => m.id === selectedVideoMassId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-blue-900 mb-8">
        Livestream Masses
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Livestream Player Section */}
        <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              {selectedMass
                ? isLive(selectedMass.date)
                  ? "Live Mass"
                  : `Recording: ${selectedMass.title}`
                : "Select a Mass to Watch"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              {selectedMass?.liveStreamUrl ? (
                <LiveStream
                  streamUrl={selectedMass.liveStreamUrl}
                  isLive={isLive(selectedMass.date)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Video className="w-12 h-12 text-gray-400" />
                  <p className="ml-3 text-gray-600 text-sm">
                    {selectedMass
                      ? "No livestream available for this Mass"
                      : "Select a Mass from the list below"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions or Admin Form */}
        {user.role === Role.PARISHIONER ? (
          <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-600">
                Take action as a parishioner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <QuickActionButton
                  href="/dashboard/mass-intentions/new"
                  icon={<Calendar className="h-5 w-5 mr-2 text-background" />}
                  label="Book Intentions"
                  primary
                  className="w-full py-3 text-sm font-medium"
                  aria-label="Book a Mass intention"
                />
                <QuickActionButton
                  href="/dashboard/thanksgiving/new"
                  icon={<Target className="h-5 w-5 mr-2 text-background" />}
                  label="Book Thanksgiving"
                  primary
                  className="w-full py-3 text-sm font-medium"
                  aria-label="Book a Thanksgiving"
                />
                <QuickActionButton
                  href="/dashboard/donations/new"
                  icon={<FileText className="h-5 w-5 mr-2 text-primary" />}
                  label="Make Donation"
                  className="w-full py-3 text-sm font-medium"
                  aria-label="Make a donation"
                />
                <QuickActionButton
                  href="/dashboard/thanksgiving"
                  icon={<Heart className="h-5 w-5 mr-2 text-primary" />}
                  label="Manage Thanksgivings"
                  className="w-full py-3 text-sm font-medium"
                  aria-label="Manage your Thanksgivings"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">
                Add Livestream URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="massId"
                    className="block text-sm font-medium text-gray-800">
                    Select Mass
                  </label>
                  <select
                    id="massId"
                    value={selectedMassId || ""}
                    onChange={(e) => setSelectedMassId(e.target.value)}
                    className="mt-1 block w-full text-gray-800 border-2 border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                    aria-label="Select a Mass">
                    <option value="" disabled>
                      Select a Mass
                    </option>
                    {masses.map((mass) => (
                      <option key={mass.id} value={mass.id}>
                        {mass.title} -{" "}
                        {new Date(mass.date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-800">
                    YouTube URL
                  </label>
                  <Input
                    id="url"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/live/..."
                    className="mt-1 text-gray-800 border-2 border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    aria-label="Enter YouTube URL"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !selectedMassId || !urlInput}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5"
                  aria-label="Save livestream URL">
                  {isLoading ? "Saving..." : "Save URL"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Masses Grid */}
      <Card className="mt-6 bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold text-primary">
            Available Masses
          </CardTitle>
          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800">
              Filter by:
            </span>
            <Select
              value={filter}
              onValueChange={(value: "All" | "Live" | "Upcoming" | "Past") =>
                setFilter(value)
              }>
              <SelectTrigger className="w-[160px] rounded-full text-gray-800 border-gray-300  focus:ring-primary">
                <SelectValue placeholder="Filter Masses" />
              </SelectTrigger>
              <SelectContent className="text-gray-800 rounded-xl">
                <SelectItem className="rounded-xl" value="All">
                  All Masses
                </SelectItem>
                <SelectItem className="rounded-xl" value="Live">
                  Live
                </SelectItem>
                <SelectItem className="rounded-xl" value="Upcoming">
                  Upcoming
                </SelectItem>
                <SelectItem className="rounded-xl" value="Past">
                  Past
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMasses.map((mass) => {
              const massDate = new Date(mass.date);
              const isLiveNow = isLive(mass.date);
              const videoId = getYouTubeVideoId(mass.liveStreamUrl);
              return (
                <Card
                  key={mass.id}
                  className={`relative cursor-pointer transition-transform hover:scale-105 ${
                    selectedVideoMassId === mass.id
                      ? "border-primary border-2"
                      : ""
                  } rounded-xl overflow-hidden`}
                  onClick={() => handleMassSelect(mass.id)}
                  aria-label={`Select ${mass.title} to watch`}>
                  <div className="relative">
                    {videoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt={`${mass.title} thumbnail`}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                        <Video className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    {mass.liveStreamUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                        {mass.title}
                      </h3>
                      {isLiveNow && (
                        <Badge className="text-white bg-green-600 text-xs">
                          Live
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      {massDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      {massDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      {mass.location}
                    </div>
                    <div className="text-sm">
                      {isLiveNow ? (
                        <Badge className="text-white bg-green-600">
                          Now Streaming
                        </Badge>
                      ) : massDate > new Date() ? (
                        <Badge className="text-white bg-yellow-500">
                          Upcoming
                        </Badge>
                      ) : (
                        <Badge className="text-gray-600 bg-gray-200">
                          Past
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredMasses.length === 0 && (
              <div className="col-span-full text-center text-gray-600 py-4">
                No masses match the selected filter
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mass Schedule Table */}
      <Card className="mt-6 bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Mass Livestream Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-800">Title</TableHead>
                <TableHead className="text-gray-800">Date</TableHead>
                <TableHead className="text-gray-800">Time</TableHead>
                <TableHead className="text-gray-800">Location</TableHead>
                <TableHead className="text-gray-800">Status</TableHead>
                <TableHead className="text-gray-800">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMasses.map((mass) => {
                const massDate = new Date(mass.date);
                const isLiveNow = isLive(mass.date);
                return (
                  <TableRow
                    key={mass.id}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      selectedVideoMassId === mass.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleMassSelect(mass.id)}>
                    <TableCell className="text-gray-800">
                      {mass.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-800">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {massDate.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-800">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        {massDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-800">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        {mass.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isLiveNow ? (
                        <Badge className="text-white bg-green-600">Live</Badge>
                      ) : massDate > new Date() ? (
                        <Badge className="text-white bg-yellow-500">
                          Upcoming
                        </Badge>
                      ) : (
                        <Badge className="text-gray-600 bg-gray-200">
                          Past
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {mass.liveStreamUrl && (
                        <Button
                          variant="outline"
                          className="text-primary rounded-full border-primary hover:bg-primary hover:text-white  text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMassSelect(mass.id);
                          }}
                          aria-label={
                            isLiveNow
                              ? "Watch live stream"
                              : "View mass recording"
                          }>
                          {isLiveNow ? "Watch Live" : "View Recording"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredMasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-600">
                    No masses match the selected filter
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
