export default function UserTable({ users }) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-800">

      <table className="w-full">

        <thead className="bg-slate-900 text-slate-300">

          <tr>

            <th className="p-4 text-left">
              Username
            </th>

            <th className="p-4 text-left">
              Last Login
            </th>

            <th className="p-4 text-left">
              Risk Score
            </th>

            <th className="p-4 text-left">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.username}
              className="border-t border-slate-800 hover:bg-slate-900"
            >

              <td className="p-4">
                {user.username}
              </td>

              <td className="p-4">
                {user.lastLogin}
              </td>

              <td className="p-4 text-red-400 font-bold">
                {user.riskScore}
              </td>

              <td className="p-4">
                {user.status}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}