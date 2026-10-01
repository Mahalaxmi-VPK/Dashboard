export default function StatusBadge({ status }) {
  let color = "";

  if (status === "Healthy")
    color = "bg-green-500";

  else if (status === "Warning")
    color = "bg-yellow-500";

  else color = "bg-red-500";

  return (
    <span
      className={`${color} text-white px-3 py-1 rounded-full text-sm`}
    >
      {status}
    </span>
  );
}