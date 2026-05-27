import { Routes, Route } from "react-router-dom";
import UserMenu from "./UserMenu";
import AdminDashboard from "./AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserMenu />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
