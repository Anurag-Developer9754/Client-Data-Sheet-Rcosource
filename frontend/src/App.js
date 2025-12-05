import './App.css';
import Navbar from './Component/Navbar';
import Dashboard from "./Pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navbar />} />
          <Route path="/dashboard" element={<Dashboard />} />
        
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
