"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function RouteShell({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isPastorDashboard =
    pathname === "/dashboard/pastor_admin" ||
    pathname.startsWith("/dashboard/pastor_admin/");

  if (isPastorDashboard) return children;

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}