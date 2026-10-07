import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: Props) {
  return (
    <div
      className={`mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </div>
  );
}
