import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
}

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li key={event.id} className="py-3">
                <div>
                  <p className="font-medium text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
                <div className="mt-2">
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Button
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary hover:text-white rounded-full"
                      size="sm"
                      aria-label={`View details for ${event.title}`}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No upcoming events.</p>
        )}
        <div className="mt-4">
          <Link href="/dashboard/events">
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-white rounded-full"
              size="sm"
              aria-label="View all events">
              View All
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );
}
