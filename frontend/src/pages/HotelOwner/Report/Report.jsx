import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, message } from "antd";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from "chart.js";
import {DateRangePicker} from "rsuite";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const { RangePicker } = DatePicker;

// Sample Monthly Data
const sampleDataMonthly = [
    { month: "2024-01", revenue: 500 },
    { month: "2024-02", revenue: 1200 },
    { month: "2024-03", revenue: 700 },
    { month: "2024-04", revenue: 400 },
    { month: "2024-05", revenue: 1100 },
    { month: "2024-06", revenue: 1600 },
    { month: "2024-07", revenue: 1700 },
    { month: "2024-08", revenue: 1400 },
    { month: "2024-09", revenue: 900 },
    { month: "2024-10", revenue: 1000 },
    { month: "2024-11", revenue: 900 },
    { month: "2024-12", revenue: 800 },
];

// Sample Weekly Data
const sampleDataWeekly = [
    { startDate: "2024-01-01", endDate: "2024-01-07", revenue: 100 },
    { startDate: "2024-01-08", endDate: "2024-01-14", revenue: 200 },
    { startDate: "2024-01-15", endDate: "2024-01-21", revenue: 400 },
    { startDate: "2024-02-01", endDate: "2024-02-07", revenue: 250 },
    { startDate: "2024-02-08", endDate: "2024-02-14", revenue: 180 },
    { startDate: "2024-03-01", endDate: "2024-03-07", revenue: 250 },
    { startDate: "2024-03-08", endDate: "2024-03-14", revenue: 350 },
    { startDate: "2024-03-15", endDate: "2024-03-21", revenue: 400 },
    { startDate: "2024-04-01", endDate: "2024-04-07", revenue: 150 },
    { startDate: "2024-04-08", endDate: "2024-04-14", revenue: 200 },
    { startDate: "2024-05-01", endDate: "2024-05-07", revenue: 450 },
    { startDate: "2024-05-08", endDate: "2024-05-14", revenue: 300 },
];

// Function to filter weekly data based on selected date range
const filterWeeklyData = (data, startDate, endDate) => {
    return data.filter(({ startDate: s, endDate: e }) => {
        const start = new Date(s);
        const end = new Date(e);
        return (!startDate || start >= startDate) && (!endDate || end <= endDate);
    });
};

const Report = () => {
    const [viewType, setViewType] = useState("monthly");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const monthlyLabels = sampleDataMonthly.map((d) => d.month);
    const monthlyData = sampleDataMonthly.map((d) => d.revenue);

    const weeklyFiltered = filterWeeklyData(sampleDataWeekly, startDate, endDate);
    const weeklyLabels = weeklyFiltered.map((d) => `${d.startDate} - ${d.endDate}`);
    const weeklyData = weeklyFiltered.map((d) => d.revenue);

    return (
        <div className="px-5">
            <h1 className="text-2xl font-bold mb-4">Report</h1>

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

            </div>

            {/* Bar Chart: Total Revenue */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Total Revenue ({viewType})</h2>
                <Bar className="mb-5" style={{ width: "90%", margin: "0 auto" }}
                    data={{
                        labels: viewType === "monthly" ? monthlyLabels : weeklyLabels,
                        datasets: [
                            {
                                label: "Total Revenue",
                                data: viewType === "monthly" ? monthlyData : weeklyData,
                                backgroundColor: "rgba(54, 162, 235, 0.5)",
                                borderColor: "rgba(54, 162, 235, 1)",
                                borderWidth: 1,
                            },
                        ],
                    }}
                />
            </div>

            {/* Line Chart: Average Revenue (Same as Bar Chart since we don't have count data) */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Average Revenue ({viewType})</h2>
                <Line className="mb-5" style={{ width: "90%", margin: "0 auto" }}
                    data={{
                        labels: viewType === "monthly" ? monthlyLabels : weeklyLabels,
                        datasets: [
                            {
                                label: "Average Revenue",
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
    );
};

export default Report;
