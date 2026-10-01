import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationDropdown() {

  const [open, setOpen] = useState(false);

  const notifications = [

    {
      severity: "Critical",
      message: "DROP TABLE detected",
      time: "2 mins ago",
    },

    {
      severity: "High",
      message: "12 Failed Login Attempts",
      time: "8 mins ago",
    },

    {
      severity: "Medium",
      message: "Unexpected Backup Created",
      time: "20 mins ago",
    },

  ];

  return (

    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="relative"
      >

        <Bell
          size={24}
          className="text-cyan-400 cursor-pointer"
        />

        <span
          className="
          absolute
          -top-2
          -right-2
          bg-red-500
          w-5
          h-5
          rounded-full
          text-xs
          flex
          items-center
          justify-center
          "
        >
          {notifications.length}
        </span>

      </button>

      {open && (

        <div
          className="
          absolute
          right-0
          mt-4
          w-80
          bg-slate-900
          border
          border-slate-700
          rounded-xl
          shadow-2xl
          z-50
          "
        >

          <div className="p-4 border-b border-slate-700">

            <h2 className="font-semibold">
              Notifications
            </h2>

          </div>

          {notifications.map((item, index) => (

            <div
              key={index}
              className="p-4 border-b border-slate-800 hover:bg-slate-800 transition"
            >

              <p className="font-semibold text-cyan-400">
                {item.severity}
              </p>

              <p className="text-sm mt-1">
                {item.message}
              </p>

              <p className="text-xs text-slate-500 mt-2">
                {item.time}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}