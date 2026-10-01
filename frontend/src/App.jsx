import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Users from "./pages/Users";
import Activity from "./pages/Activity";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout />}>

          <Route index element={<Dashboard />} />

          <Route path="alerts" element={<Alerts />} />

          <Route path="users" element={<Users />} />

          <Route path="activity" element={<Activity />} />

          <Route path="reports" element={<Reports />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;