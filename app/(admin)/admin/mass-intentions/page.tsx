import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/utils";
import {
  updateMassIntentionStatus,
  deleteMassIntention,
} from "@/actions/mass-intention-actions";
import { PaginationComponent } from "@/components/layout/pagination";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminMassIntentionsPage(props: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const pendingPage = parseInt(
    (searchParams["pendingPage"] as string) ?? "1",
    10
  );
  const approvedPage = parseInt(
    (searchParams["approvedPage"] as string) ?? "1",
    10
  );
  const rejectedPage = parseInt(
    (searchParams["rejectedPage"] as string) ?? "1",
    10
  );

  const limit = 5;

  const [pendingIntentions, pendingCount] = await Promise.all([
    prisma.massIntention.findMany({
      where: { status: "PENDING" },
      orderBy: [{ mass: { date: "asc" } }],
      skip: (pendingPage - 1) * limit,
      take: limit,
      include: { user: true, mass: true },
    }),
    prisma.massIntention.count({ where: { status: "PENDING" } }),
  ]);

  const [approvedIntentions, approvedCount] = await Promise.all([
    prisma.massIntention.findMany({
      where: { status: "APPROVED" },
      orderBy: [{ mass: { date: "asc" } }],
      skip: (approvedPage - 1) * limit,
      take: limit,
      include: { user: true, mass: true },
    }),
    prisma.massIntention.count({ where: { status: "APPROVED" } }),
  ]);

  const [rejectedIntentions, rejectedCount] = await Promise.all([
    prisma.massIntention.findMany({
      where: { status: "REJECTED" },
      orderBy: [{ mass: { date: "asc" } }],
      skip: (rejectedPage - 1) * limit,
      take: limit,
      include: { user: true, mass: true },
    }),
    prisma.massIntention.count({ where: { status: "REJECTED" } }),
  ]);

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Mass Intentions
        </h1>
        <p className="text-gray-600 mb-8">
          Review and manage mass intention requests.
        </p>

        {[
          {
            title: "Pending Requests",
            data: pendingIntentions,
            count: pendingCount,
            page: pendingPage,
            param: "pendingPage",
            actions: (intention: any) => (
              <>
                <form
                  action={updateMassIntentionStatus.bind(
                    null,
                    intention.id,
                    "APPROVED"
                  )}
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
                  action={updateMassIntentionStatus.bind(
                    null,
                    intention.id,
                    "REJECTED"
                  )}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                  >
                    Reject
                  </Button>
                </form>
              </>
            ),
          },
          {
            title: "Approved Requests",
            data: approvedIntentions,
            count: approvedCount,
            page: approvedPage,
            param: "approvedPage",
            actions: (intention: any) => (
              <form action={deleteMassIntention.bind(null, intention.id)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </Button>
              </form>
            ),
          },
          {
            title: "Rejected Requests",
            data: rejectedIntentions,
            count: rejectedCount,
            page: rejectedPage,
            param: "rejectedPage",
            actions: (intention: any) => (
              <>
                <form
                  action={updateMassIntentionStatus.bind(
                    null,
                    intention.id,
                    "APPROVED"
                  )}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-800"
                  >
                    Approve
                  </Button>
                </form>
                <form action={deleteMassIntention.bind(null, intention.id)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </Button>
                </form>
              </>
            ),
          },
        ].map(({ title, data, count, page, param, actions }) => (
          <div key={title} className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>{`${title} (${count})`}</CardTitle>
              </CardHeader>
              <CardContent>
                {data.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Intention
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
                          {data.map((intention: any) => (
                            <tr key={intention.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {intention.name}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">
                                  {intention.intention}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {intention.user.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {intention.mass.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {intention.mass.location}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(intention.mass.date)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatTime(intention.mass.date)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                {actions(intention)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {count < 5 ? null : (
                      <PaginationComponent
                        limit={limit}
                        totalItems={count}
                        siblingCount={1}
                        pageParam={param}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No {title.toLowerCase()}.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
