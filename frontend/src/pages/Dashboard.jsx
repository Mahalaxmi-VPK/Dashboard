import DashboardCard from "../components/DashboardCard";
import AlertCard from "../components/AlertCard";

import RiskChart from "../components/RiskChart";
import LoginChart from "../components/LineChart";
import QueryChart from "../components/BarChart";

import HealthCard from "../components/HealthCard";
import LiveActivity from "../components/LiveActivity";

import { useEffect, useState } from "react";
import api from "../api/api";

import {
  Users,
  Database,
  ShieldAlert,
  Activity,
} from "lucide-react";


export default function Dashboard() {

  /*
  =========================================================
  STATE
  =========================================================
  */

  const [dashboard, setDashboard] = useState(null);

  /*
  Alerts are stored separately because the alerts come
  from the /alerts endpoint.
  */

  const [dashboardAlerts, setDashboardAlerts] = useState([]);

  const [error, setError] = useState("");


  /*
  =========================================================
  FETCH DASHBOARD + ALERTS
  =========================================================
  */

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        /*
        =====================================================
        GET DASHBOARD DATA
        =====================================================
        */

        const dashboardResponse =
          await api.get("/dashboard");


        setDashboard(
          dashboardResponse.data
        );


        /*
        =====================================================
        GET SECURITY ALERTS
        =====================================================
        */

        const alertsResponse =
          await api.get("/alerts");


        const incomingAlerts =
          Array.isArray(alertsResponse.data)
            ? alertsResponse.data
            : [];


        /*
        =====================================================
        KEEP OLD + NEW ALERTS
        =====================================================
        */

        setDashboardAlerts((previousAlerts) => {

          const combinedAlerts = [
            ...previousAlerts,
            ...incomingAlerts
          ];


          /*
          Remove duplicate alerts
          */

          const seen = new Set();

          const uniqueAlerts = [];


          combinedAlerts.forEach((alert) => {

            /*
            If backend provides an ID,
            use that as the unique identifier.

            Otherwise use event + time.
            */

            const alertKey =
              alert.id ||
              `${alert.severity || ""}-${
                alert.event ||
                alert.message ||
                ""
              }-${alert.time || ""}`;


            if (!seen.has(alertKey)) {

              seen.add(alertKey);

              uniqueAlerts.push(alert);

            }

          });


          /*
          ===================================================
          NEWEST ALERTS FIRST
          ===================================================
          */

          uniqueAlerts.sort((a, b) => {

            const timeA =
              new Date(
                a.time || 0
              ).getTime();

            const timeB =
              new Date(
                b.time || 0
              ).getTime();

            return timeB - timeA;

          });


          /*
          ===================================================
          KEEP ONLY LATEST 20
          ===================================================
          */

          return uniqueAlerts.slice(0, 20);

        });


        setError("");


      } catch (error) {

        console.error(
          "Dashboard fetch error:",
          error
        );


        /*
        Don't destroy the dashboard if a refresh
        temporarily fails.
        */

        if (!dashboard) {

          setError(
            "Unable to connect to the database monitoring server."
          );

        }

      }

    };


    /*
    Initial fetch
    */

    fetchDashboard();


    /*
    Refresh dashboard every 5 seconds
    */

    const interval = setInterval(
      fetchDashboard,
      5000
    );


    /*
    Cleanup
    */

    return () => clearInterval(interval);

  }, []);


  /*
  =========================================================
  LOADING STATE
  =========================================================
  */

  if (!dashboard && !error) {

    return (

      <div className="flex items-center justify-center min-h-screen text-white">

        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-5"></div>

          <p className="text-xl">
            Loading Dashboard...
          </p>

        </div>

      </div>

    );

  }


  /*
  =========================================================
  ERROR STATE
  =========================================================
  */

  if (error && !dashboard) {

    return (

      <div className="flex items-center justify-center min-h-screen">

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">

          <ShieldAlert
            size={48}
            className="text-red-400 mx-auto mb-4"
          />

          <h2 className="text-xl font-semibold text-red-400">
            Dashboard Error
          </h2>

          <p className="text-slate-400 mt-2">
            {error}
          </p>

          <p className="text-slate-500 mt-4 text-sm">
            Make sure your Node.js backend is running on port 3000.
          </p>

        </div>

      </div>

    );

  }


  /*
  =========================================================
  SAFE DEFAULTS
  =========================================================
  */

  /*
  IMPORTANT:
  Alerts now come from dashboardAlerts,
  NOT dashboard.alerts.
  */

  const alerts = dashboardAlerts;


  const liveActivity =
    Array.isArray(dashboard.liveActivity)
      ? dashboard.liveActivity
      : [];


  const riskDistribution =
    Array.isArray(dashboard.riskDistribution)
      ? dashboard.riskDistribution
      : [];


  const loginTrend =
    Array.isArray(dashboard.loginTrend)
      ? dashboard.loginTrend
      : [];


  /*
  =========================================================
  QUERY ACTIVITY
  =========================================================
  */

  const queryActivity = Object.entries(
    dashboard.queryActivity || {}
  ).map(([query, count]) => ({

    query,

    count: Number(count) || 0

  }));


  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (

    <div className="space-y-8">


      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Real-Time Database Monitoring
        </p>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">


        <DashboardCard
          title="Active Users"
          value={dashboard.activeUsers ?? 0}
          icon={<Users />}
          color="bg-cyan-600"
        />


        <DashboardCard
          title="Connections"
          value={dashboard.activeConnections ?? 0}
          icon={<Database />}
          color="bg-green-600"
        />


        <DashboardCard
          title="Failed Logins"
          value={dashboard.failedLogins ?? 0}
          icon={<ShieldAlert />}
          color="bg-red-600"
        />


        <DashboardCard
          title="Critical Alerts"
          value={dashboard.criticalAlerts ?? 0}
          icon={<Activity />}
          color="bg-orange-600"
        />

      </div>


      {/* =================================================
          DATABASE HEALTH + RISK
      ================================================= */}

      <div className="grid lg:grid-cols-2 gap-8">

        <HealthCard
          health={dashboard.health || {}}
        />

        <RiskChart
          data={riskDistribution}
        />

      </div>


      {/* =================================================
          LOGIN + QUERY CHARTS
      ================================================= */}

      <div className="grid lg:grid-cols-2 gap-8">

        <LoginChart
          data={loginTrend}
        />

        <QueryChart
          data={queryActivity}
        />

      </div>


      {/* =================================================
          LIVE ACTIVITY + SECURITY ALERTS
      ================================================= */}

      <div className="grid lg:grid-cols-2 gap-8">


        {/* =================================================
            LIVE ACTIVITY
        ================================================= */}

        <LiveActivity
          logs={liveActivity}
        />


        {/* =================================================
            SECURITY ALERTS
        ================================================= */}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">


          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-semibold">
              Security Alerts
            </h2>


            <span className="text-sm text-slate-500">
              {alerts.length} alerts
            </span>

          </div>


          <div className="space-y-4 max-h-[420px] overflow-y-auto">


            {alerts.length === 0 ? (

              <div className="text-center py-12">

                <ShieldAlert
                  size={42}
                  className="mx-auto text-slate-600"
                />


                <p className="text-slate-400 mt-4">
                  No security alerts detected
                </p>


                <p className="text-slate-600 text-sm mt-1">
                  The database is currently clear.
                </p>

              </div>

            ) : (

              alerts
                .slice(0, 5)
                .map((alert, index) => (

                  <AlertCard
                    key={
                      alert.id ||
                      `${alert.time}-${index}`
                    }

                    severity={
                      alert.severity
                    }

                    message={
                      alert.event ||
                      alert.message ||
                      "Security event detected"
                    }

                    time={
                      alert.time
                    }
                  />

                ))

            )}

          </div>

        </div>

      </div>

    </div>

  );

}