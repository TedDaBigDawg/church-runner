import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getAllPayments } from "@/actions/payment-actions";
import { PaginationComponent } from "@/components/layout/pagination";

const PAGE_SIZE = 5;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminDonationsPage(props: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const donationsPage = Math.max(
    parseInt((searchParams["donations"] as string) ?? "1", 10),
    1
  );
  const offeringsPage = Math.max(
    parseInt((searchParams["offerings"] as string) ?? "1", 10),
    1
  );

  const payments = await getAllPayments();

  const donations = payments.filter((p) => p.type === "DONATION");
  const offerings = payments.filter((p) => p.type === "OFFERING");

  const totalDonations = donations.reduce(
    (sum, p) => (p.status === "PAID" ? sum + p.amount : sum),
    0
  );
  const totalOfferings = offerings.reduce(
    (sum, p) => (p.status === "PAID" ? sum + p.amount : sum),
    0
  );

  const totalByCategory = donations.reduce((acc, p) => {
    if (p.status === "PAID" && p.category) {
      acc[p.category] = (acc[p.category] || 0) + p.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Paginate donations
  const donationsStart = (donationsPage - 1) * PAGE_SIZE;
  const donationsEnd = donationsStart + PAGE_SIZE;
  const paginatedDonations = donations.slice(donationsStart, donationsEnd);

  // Paginate offerings
  const offeringsStart = (offeringsPage - 1) * PAGE_SIZE;
  const offeringsEnd = offeringsStart + PAGE_SIZE;
  const paginatedOfferings = offerings.slice(offeringsStart, offeringsEnd);

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-3  md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Donations
            </h1>
            <p className="text-gray-600">
              View and manage all donations and offerings.
            </p>
          </div>
          <div className="">
            <Link href="/admin/payments/new">
              <Button className=" hover:bg-primary">
                Create Fundraising Goal
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <SummaryCard
            title="Total Donations"
            value={formatCurrency(totalDonations)}
          />
          <SummaryCard
            title="Total Offerings"
            value={formatCurrency(totalOfferings)}
          />
          <SummaryCard
            title="Pending Payments"
            value={payments
              .filter((p) => p.status === "UNPAID")
              .length.toString()}
          />
          <SummaryCard
            title="Total Contributions"
            value={formatCurrency(totalDonations + totalOfferings)}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Donations by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(totalByCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(totalByCategory).map(([category, total]) => (
                    <div
                      key={category}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">
                        {category.replace("_", " ")}
                      </span>
                      <span className="font-bold">{formatCurrency(total)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No donation data available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {payments.slice(0, 5).map((payment) => (
                    <li key={payment.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {payment.type}{" "}
                            {payment.category && `(${payment.category})`}
                          </p>
                          <p className="text-sm text-gray-500">
                            By {payment.user.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent contributions.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Donations Table */}
        <PaginatedTable
          title="All Donations"
          rows={paginatedDonations}
          columns={[
            {
              key: "date",
              label: "Date",
              render: (p) => formatDate(p.createdAt),
            },
            {
              key: "user",
              label: "User",
              render: (p) => (
                <>
                  <div>{p.user.name}</div>
                  <div className="text-xs text-gray-500">{p.user.email}</div>
                </>
              ),
            },
            {
              key: "category",
              label: "Category",
              render: (p) => p.category?.replace("_", " ") || "-",
            },
            {
              key: "amount",
              label: "Amount",
              render: (p) => formatCurrency(p.amount),
            },
            {
              key: "status",
              label: "Status",
              render: (p) => <StatusBadge status={p.status} />,
            },
          ]}
          footer={
            <PaginationComponent
              limit={PAGE_SIZE}
              totalItems={donations.length}
              siblingCount={1}
              pageParam="donations"
            />
          }
        />

        {/* Offerings Table */}
        <PaginatedTable
          title="All Offerings"
          rows={paginatedOfferings}
          columns={[
            {
              key: "date",
              label: "Date",
              render: (p) => formatDate(p.createdAt),
            },
            {
              key: "user",
              label: "User",
              render: (p) => (
                <>
                  <div>{p.user.name}</div>
                  <div className="text-xs text-gray-500">{p.user.email}</div>
                </>
              ),
            },
            {
              key: "description",
              label: "Description",
              render: (p) => p.description || "-",
            },
            {
              key: "amount",
              label: "Amount",
              render: (p) => formatCurrency(p.amount),
            },
            {
              key: "status",
              label: "Status",
              render: (p) => <StatusBadge status={p.status} />,
            },
          ]}
          footer={
            <PaginationComponent
              limit={PAGE_SIZE}
              totalItems={offerings.length}
              siblingCount={1}
              pageParam="offerings"
            />
          }
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
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
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
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
        </CardContent>
        <div className="flex justify-center mt-4">{footer}</div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "PAID"
      ? "bg-green-100 text-green-800"
      : status === "FAILED"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}
