"use client";

import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuickActionButton } from "@/lib/shared";
import { DASHBOARD_OVERVIEW_CARDS, DASHBOARD_QUICK_ACTIONS } from "@/lib/const";
import { OverviewCard } from "./overviewCard";
import { ActivityList } from "./activityList";
import { MassIntentionList } from "./massIntention";
import { DonationList } from "./donation";
import { EventList } from "./eventList";

interface DashboardClientProps {
  user: { name: string };
  massIntentions: any[];
  thanksgivings: any[];
  payments: any[];
  events: any[];
  activities: any[];
}

export function DashboardClient({
  user,
  massIntentions,
  thanksgivings,
  payments,
  events,
  activities,
}: DashboardClientProps) {
  const [activityFilter, setActivityFilter] = useState<"All" | "Unread">("All");

  const filteredActivities =
    activityFilter === "Unread"
      ? activities.filter((activity) => !activity.read)
      : activities;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-primary">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your church activities and contributions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD_OVERVIEW_CARDS.map((card) => (
            <OverviewCard
              key={card.title}
              title={card.title}
              description={card.description}
              href={card.href}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
            <ActivityList activities={filteredActivities} />
          </Card>

          <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-600">
                Common parishioner tasks
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-3">
                {DASHBOARD_QUICK_ACTIONS.map((action) => (
                  <QuickActionButton
                    key={action.label}
                    href={action.href}
                    icon={action.icon}
                    label={action.label}
                    primary={action.primary}
                    className="w-full py-3 text-sm font-medium"
                    aria-label={action.ariaLabel}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
            <MassIntentionList massIntentions={massIntentions} />
          </Card>

          <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
            <DonationList payments={payments} />
          </Card>

          <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
            <EventList events={events} />
          </Card>
        </div>
      </div>
    </div>
  );
}
