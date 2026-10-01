export default function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (

    <div
      className="
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-6
      hover:border-cyan-500
      hover:shadow-lg
      hover:shadow-cyan-500/20
      transition-all
      duration-300
      hover:-translate-y-1
      "
    >

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className={`${color} p-4 rounded-xl`}>

          {icon}

        </div>

      </div>

    </div>

  );
}