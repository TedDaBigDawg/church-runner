import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/utils";
import { deleteMass } from "@/actions/mass-actions";
import { PaginationComponent } from "@/components/layout/pagination";

const PAGE_SIZE = 5;

export default async function AdminMassesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  await requireAdmin();

  const masses = await prisma.mass.findMany({
    orderBy: { date: "asc" },
    include: {
      _count: {
        select: {
          massIntentions: true,
          thanksgivings: true,
        },
      },
    },
  });

  const now = new Date();
  const upcomingMasses = masses.filter((mass) => mass.date >= now);
  const pastMasses = masses.filter((mass) => mass.date < now);

  const pastMassesPage = Math.max(
    parseInt((searchParams?.["past"] as string) ?? "1", 10),
    1
  );

  const pastStart = (pastMassesPage - 1) * PAGE_SIZE;
  const pastEnd = pastStart + PAGE_SIZE;
  const paginatedPastMasses = pastMasses.slice(pastStart, pastEnd);

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Masses</h1>
            <p className="text-gray-600">
              Create and manage masses with intention and thanksgiving slots.
            </p>
          </div>
          <Link href="/admin/masses/new">
            <Button>Create Mass</Button>
          </Link>
        </div>

        {/* UPCOMING MASSES */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Upcoming Masses
          </h2>

          {upcomingMasses.length > 0 ? (
            <div className="space-y-6">
              {upcomingMasses.map((mass) => (
                <Card key={mass.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{mass.title}</CardTitle>
                      <div className="flex space-x-2">
                        <Link href={`/admin/masses/${mass.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteMass(mass.id);
                          }}
                        >
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <MassDetails mass={mass} />
                      <SlotAvailability mass={mass} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No upcoming masses.</p>
                <Link href="/admin/masses/new">
                  <Button>Create Mass</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* PAST MASSES TABLE */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Past Masses</h2>

          {pastMasses.length > 0 ? (
            <PaginatedTable
              title=""
              rows={paginatedPastMasses}
              columns={[
                {
                  key: "mass",
                  label: "Mass",
                  render: (m) => (
                    <div className="text-sm font-medium">{m.title}</div>
                  ),
                },
                {
                  key: "datetime",
                  label: "Date & Time",
                  render: (m) => (
                    <>
                      <div className="text-sm text-gray-500">
                        {formatDate(m.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(m.date)}
                      </div>
                    </>
                  ),
                },
                {
                  key: "location",
                  label: "Location",
                  render: (m) => (
                    <div className="text-sm text-gray-500">{m.location}</div>
                  ),
                },
                {
                  key: "intentions",
                  label: "Intentions",
                  render: (m) => (
                    <div className="text-sm text-gray-500">
                      {m._count.massIntentions} booked
                    </div>
                  ),
                },
                {
                  key: "thanksgivings",
                  label: "Thanksgivings",
                  render: (m) => (
                    <div className="text-sm text-gray-500">
                      {m._count.thanksgivings} booked
                    </div>
                  ),
                },
              ]}
              footer={
                <PaginationComponent
                  limit={PAGE_SIZE}
                  totalItems={pastMasses.length}
                  siblingCount={1}
                  pageParam="past"
                />
              }
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No past masses.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function MassDetails({ mass }: { mass: any }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="font-medium">Date:</span>
        <span>{formatDate(mass.date)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Time:</span>
        <span>{formatTime(mass.date)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Location:</span>
        <span>{mass.location}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Status:</span>
        <span
          className={
            mass.status === "AVAILABLE" ? "text-green-600" : "text-red-600"
          }
        >
          {mass.status}
        </span>
      </div>
    </div>
  );
}

function SlotAvailability({ mass }: { mass: any }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Slot Availability
      </h3>
      <div className="space-y-4">
        <SlotRow
          label="Mass Intentions"
          booked={mass._count.massIntentions}
          available={mass.availableIntentionsSlots}
        />
        <SlotRow
          label="Thanksgiving"
          booked={mass._count.thanksgivings}
          available={mass.availableThanksgivingsSlots}
        />
      </div>
    </div>
  );
}

function SlotRow({
  label,
  booked,
  available,
}: {
  label: string;
  booked: number;
  available: number;
}) {
  const total = booked + available;
  return (
    <div className="flex justify-between items-center">
      <span>{label}:</span>
      <div className="flex items-center">
        <span className="font-medium mr-2">
          {booked} booked / {total} total
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            available > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {available} available
        </span>
      </div>
    </div>
  );
}

function PaginatedTable({
  title,
  rows,
  columns,
  footer,
}: {
  title: string;
  rows: any[];
  columns: {
    key: string;
    label: string;
    render: (row: any) => React.ReactNode;
  }[];
  footer?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {footer && <div className="flex justify-center my-4">{footer}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
