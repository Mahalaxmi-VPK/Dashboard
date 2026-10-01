import { useState } from "react";
import api from "../api/api";
import {
    Download,
    FileText,
    Loader2
} from "lucide-react";


export default function Reports() {

    const [loading, setLoading] = useState("");

    const [error, setError] = useState("");


    /*
    =======================================================
    CONVERT REPORT JSON → CSV
    =======================================================
    */

    const convertToCSV = (report) => {

        const rows = [];


        /*
        Report information
        */

        rows.push([
            "DB Guardian Report"
        ]);

        rows.push([
            "Report Period",
            report.reportPeriod
        ]);

        rows.push([
            "Period",
            `${report.periodInDays} days`
        ]);

        rows.push([
            "Generated At",
            new Date(
                report.generatedAt
            ).toLocaleString()
        ]);


        rows.push([]);


        /*
        Summary
        */

        rows.push([
            "SUMMARY"
        ]);

        rows.push([
            "Total Queries",
            report.totalQueries
        ]);

        rows.push([
            "Total Alerts",
            report.totalAlerts
        ]);

        rows.push([
            "Critical Alerts",
            report.criticalAlerts
        ]);

        rows.push([
            "High Alerts",
            report.highAlerts
        ]);

        rows.push([
            "Medium Alerts",
            report.mediumAlerts
        ]);


        rows.push([]);


        /*
        Query Activity
        */

        rows.push([
            "QUERY ACTIVITY"
        ]);

        rows.push([
            "Query Type",
            "Count"
        ]);


        Object.entries(
            report.queryActivity || {}
        ).forEach(([query, count]) => {

            rows.push([
                query,
                count
            ]);

        });


        rows.push([]);


        /*
        Risk Distribution
        */

        rows.push([
            "RISK DISTRIBUTION"
        ]);

        rows.push([
            "Severity",
            "Count"
        ]);


        (
            report.riskDistribution || []
        ).forEach(item => {

            rows.push([
                item.name,
                item.value
            ]);

        });


        /*
        ===================================================
        ESCAPE CSV VALUES
        ===================================================
        */

        return rows
            .map(row =>
                row
                    .map(value => {

                        const text =
                            value === undefined ||
                            value === null
                                ? ""
                                : String(value);

                        return `"${text.replace(
                            /"/g,
                            '""'
                        )}"`;

                    })
                    .join(",")
            )
            .join("\n");

    };


    /*
    =======================================================
    DOWNLOAD REPORT
    =======================================================
    */

    const downloadReport = async (period) => {

        try {

            setLoading(period);

            setError("");


            /*
            Get report from backend
            */

            const response =
                await api.get(
                    `/reports/${period}`
                );


            const report =
                response.data;


            /*
            Convert JSON → CSV
            */

            const csv =
                convertToCSV(report);


            /*
            Create downloadable file
            */

            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                `DB_Guardian_${period}_report.csv`;


            document.body.appendChild(link);


            link.click();


            document.body.removeChild(link);


            window.URL.revokeObjectURL(url);


        } catch (error) {

            console.error(
                "Report download error:",
                error
            );


            setError(
                error.response?.data?.message ||
                `Unable to download ${period} report.`
            );

        } finally {

            setLoading("");

        }

    };


    /*
    =======================================================
    REPORT CARDS
    =======================================================
    */

    const reports = [

        {
            id: "daily",
            title: "Daily Report",
            description:
                "Database activity and security events from the last 24 hours."
        },

        {
            id: "weekly",
            title: "Weekly Report",
            description:
                "Database activity and security events from the last 7 days."
        },

        {
            id: "monthly",
            title: "Monthly Report",
            description:
                "Database activity and security events from the last 30 days."
        }

    ];


    /*
    =======================================================
    UI
    =======================================================
    */

    return (

        <div className="space-y-8">


            {/* HEADER */}

            <div>

                <div className="flex items-center gap-3">

                    <FileText
                        size={32}
                        className="text-cyan-400"
                    />

                    <h1 className="text-4xl font-bold">
                        Reports
                    </h1>

                </div>


                <p className="text-slate-400 mt-2">

                    Generate and download database
                    security reports.

                </p>

            </div>


            {/* ERROR */}

            {error && (

                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">

                    {error}

                </div>

            )}


            {/* REPORT CARDS */}

            <div className="grid md:grid-cols-3 gap-6">


                {reports.map(report => (

                    <div
                        key={report.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                    >


                        <div className="flex items-center justify-center w-14 h-14 bg-cyan-500/10 rounded-xl mb-5">

                            <FileText
                                size={28}
                                className="text-cyan-400"
                            />

                        </div>


                        <h2 className="text-xl font-semibold">

                            {report.title}

                        </h2>


                        <p className="text-slate-400 text-sm mt-2 min-h-[60px]">

                            {report.description}

                        </p>


                        <button
                            onClick={() =>
                                downloadReport(
                                    report.id
                                )
                            }
                            disabled={
                                loading !== ""
                            }
                            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-3 flex items-center justify-center gap-2"
                        >

                            {loading === report.id ? (

                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Generating...

                                </>

                            ) : (

                                <>

                                    <Download
                                        size={18}
                                    />

                                    Download CSV

                                </>

                            )}

                        </button>


                    </div>

                ))}


            </div>


        </div>

    );

}