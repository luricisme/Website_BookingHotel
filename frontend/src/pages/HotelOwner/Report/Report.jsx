import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { DatePicker } from "rsuite";
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

const Report = () => {
    const [viewType, setViewType] = useState("monthly");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);

    // Fetch data for monthly report
    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/booking/report/monthly/471');
                const result = await response.json();
                if (result.statusCode === 200) {
                    setMonthlyData(result.data);
                } else {
                    console.error("Error fetching monthly data");
                }
            } catch (error) {
                console.error("Error fetching monthly data:", error);
            }
        };

        fetchMonthlyData();
    }, []);

    // Sample weekly data - replace with actual API call as needed
    const sampleDataWeekly = [
        { startDate: "2024-01-01", endDate: "2024-01-07", revenue: 100 },
        { startDate: "2024-01-08", endDate: "2024-01-14", revenue: 200 },
        // Add other weekly data as needed...
    ];

    // Function to filter weekly data based on selected date range
    const filterWeeklyData = (data, startDate, endDate) => {
        return data.filter(({ startDate: s, endDate: e }) => {
            const start = new Date(s);
            const end = new Date(e);
            return (!startDate || start >= startDate) && (!endDate || end <= endDate);
        });
    };

    // Calculate total revenue for monthly data
    const monthlyLabels = monthlyData.map((d) => d.month);
    const monthlyRevenue = monthlyData.map((d) => parseInt(d.revenue, 10));

    // Calculate average revenue for monthly data
    const averageMonthlyRevenue = monthlyData.map((d) => {
        const [year, month] = d.month.split("-");
        const daysInMonth = new Date(year, month, 0).getDate(); // Number of days in the month
        const totalRevenue = parseInt(d.revenue, 10);
        return totalRevenue / daysInMonth;
    });

    const weeklyFiltered = filterWeeklyData(sampleDataWeekly, startDate, endDate);
    const weeklyLabels = weeklyFiltered.map((d) => `${d.startDate} - ${d.endDate}`);
    const weeklyRevenue = weeklyFiltered.map((d) => d.revenue);

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
                        <RangePicker
                            style={{ width: "100%" }}
                            onChange={(dates) => {
                                setStartDate(dates[0]);
                                setEndDate(dates[1]);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Bar Chart: Total Revenue */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Total Revenue ({viewType})</h2>
                <Bar
                    className="mb-5"
                    style={{ width: "90%", margin: "0 auto" }}
                    data={{
                        labels: viewType === "monthly" ? monthlyLabels : weeklyLabels,
                        datasets: [
                            {
                                label: "Total Revenue",
                                data: viewType === "monthly" ? monthlyRevenue : weeklyRevenue,
                                backgroundColor: "rgba(54, 162, 235, 0.5)",
                                borderColor: "rgba(54, 162, 235, 1)",
                                borderWidth: 1,
                            },
                        ],
                    }}
                />
            </div>

            {/* Line Chart: Average Revenue */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Average Revenue ({viewType})</h2>
                <Line
                    className="mb-5"
                    style={{ width: "90%", margin: "0 auto" }}
                    data={{
                        labels: viewType === "monthly" ? monthlyLabels : weeklyLabels,
                        datasets: [
                            {
                                label: "Average Revenue",
                                data: viewType === "monthly" ? averageMonthlyRevenue : weeklyRevenue,
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
