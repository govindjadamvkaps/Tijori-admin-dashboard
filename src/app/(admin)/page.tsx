// app/page.tsx
import type { Metadata } from "next";
import React from "react";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders";

export const metadata: Metadata = {
  title: "Tijori Admin Dashboard",
  description: "This is Tijori Admin Dashboard",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}