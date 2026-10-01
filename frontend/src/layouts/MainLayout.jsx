import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

       <main className="flex-1 overflow-auto p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <Outlet />
</main>

        <Footer />

      </div>

    </div>
  );
}