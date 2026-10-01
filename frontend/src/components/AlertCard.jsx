export default function AlertCard({
  severity,
  message,
  time,
}) {
  const color =
    severity === "Critical"
      ? "bg-red-500"
      : severity === "High"
      ? "bg-orange-500"
      : severity === "Medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500 transition">

      <div className="flex justify-between">

        <span
          className={`${color} text-white px-3 py-1 rounded-full text-sm`}
        >
          {severity}
        </span>

        <span className="text-slate-500">
          {time}
        </span>

      </div>

      <p className="text-white mt-4 text-lg">
        {message}
      </p>

    </div>
  );
}