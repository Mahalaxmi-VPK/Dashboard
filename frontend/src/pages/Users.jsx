import { useEffect, useState } from "react";
import api from "../api/api";
import { Search, Download } from "lucide-react";
import { downloadCSV } from "../utils/downloadCSV";

export default function Users() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        fetchUsers();

    }, []);

    const fetchUsers = async () => {

        try {

            const response = await api.get("/users");

            setUsers(response.data);

        } catch (err) {

            console.log(err);

        }

    };

    const filteredUsers = users.filter(user =>

        user.user.toLowerCase().includes(search.toLowerCase()) ||

        user.host.toLowerCase().includes(search.toLowerCase())

    );

    const handleDownload = () => {

        downloadCSV(filteredUsers, "DatabaseUsers.csv");

    };

    return (

        <div className="space-y-8">

            {/* Heading */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-4xl font-bold">
                        Database Users
                    </h1>

                    <p className="text-slate-400 mt-2">
                        View all MySQL database accounts.
                    </p>

                </div>

                <button

                    onClick={handleDownload}

                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg"

                >

                    <Download size={18} />

                    Download CSV

                </button>

            </div>

            {/* Search */}

            <div className="relative">

                <Search
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                />

                <input

                    type="text"

                    placeholder="Search User / Host"

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4"

                />

            </div>

            {/* Table */}

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-800">

                        <tr>

                            <th className="p-4 text-left">User</th>

                            <th className="p-4 text-left">Host</th>

                            <th className="p-4 text-left">Account</th>

                            <th className="p-4 text-left">Password</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredUsers.map((user, index) => (

                            <tr

                                key={index}

                                className="border-t border-slate-800 hover:bg-slate-800"

                            >

                                <td className="p-4">

                                    {user.user}

                                </td>

                                <td className="p-4">

                                    {user.host}

                                </td>

                                <td className="p-4">

                                    <span

                                        className={`px-3 py-1 rounded-full text-sm

                                        ${user.status === "Unlocked"

                                            ? "bg-green-600"

                                            : "bg-red-600"

                                        }`}

                                    >

                                        {user.status}

                                    </span>

                                </td>

                                <td className="p-4">

                                    {user.password}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}