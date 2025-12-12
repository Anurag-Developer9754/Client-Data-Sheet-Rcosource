import React, { useState } from "react";
import { uploadSheet } from "../Utils/Api";

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [month, setMonth] = useState("");

  const handleUpload = async () => {
    if (!file || !month) {
      alert("Please select month and CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", month);

    try {
      const res = await uploadSheet(formData);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin CSV Upload Panel</h2>

      <div style={{ marginTop: "20px" }}>
        <label>Select Month</label>
        <select
          onChange={(e) => setMonth(e.target.value)}
          style={{ display: "block", padding: "10px", marginTop: "10px" }}
        >
          <option value="">-- Select Month --</option>
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>

        <br />

        <label>Upload CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "block", marginTop: "10px" }}
        />

        <br />

        <button
          onClick={handleUpload}
          style={{
            background: "black",
            color: "white",
            padding: "12px 22px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Upload File
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
