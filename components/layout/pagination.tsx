"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ResponsivePaginationProps {
  totalItems: number;
  limit: number;
  siblingCount?: number;
  pageParam: string;
}

export function PaginationComponent({
  totalItems,
  limit,
  siblingCount = 1,
  pageParam,
}: ResponsivePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const currentPage = Number(searchParams.get(pageParam) || "1");
  const totalPages = Math.ceil(totalItems / limit);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(pageParam, pageNumber.toString());
    params.set("limit", limit.toString());

    return `${pathname}?${params.toString()}`;
  };

  const generatePagination = () => {
    const effectiveSiblingCount = isSmallScreen ? 0 : siblingCount;

    if (totalPages <= effectiveSiblingCount * 2 + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - effectiveSiblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + effectiveSiblingCount,
      totalPages
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "leftEllipsis", ...middleRange, "rightEllipsis", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: 5 },
        (_, i) => totalPages - 4 + i
      );
      return [1, "leftEllipsis", ...rightRange];
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from({ length: 5 }, (_, i) => i + 1);
      return [...leftRange, "rightEllipsis", totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pages = generatePagination();

  if (isSmallScreen) {
    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() =>
            currentPage > 1 && router.push(createPageURL(currentPage - 1))
          }
          disabled={currentPage <= 1}
          className={`p-2 rounded-md border ${
            currentPage <= 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-muted"
          }`}
          aria-label="Previous page"
        >
          <span aria-hidden="true">←</span>
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            currentPage < totalPages &&
            router.push(createPageURL(currentPage + 1))
          }
          disabled={currentPage >= totalPages}
          className={`p-2 rounded-md border ${
            currentPage >= totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-muted"
          }`}
          aria-label="Next page"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    );
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : 0}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages.map((page, i) => {
          if (page === "leftEllipsis" || page === "rightEllipsis") {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages ? createPageURL(currentPage + 1) : "#"
            }
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : 0}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
