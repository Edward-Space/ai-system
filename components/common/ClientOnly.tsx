'use client';
import { useEffect, useState } from 'react';

type ClientOnlyProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

const ClientOnly = ({ children, fallback }: ClientOnlyProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []); // Chạy chỉ một lần khi component được mount

  return isClient ? children : fallback ?? <></>;
};

export default ClientOnly;
