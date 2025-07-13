import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface OverviewCardProps {
  title: string;
  description: string;
  href: string;
}

export function OverviewCard({ title, description, href }: OverviewCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="bg-white bg-opacity-95 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <Button
            variant="outline"
            className="w-full rounded-full text-primary border-primary hover:bg-primary hover:text-white"
            aria-label={`View all ${title.toLowerCase()}`}>
            View All
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
