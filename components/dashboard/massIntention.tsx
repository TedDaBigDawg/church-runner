import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface MassIntention {
  id: string;
  name: string;
  intention: string;
  status: string;
  mass: { date: Date };
}

interface MassIntentionListProps {
  massIntentions: MassIntention[];
}

export function MassIntentionList({ massIntentions }: MassIntentionListProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Recent Mass Intentions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {massIntentions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {massIntentions.map((intention) => (
              <li key={intention.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {intention.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {intention.intention}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(intention.mass.date)}
                  </div>
                </div>
                <div className="mt-1">
                  <Badge
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      intention.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : intention.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {intention.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent mass intentions.</p>
        )}
        <div className="mt-4">
          <Link href="/dashboard/mass-intentions">
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-white rounded-full"
              size="sm"
              aria-label="View all mass intentions">
              View All
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );
}
