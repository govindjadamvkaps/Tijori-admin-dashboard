// components/ecommerce/EcommerceMetrics.tsx
"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useDashboardCounts } from "@/lib/react-query/hooks/useDashboard";
import { Loader } from "../ui/Loader";

export default function EcommerceMetrics() {
  const { data, isLoading, isError, error } = useDashboardCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-2xl dark:bg-red-900/10">
        <p className="text-red-600 dark:text-red-400">
          {error instanceof Error ? error.message : 'Failed to load dashboard data'}
        </p>
      </div>
    );
  }

  const dashboardData = data?.data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* Users Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {dashboardData?.users.total.toLocaleString() || 0}
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Active: {dashboardData?.users.active || 0} | Deleted: {dashboardData?.users.deleted || 0}
            </p>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {dashboardData?.users.active || 0}
          </Badge>
        </div>
      </div>

      {/* Buckets Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Buckets
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {dashboardData?.buckets.total.toLocaleString() || 0}
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Active: {dashboardData?.buckets.active || 0}
            </p>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {dashboardData?.buckets.active || 0}
          </Badge>
        </div>
      </div>

      {/* Categories Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg className="w-6 h-6 text-gray-800 dark:text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Categories
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {dashboardData?.categories.total.toLocaleString() || 0}
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              System: {dashboardData?.categories.system || 0} | Custom: {dashboardData?.categories.custom || 0}
            </p>
          </div>

          <Badge color="primary">
            {dashboardData?.categories.total || 0}
          </Badge>
        </div>
      </div>
    </div>
  );
}