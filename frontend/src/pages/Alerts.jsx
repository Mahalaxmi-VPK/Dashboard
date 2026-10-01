import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import {
    Search,
    Download,
    RefreshCw,
    ShieldAlert
} from "lucide-react";
import { downloadCSV } from "../utils/downloadCSV";


export default function Alerts() {

    /*
    ========================================================
    STATE
    ========================================================
    */

    const [alerts, setAlerts] = useState([]);

    const [search, setSearch] = useState("");

    const [severityFilter, setSeverityFilter] = useState("All");

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");


    /*
    ========================================================
    FETCH ALERTS
    ========================================================
    
    - Initial page load -> loading screen
    - Manual refresh -> Refreshing button
    - NO automatic 5 second refresh
    ========================================================
    */

    const fetchAlerts = async (isManualRefresh = false) => {

        try {

            if (isManualRefresh) {

                setRefreshing(true);

            } else {

                setLoading(true);

            }


            setError("");


            const response = await api.get("/alerts");


            /*
            Make sure the response is actually an array.
            */

            setAlerts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (err) {

            console.error(
                "Failed to fetch alerts:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to connect to the alert server."
            );


        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    /*
    ========================================================
    INITIAL LOAD ONLY
    ========================================================

    IMPORTANT:
    There is NO setInterval here.

    Therefore the page will NOT blink every 5 seconds.
    ========================================================
    */

    useEffect(() => {

        fetchAlerts();

    }, []);


    /*
    ========================================================
    STATISTICS
    ========================================================
    */

    const criticalCount = alerts.filter(
        alert =>
            alert.severity === "Critical"
    ).length;


    const highCount = alerts.filter(
        alert =>
            alert.severity === "High"
    ).length;


    const mediumCount = alerts.filter(
        alert =>
            alert.severity === "Medium"
    ).length;


    /*
    ========================================================
    SEARCH + SEVERITY FILTER
    ========================================================
    */

    const filteredAlerts = useMemo(() => {

        return alerts.filter(alert => {

            const searchText =
                search.toLowerCase().trim();


            const matchesSearch =

                (alert.severity || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (alert.type || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (alert.user || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (alert.event || "")
                    .toLowerCase()
                    .includes(searchText);


            const matchesSeverity =

                severityFilter === "All" ||

                alert.severity === severityFilter;


            return (
                matchesSearch &&
                matchesSeverity
            );

        });

    }, [
        alerts,
        search,
        severityFilter
    ]);


    /*
    ========================================================
    CSV DOWNLOAD
    ========================================================
    */

    const handleDownload = () => {

        if (filteredAlerts.length === 0) {

            return;

        }


        downloadCSV(
            filteredAlerts,
            "SecurityAlerts.csv"
        );

    };


    /*
    ========================================================
    SEVERITY BADGE
    ========================================================
    */

    const badgeColor = (severity) => {

        switch (severity) {

            case "Critical":

                return (
                    "bg-red-500/20 " +
                    "text-red-400 " +
                    "border border-red-500/30"
                );


            case "High":

                return (
                    "bg-orange-500/20 " +
                    "text-orange-400 " +
                    "border border-orange-500/30"
                );


            case "Medium":

                return (
                    "bg-yellow-500/20 " +
                    "text-yellow-400 " +
                    "border border-yellow-500/30"
                );


            case "Low":

                return (
                    "bg-green-500/20 " +
                    "text-green-400 " +
                    "border border-green-500/30"
                );


            default:

                return (
                    "bg-slate-500/20 " +
                    "text-slate-400 " +
                    "border border-slate-500/30"
                );

        }

    };


    /*
    ========================================================
    LOADING SCREEN
    ========================================================
    */

    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-[70vh]">

                <div className="text-center">

                    <RefreshCw
                        size={32}
                        className="animate-spin mx-auto text-cyan-400"
                    />


                    <p className="text-slate-400 mt-4">

                        Loading security alerts...

                    </p>

                </div>

            </div>

        );

    }


    /*
    ========================================================
    MAIN PAGE
    ========================================================
    */

    return (

        <div className="space-y-8">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


                <div>

                    <div className="flex items-center gap-3">

                        <ShieldAlert
                            size={32}
                            className="text-red-400"
                        />


                        <h1 className="text-4xl font-bold">

                            Security Alerts

                        </h1>

                    </div>


                    <p className="text-slate-400 mt-2">

                        Monitor suspicious and
                        high-risk database activities.

                    </p>

                </div>


                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="flex gap-3">


                    {/* REFRESH */}

                    <button
                        onClick={() =>
                            fetchAlerts(true)
                        }
                        disabled={refreshing}
                        className="
                            bg-slate-800
                            hover:bg-slate-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            px-4
                            py-2
                            rounded-lg
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />


                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"
                        }

                    </button>


                    {/* DOWNLOAD */}

                    <button
                        onClick={handleDownload}
                        disabled={
                            filteredAlerts.length === 0
                        }
                        className="
                            bg-cyan-600
                            hover:bg-cyan-700
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                            px-5
                            py-2
                            rounded-lg
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Download size={18} />

                        Download CSV

                    </button>


                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    className="
                        bg-red-500/10
                        border
                        border-red-500/30
                        text-red-400
                        rounded-xl
                        p-4
                    "
                >

                    <div className="flex items-center justify-between gap-4">

                        <span>
                            {error}
                        </span>


                        <button
                            onClick={() =>
                                fetchAlerts(true)
                            }
                            disabled={refreshing}
                            className="
                                text-sm
                                underline
                                hover:text-red-300
                                disabled:opacity-50
                            "
                        >

                            Try Again

                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">


                {/* TOTAL */}

                <div
                    className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-xl
                        p-5
                    "
                >

                    <p className="text-slate-400">

                        Total Alerts

                    </p>


                    <p className="text-3xl font-bold mt-2">

                        {alerts.length}

                    </p>

                </div>


                {/* CRITICAL */}

                <div
                    className="
                        bg-slate-900
                        border
                        border-red-500/20
                        rounded-xl
                        p-5
                    "
                >

                    <p className="text-slate-400">

                        Critical

                    </p>


                    <p
                        className="
                            text-3xl
                            font-bold
                            text-red-400
                            mt-2
                        "
                    >

                        {criticalCount}

                    </p>

                </div>


                {/* HIGH */}

                <div
                    className="
                        bg-slate-900
                        border
                        border-orange-500/20
                        rounded-xl
                        p-5
                    "
                >

                    <p className="text-slate-400">

                        High

                    </p>


                    <p
                        className="
                            text-3xl
                            font-bold
                            text-orange-400
                            mt-2
                        "
                    >

                        {highCount}

                    </p>

                </div>


                {/* MEDIUM */}

                <div
                    className="
                        bg-slate-900
                        border
                        border-yellow-500/20
                        rounded-xl
                        p-5
                    "
                >

                    <p className="text-slate-400">

                        Medium

                    </p>


                    <p
                        className="
                            text-3xl
                            font-bold
                            text-yellow-400
                            mt-2
                        "
                    >

                        {mediumCount}

                    </p>

                </div>


            </div>


            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <div className="flex flex-col lg:flex-row gap-4">


                {/* SEARCH */}

                <div className="relative flex-1">

                    <Search
                        className="
                            absolute
                            left-3
                            top-3
                            text-slate-400
                        "
                        size={20}
                    />


                    <input
                        type="text"
                        placeholder="
                            Search user, event, type or severity...
                        "
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            bg-slate-900
                            border
                            border-slate-700
                            rounded-lg
                            py-3
                            pl-10
                            pr-4
                            outline-none
                            focus:border-cyan-500
                        "
                    />

                </div>


                {/* SEVERITY */}

                <select
                    value={severityFilter}
                    onChange={(e) =>
                        setSeverityFilter(e.target.value)
                    }
                    className="
                        bg-slate-900
                        border
                        border-slate-700
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                    "
                >

                    <option value="All">
                        All Severities
                    </option>

                    <option value="Critical">
                        Critical
                    </option>

                    <option value="High">
                        High
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="Low">
                        Low
                    </option>

                </select>

            </div>


            {/* =================================================
                ALERT TABLE
            ================================================= */}

            <div
                className="
                    bg-slate-900
                    rounded-xl
                    border
                    border-slate-800
                    overflow-hidden
                "
            >

                {filteredAlerts.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="py-20 text-center">

                        <ShieldAlert
                            size={48}
                            className="
                                mx-auto
                                text-slate-600
                            "
                        />


                        <h2
                            className="
                                text-xl
                                font-semibold
                                mt-4
                            "
                        >

                            No security alerts found

                        </h2>


                        <p className="text-slate-500 mt-2">

                            {alerts.length === 0

                                ? "No suspicious database activity has been detected yet."

                                : "Try changing your search or severity filter."
                            }

                        </p>

                    </div>

                ) : (

                    /* ALERT TABLE */

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-800">

                                <tr>

                                    <th className="p-4 text-left">
                                        Severity
                                    </th>

                                    <th className="p-4 text-left">
                                        Type
                                    </th>

                                    <th className="p-4 text-left">
                                        User
                                    </th>

                                    <th className="p-4 text-left">
                                        Event
                                    </th>

                                    <th className="p-4 text-left">
                                        Time
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredAlerts.map(
                                    (alert, index) => (

                                        <tr
                                            key={
                                                alert.id ||
                                                `${alert.time}-${index}`
                                            }
                                            className="
                                                border-t
                                                border-slate-800
                                                hover:bg-slate-800/60
                                            "
                                        >


                                            {/* SEVERITY */}

                                            <td className="p-4">

                                                <span
                                                    className={`
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-sm
                                                        ${badgeColor(
                                                            alert.severity
                                                        )}
                                                    `}
                                                >

                                                    {alert.severity ||
                                                        "Unknown"}

                                                </span>

                                            </td>


                                            {/* TYPE */}

                                            <td
                                                className="
                                                    p-4
                                                    text-slate-300
                                                "
                                            >

                                                {alert.type ||
                                                    "Unknown"}

                                            </td>


                                            {/* USER */}

                                            <td
                                                className="
                                                    p-4
                                                    text-slate-300
                                                "
                                            >

                                                {alert.user ||
                                                    "Unknown"}

                                            </td>


                                            {/* EVENT */}

                                            <td className="p-4 max-w-xl">

                                                <code
                                                    className="
                                                        text-cyan-300
                                                        text-sm
                                                        break-words
                                                    "
                                                >

                                                    {alert.event ||
                                                        alert.message ||
                                                        "Security event detected"}

                                                </code>

                                            </td>


                                            {/* TIME */}

                                            <td
                                                className="
                                                    p-4
                                                    text-slate-400
                                                    whitespace-nowrap
                                                "
                                            >

                                                {alert.time
                                                    ? new Date(
                                                        alert.time
                                                    ).toLocaleString()
                                                    : "Unknown"
                                                }

                                            </td>


                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


        </div>

    );

}