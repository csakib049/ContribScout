import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: Props) {
  return (
    <div
      className={`mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)]${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </div>
  );
}
