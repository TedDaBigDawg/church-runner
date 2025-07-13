import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Activity {
  id: string;
  action: string;
  createdAt: Date;
  read: boolean;
}

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Recent Activities
        </CardTitle>
        <Link href="/dashboard/activities">
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary hover:text-white rounded-full"
            size="sm"
            aria-label="View all activities">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <ul className="divide-y space-y-1 divide-gray-200">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className={`py-3 rounded-xl ${
                  !activity.read ? "bg-blue-50 rounded-xl px-2" : ""
                }`}>
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-primary mr-3" />
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        !activity.read
                          ? "font-medium text-gray-800"
                          : "text-gray-600"
                      }`}>
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                  {!activity.read && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent activities.</p>
        )}
      </CardContent>
    </>
  );
}
