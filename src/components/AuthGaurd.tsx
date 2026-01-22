"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const access_token = Cookies.get("access_token");
      // const access_token = true;

      // Allow access to reset-password page without authentication
      if (pathname === "/reset-password" || pathname === "/signin") {
        setIsAuthenticated(true);
        return;
      }

      if (!access_token) {
        router.replace("/signin");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return null;
  }

  return <>{children}</>;
}