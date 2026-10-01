export default function LiveActivity({logs}) {


  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

      <h2 className="text-2xl font-semibold mb-5">
        Live Activity
      </h2>

      <div className="space-y-4">

        {logs.map((log, index) => (

          <div
            key={index}
            className="flex justify-between border-b border-slate-800 pb-3"
          >

            <span>{log.action}</span>

            <span className="text-slate-500">
              {log.time}
            </span>

          </div>

        ))}

      </div>

    </div>

  );
}