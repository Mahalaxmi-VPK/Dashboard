export default function ActivityTable({ logs }) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-800">

      <table className="w-full">

        <thead className="bg-slate-900">

          <tr>

            <th className="p-4 text-left">
              Time
            </th>

            <th className="p-4 text-left">
              User
            </th>

            <th className="p-4 text-left">
              Action
            </th>

            <th className="p-4 text-left">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {logs.map((log, index) => (

            <tr
              key={index}
              className="border-t border-slate-800 hover:bg-slate-900"
            >

              <td className="p-4">
                {log.time}
              </td>

              <td className="p-4">
                {log.user}
              </td>

              <td className="p-4">
                {log.operation}
              </td>

              <td className="p-4">
                {log.status}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}