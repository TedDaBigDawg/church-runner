import { getDashboardData } from "@/actions/dashboard";
import { DashboardClient } from "@/components/dashboard/dashboardClient";

export default async function DashboardPage() {
  const { user, massIntentions, thanksgivings, payments, events, activities } =
    await getDashboardData();

  return (
    <DashboardClient
      user={{ ...user, name: user.name || "User" }}
      massIntentions={massIntentions}
      thanksgivings={thanksgivings}
      payments={payments}
      events={events}
      activities={activities}
    />
  );
}
