import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/utils";
import {
  updateThanksgivingStatus,
  deleteThanksgiving,
} from "@/actions/thanksgiving-actions";

export default async function AdminThanksgivingPage() {
  await requireAdmin();

  const thanksgivings = await prisma.thanksgiving.findMany({
    orderBy: [{ status: "asc" }, { mass: { date: "asc" } }],
    include: {
      user: true,
      mass: true,
    },
  });

  const pending = thanksgivings.filter((t) => t.status === "PENDING");
  const approved = thanksgivings.filter((t) => t.status === "APPROVED");
  const rejected = thanksgivings.filter((t) => t.status === "REJECTED");

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Thanksgiving Bookings
          </h1>
          <p className="text-gray-600">
            Review and manage thanksgiving service requests.
          </p>
        </div>

        <Section
          title={`Pending Requests (${pending.length})`}
          bookings={pending}
          emptyMessage="No pending thanksgiving requests."
          actions={(t) => (
            <div className="flex space-x-2">
              <form
                action={updateThanksgivingStatus.bind(null, t.id, "APPROVED")}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-800"
                >
                  Approve
                </Button>
              </form>
              <form
                action={updateThanksgivingStatus.bind(null, t.id, "REJECTED")}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  Reject
                </Button>
              </form>
            </div>
          )}
        />

        <Section
          title={`Approved Requests (${approved.length})`}
          bookings={approved}
          emptyMessage="No approved thanksgiving requests."
          actions={(t) => (
            <form action={deleteThanksgiving.bind(null, t.id)}>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </Button>
            </form>
          )}
        />

        <Section
          title={`Rejected Requests (${rejected.length})`}
          bookings={rejected}
          emptyMessage="No rejected thanksgiving requests."
          actions={(t) => (
            <div className="flex space-x-2">
              <form
                action={updateThanksgivingStatus.bind(null, t.id, "APPROVED")}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-800"
                >
                  Approve
                </Button>
              </form>
              <form action={deleteThanksgiving.bind(null, t.id)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </Button>
              </form>
            </div>
          )}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  bookings,
  emptyMessage,
  actions,
}: {
  title: string;
  bookings: any[];
  emptyMessage: string;
  actions: (t: any) => React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mass
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((t) => (
                    <tr key={t.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {t.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {t.user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {t.mass.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t.mass.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(t.mass.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(t.mass.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {actions(t)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
