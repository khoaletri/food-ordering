"use client";

import React, { useState } from "react";
import { OrderType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";

const ReportPage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/orders").then((res) => res.json()),
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  if (isLoading) return "Loading...";

  const calculateProfit = (date) => {
    const selectedDateOrders = data.filter((order: OrderType) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getDate() === date.getDate() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear() &&
        (order.status === "Paid" || order.status === "Delivered")
      );
    });

    const totalProfit = selectedDateOrders.reduce(
      (sum: number, order: OrderType) => sum + Number(order.price),
      0
    );

    return totalProfit;
  };

  const calculateProfitForMonth = (date) => {
    const selectedMonthOrders = data.filter((order: OrderType) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear() &&
        (order.status === "Paid" || order.status === "Delivered")
      );
    });

    const totalProfit = selectedMonthOrders.reduce(
      (sum: number, order: OrderType) => sum + Number(order.price),
      0
    );

    return totalProfit;
  };

return (
  <div className="p-4 lg:px-20 xl:px-40">
    {/* Back to Orders link at the top left */}
    <div className="mb-4 lg:mb-0 text-left">
      <Link href="/orders" className="text-red-600 font-bold">
        Back to Orders
      </Link>
    </div>
    <div className="flex flex-col lg:flex-row p-4 justify-between items-center mb-4">
      <div className="mb-4 lg:mb-0">
        <h2 className="text-lg font-semibold mb-2">
          Profit for selected date:
        </h2>
        <div className="flex items-center border rounded-md p-2">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
          <div>${calculateProfit(selectedDate)}</div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Profit for selected month/year:
        </h2>
        <div className="flex items-center border rounded-md p-2">
          <DatePicker
            selected={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
          />
          <div>${calculateProfitForMonth(selectedMonth)}</div>
        </div>
      </div>
    </div>
  </div>
);
}

export default ReportPage;