import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  type: string;
  category?: string;
  description?: string;
  amount: number;
  status: string;
  createdAt: Date;
}

interface DonationListProps {
  payments: Payment[];
}

export function DonationList({ payments }: DonationListProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Recent Donations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <li key={payment.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {payment.type === "DONATION"
                        ? `Donation (${payment.category?.replace("_", " ")})`
                        : "Offering"}
                    </p>
                    {payment.description && (
                      <p className="text-sm text-gray-600">
                        {payment.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      ${payment.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
                {payment.status === "UNPAID" && (
                  <div className="mt-2">
                    <Link href={`/dashboard/payments/${payment.id}/pay`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-full text-primary border-primary hover:bg-primary hover:text-white"
                        aria-label="Complete payment">
                        Complete Payment
                      </Button>
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent donations.</p>
        )}
        <div className="mt-4">
          <Link href="/dashboard/payments">
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-white rounded-full"
              size="sm"
              aria-label="View all donations">
              View All
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );
}
