import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { subDays, format } from "date-fns";
import { DatePicker } from "antd";
import axios from "~/utils/axiosCustomize";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;
// Sample Monthly Data
const sampleDataMonthly = [
    { month: "2024-01", access: 500 },
    { month: "2024-02", access: 1200 },
    { month: "2024-03", access: 700 },
    { month: "2024-04", access: 400 },
    { month: "2024-05", access: 1100 },
    { month: "2024-06", access: 1600 },
    { month: "2024-07", access: 1700 },
    { month: "2024-08", access: 1400 },
    { month: "2024-09", access: 900 },
    { month: "2024-10", access: 1000 },
    { month: "2024-11", access: 900 },
    { month: "2024-12", access: 800 },
];

// Sample Weekly Data
const sampleDataWeekly = [
    { startDate: "2024-01-01", endDate: "2024-01-07", access: 100 },
    { startDate: "2024-01-08", endDate: "2024-01-14", access: 200 },
    { startDate: "2024-01-15", endDate: "2024-01-21", access: 400 },
    { startDate: "2024-02-01", endDate: "2024-02-07", access: 250 },
    { startDate: "2024-02-08", endDate: "2024-02-14", access: 180 },
    { startDate: "2024-03-01", endDate: "2024-03-07", access: 250 },
    { startDate: "2024-03-08", endDate: "2024-03-14", access: 350 },
    { startDate: "2024-03-15", endDate: "2024-03-21", access: 400 },
    { startDate: "2024-04-01", endDate: "2024-04-07", access: 150 },
    { startDate: "2024-04-08", endDate: "2024-04-14", access: 200 },
    { startDate: "2024-05-01", endDate: "2024-05-07", access: 450 },
    { startDate: "2024-05-08", endDate: "2024-05-14", access: 300 },
];


// Function to filter weekly data based on selected date range
const filterWeeklyData = (data, startDate, endDate) => {
    return data.filter(({ startDate: s, endDate: e }) => {
        const start = new Date(s);
        const end = new Date(e);
        return (!startDate || start >= startDate) && (!endDate || end <= endDate);
    });
};

function Dashboard() {
    const [applications, setApplications] = useState([]); // Chỉ lưu 7 request mới nhất
    const [totals, setTotals] = useState({
        hotels: 0,
        users: 0,
        requests: 0,
    });

    const [viewType, setViewType] = useState("monthly");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const monthlyLabels = sampleDataMonthly.map((d) => d.month);
    const monthlyData = sampleDataMonthly.map((d) => d.access);

    const weeklyFiltered = filterWeeklyData(sampleDataWeekly, startDate, endDate);
    const weeklyLabels = weeklyFiltered.map((d) => `${d.startDate} - ${d.endDate}`);
    const weeklyData = weeklyFiltered.map((d) => d.access);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch totals
            const hotelsResponse = await axios.get("http://localhost:3001/api/hotels/getAll");
            const hotelsData = hotelsResponse;

            const usersResponse = await axios.get("/user/getAll/user");
            const usersData = usersResponse;

            const requestsResponse = await axios.get("/hotels/admin/dashboard/t/request");
            const requestsData = requestsResponse;

            setTotals({
                hotels: hotelsData.total || 0,
                users: usersData.total || 0,
                requests: requestsData.total || 0,
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <div className="dashboard d-flex flex-column px-5 m-5">
            <div className="title mb-4">Dashboard</div>
            <div className="d-flex justify-content-between mb-5">
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Hotels</h3>
                    <h1 className={"mb-3"}>{totals.hotels}</h1>
                </div>
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Users</h3>
                    <h1 className={"mb-3"}>{totals.users}</h1>
                </div>
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Requests</h3>
                    <h1 className={"mb-3"}>{totals.requests}</h1>
                </div>
            </div>
            <div className="w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Web Access Statistics</h2>
                <div className="row">
                    {/* Dropdown to select Monthly or Weekly */}
                    <select
                        className="mb-4 p-2 border rounded col-2 me-5"
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value)}
                    >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>

                    {/* Date Pickers for Weekly Mode */}
                    {viewType === "weekly" && (
                        <div className="mb-4 flex gap-4 col-5 ms-5">
                            <RangePicker style={{ width: "100%" }} onChange={(dates) => {
                                setStartDate(dates[0]);
                                setEndDate(dates[1]);
                            }}>

                            </RangePicker>
                        </div>
                    )}
                    <div>
                        <Line className="mb-5" style={{ width: "90%", margin: "0 auto" }}
                              data={{
                                  labels: viewType === "monthly" ? monthlyLabels : weeklyLabels,
                                  datasets: [
                                      {
                                          label: "Web Access",
                                          data: viewType === "monthly" ? monthlyData : weeklyData,
                                          borderColor: "rgba(255, 99, 132, 1)",
                                          backgroundColor: "rgba(255, 99, 132, 0.2)",
                                          borderWidth: 2,
                                          pointRadius: 4,
                                      },
                                  ],
                              }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
