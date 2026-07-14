import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', ...props }, ref) => (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      ref={ref}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
