"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function QuickActionButton({
  href,
  icon,
  label,
  primary = false,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  className?: string;
}) {
  return (
    <Button
      variant={primary ? "default" : "secondary"}
      className={`w-full rounded-full h-auto py-3 px-4 flex items-center justify-center text-sm font-medium hover:bg-${primary}`}>
      <Link href={href} className="flex mx-auto items-center justify-center">
        {icon}
        <span className="truncate">{label}</span>
      </Link>
    </Button>
  );
}
