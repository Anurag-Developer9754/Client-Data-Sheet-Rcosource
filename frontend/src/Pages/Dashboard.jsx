import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
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
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
  });

  const [graphData, setGraphData] = useState([]);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardData();
      setStats(response.data.stats);
      setGraphData(response.data.graph);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-4 w-full max-w-full overflow-x-hidden">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 bg-white shadow rounded-xl">
            <p className="text-lg font-semibold text-gray-600">Users</p>
            <h2 className="text-4xl font-bold text-blue-600">{stats.users}</h2>
          </div>

          <div className="p-5 bg-white shadow rounded-xl">
            <p className="text-lg font-semibold text-gray-600">Orders</p>
            <h2 className="text-4xl font-bold text-green-600">{stats.orders}</h2>
          </div>

          <div className="p-5 bg-white shadow rounded-xl">
            <p className="text-lg font-semibold text-gray-600">Revenue</p>
            <h2 className="text-4xl font-bold text-purple-600">
              ₹{stats.revenue}
            </h2>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="bg-white p-5 rounded-xl shadow w-full">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Monthly Performance
          </h2>

          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#1E90FF"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6A5ACD"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
