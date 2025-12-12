// frontend/src/Pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getDashboardData } from "../Utils/Api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList,
  BarChart, Bar
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0 });
  const [graphData, setGraphData] = useState([]);
  const [stateGraph, setStateGraph] = useState([]);
  const [skuGraph, setSkuGraph] = useState([]);
  const [month, setMonth] = useState("");

  const fetchDashboardData = async (m) => {
    try {
      if (!m) return;
      const res = await getDashboardData(m);
      setStats(res.data.stats || { orders: 0, revenue: 0 });
      setGraphData(res.data.graph || []);
      setStateGraph(res.data.stateGraph || []);
      setSkuGraph(res.data.skuGraph || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err.response?.data || err.message || err);
      // optional: show toast to user with err.response.data.error
    }
  };

  useEffect(() => {
    fetchDashboardData(month);
  }, [month]);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="mb-6">
        <label className="block font-semibold mb-1">Select Month</label>
        <select value={month} onChange={(e)=>setMonth(e.target.value)} className="border p-2 rounded">
          <option value="">-- Select Month --</option>
          {monthNames.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 shadow rounded-xl">
          <p className="text-gray-600">Orders</p>
          <h2 className="text-4xl font-bold text-green-600">{stats.orders}</h2>
        </div>

        <div className="bg-white p-5 shadow rounded-xl">
          <p className="text-gray-600">Revenue</p>
          <h2 className="text-4xl font-bold text-purple-600">₹{stats.revenue}</h2>
        </div>
      </div>

      {/* Daily */}
      <div className="bg-white p-5 shadow rounded-xl mb-10">
        <h2 className="text-2xl font-bold mb-4">Daily Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#1E90FF"><LabelList dataKey="orders" position="top" /></Line>
            <Line type="monotone" dataKey="revenue" stroke="#6A5ACD"><LabelList dataKey="revenue" position="top" formatter={(v)=>`₹${v}`} /></Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* State */}
      <div className="bg-white p-5 shadow rounded-xl mb-10">
        <h2 className="text-2xl font-bold mb-4">State Wise Orders & Revenue</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stateGraph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#1E90FF"><LabelList dataKey="orders" position="top" /></Bar>
            <Bar dataKey="revenue" fill="#6A5ACD"><LabelList dataKey="revenue" position="top" formatter={(v)=>`₹${v}`} /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SKU */}
      <div className="bg-white p-5 shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Top SKU Wise Order Count</h2>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={skuGraph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sku" angle={-45} textAnchor="end" interval={0} height={120} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#1E90FF"><LabelList dataKey="orders" position="top" /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Dashboard;
