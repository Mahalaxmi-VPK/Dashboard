import { useEffect, useState } from "react";
import api from "../api/api";
import { Search, Download } from "lucide-react";
import { downloadCSV } from "../utils/downloadCSV";

export default function Activity() {

    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        fetchLogs();

        const interval = setInterval(fetchLogs, 5000);

        return () => clearInterval(interval);

    }, []);

    const fetchLogs = async () => {

        try {

            const response = await api.get("/logs");

            setLogs(response.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const filteredLogs = logs.filter(log =>

        log.user.toLowerCase().includes(search.toLowerCase()) ||

        log.event.toLowerCase().includes(search.toLowerCase()) ||

        log.query.toLowerCase().includes(search.toLowerCase())

    );

    const handleDownload = () => {

        downloadCSV(filteredLogs, "ActivityLogs.csv");

    };

    const badgeColor = (event) => {

        switch (event) {

            case "SELECT":
                return "bg-blue-600";

            case "INSERT":
                return "bg-green-600";

            case "UPDATE":
                return "bg-yellow-500 text-black";

            case "DELETE":
                return "bg-red-500";

            case "CREATE":
                return "bg-purple-600";

            case "ALTER":
                return "bg-orange-500";

            case "DROP":
                return "bg-red-700";

            case "TRUNCATE":
                return "bg-red-700";

            case "GRANT":
                return "bg-cyan-600";

            case "REVOKE":
                return "bg-pink-600";

            default:
                return "bg-slate-600";

        }

    };

    return (

        <div className="space-y-8">

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-4xl font-bold">
                        Database Activity
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Monitor all database operations in real time.
                    </p>

                </div>

                <button

                    onClick={handleDownload}

                    className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg flex items-center gap-2"

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

                    placeholder="Search user, event or SQL query"

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

                            <th className="p-4 text-left">
                                Time
                            </th>

                            <th className="p-4 text-left">
                                User
                            </th>

                            <th className="p-4 text-left">
                                Event
                            </th>

                            <th className="p-4 text-left">
                                SQL Query
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredLogs.map((log, index) => (

                            <tr

                                key={index}

                                className="border-t border-slate-800 hover:bg-slate-800"

                            >

                                <td className="p-4">

                                    {new Date(log.time).toLocaleString()}

                                </td>

                                <td className="p-4">

                                    {log.user}

                                </td>

                                <td className="p-4">

                                    <span

                                        className={`px-3 py-1 rounded-full text-sm ${badgeColor(log.event)}`}

                                    >

                                        {log.event}

                                    </span>

                                </td>

                                <td className="p-4 break-all">

                                    {log.query}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}