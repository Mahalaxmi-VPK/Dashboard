export default function HealthCard({ health }) {

  const runningThreads =
    Number(health?.runningThreads || 0);

  const connectedThreads =
    Number(health?.connectedThreads || 0);

  const storage =
    Number(health?.storage || 0);

  const connections =
    Number(health?.connections || 0);


  const stats = [

    {
      title: "Running Threads",
      value: runningThreads,
      suffix: "",
      color: "bg-cyan-500",
      percentage: Math.min(runningThreads * 10, 100),
    },

    {
      title: "Connected Threads",
      value: connectedThreads,
      suffix: "",
      color: "bg-green-500",
      percentage: Math.min(connectedThreads * 10, 100),
    },

    {
      title: "Storage",
      value: storage,
      suffix: " MB",
      color: "bg-orange-500",
      percentage: Math.min(storage, 100),
    },

    {
      title: "Connections",
      value: connections,
      suffix: "",
      color: "bg-purple-500",
      percentage: Math.min(connections * 10, 100),
    },

  ];


  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-2xl font-semibold mb-6">
        Database Health
      </h2>


      <div className="space-y-5">

        {stats.map((item) => (

          <div key={item.title}>

            <div className="flex justify-between mb-2">

              <span className="text-slate-300">
                {item.title}
              </span>

              <span className="text-slate-400">
                {item.value}
                {item.suffix}
              </span>

            </div>


            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

              <div
                className={`${item.color} h-full rounded-full transition-all duration-500`}
                style={{
                  width: `${item.percentage}%`
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}