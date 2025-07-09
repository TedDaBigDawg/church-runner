import LiveStream from "@/components/LiveStream";
import Wishes from "@/components/Wishes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { getWishes } from "../actions/wishes";

export default async function LiveStreamPage() {
  const initialWishes = await getWishes();
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Livestream Section */}
      <Card className="bg-white bg-opacity-90 shadow-xl rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-800">
            Live Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            {/* <LiveStream streamUrl="https://youtube.com/live/MVu0Yc6OlaU?feature=share" /> */}
            <LiveStream streamUrl="https://www.youtube.com/live/XPgqmODkKZA?si=eXxS36WV_NYuxjSR" />
            <div className="flex items-center justify-center h-full">
              <Video className="w-16 h-16 text-gray-400" />
              <p className="ml-4 text-gray-600">
                Livestream will begin shortly
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            The memorial service will begin at 2:00 PM EST. If you're having
            trouble with the stream, please refresh the page.
          </p>
        </CardContent>
      </Card>

      {/* Share a Memory Section */}
      <Wishes initialWishes={initialWishes} />
    </div>
  );
}
