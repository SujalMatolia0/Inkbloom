"use client";

import { cn } from "@/theme/components";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-charcoal/10 rounded-none", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border-1.5 border-charcoal bg-linen shadow-neo-te-lg p-4 flex flex-col gap-4">
      <Skeleton className="w-full aspect-[4/5] bg-charcoal/20" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4 mt-4" />
      </div>
    </div>
  );
}

export function JournalSkeleton() {
  return (
    <div className="border-1.5 border-charcoal bg-linen overflow-hidden flex flex-col h-full">
      <Skeleton className="w-full h-48 bg-charcoal/20" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
