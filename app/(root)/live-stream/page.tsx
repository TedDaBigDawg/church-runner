import { requireAuth } from "@/lib/auth";
import { getMassesWithLiveStream } from "@/actions/live-stream";
import LiveStreamClient from "@/components/LiveStreamClient";
import { Role } from "@prisma/client";

interface Mass {
  id: string;
  title: string;
  date: string;
  location: string;
  liveStreamUrl: string | null;
  status: string;
}

export default async function LiveStreamPage() {
  const user = await requireAuth();
  const masses = await getMassesWithLiveStream();

  // Convert dates to strings for serialization
  const serializedMasses = masses.map((mass) => ({
    ...mass,
    date: mass.date.toISOString(),
  }));

  return (
    <LiveStreamClient
      user={user as { role: Role }}
      initialMasses={serializedMasses}
    />
  );
}
