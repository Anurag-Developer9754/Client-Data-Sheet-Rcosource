import React, { useEffect, useState } from "react";
import { getDashboardData } from "../Utils/Api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
  });

  const [graphData, setGraphData] = useState([]);
  const [month, setMonth] = useState("");

  const fetchDashboardData = async () => {
    try {
      if (!month) return;

      const response = await getDashboardData({
        params: { month }, 
      });

      setStats(response.data.stats);
      setGraphData(response.data.graph);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [month]);


  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Month Picker */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Select Month</label>
        <select 
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Month --</option>
          {monthNames.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 shadow rounded-xl">
          <p className="text-gray-600">Orders</p>
          <h2 className="text-4xl font-bold text-green-600">
            {stats.orders}
          </h2>
        </div>

        <div className="bg-white p-5 shadow rounded-xl">
          <p className="text-gray-600">Revenue</p>
          <h2 className="text-4xl font-bold text-purple-600">
            ₹{stats.revenue}
          </h2>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white p-5 shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Daily Performance</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="orders" stroke="#1E90FF">
              <LabelList dataKey="orders" position="top" />
            </Line>

            <Line type="monotone" dataKey="revenue" stroke="#6A5ACD">
              <LabelList dataKey="revenue" position="top" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
