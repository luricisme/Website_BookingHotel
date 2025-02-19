import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { subDays, format, parseISO } from "date-fns";
import dayjs from "dayjs";
import { DatePicker, Select } from "antd";
import axios from "~/utils/axiosCustomize";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;
const { Option } = Select;

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [totals, setTotals] = useState({
        hotels: 0,
        users: 0,
        requests: 0,
    });

    // Visit statistics state
    const [visitStats, setVisitStats] = useState([]);
    const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'daily'
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Using JavaScript Date objects internally
    const [dateRange, setDateRange] = useState([
        subDays(new Date(), 10), // 10 days ago
        new Date() // today
    ]);

    // For Ant Design DatePicker compatibility
    const [dateRangeDayjs, setDateRangeDayjs] = useState([
        dayjs().subtract(10, 'day'),
        dayjs()
    ]);

    // Chart data state
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Visits',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1
            }
        ]
    });

    useEffect(() => {
        fetchDashboardData();

        // Fetch initial visit stats based on default view mode
        if (viewMode === 'monthly') {
            fetchMonthlyVisits(selectedYear);
        } else {
            fetchDailyVisits(dateRange[0], dateRange[1]);
        }
    }, []);

    // Effect to update chart when view mode changes
    useEffect(() => {
        if (viewMode === 'monthly') {
            fetchMonthlyVisits(selectedYear);
        } else {
            fetchDailyVisits(dateRange[0], dateRange[1]);
        }
    }, [viewMode, selectedYear, dateRange]);

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

    const fetchMonthlyVisits = async (year) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/visit/monthly-stats?year=${year}`);
            if (response && Array.isArray(response)) {
                setVisitStats(response);

                // Format data for chart
                const labels = response.map(item => {
                    const [year, month] = item.month.split('-');
                    return `${month}/${year}`;
                });

                const visitCounts = response.map(item => parseInt(item.total_visits));

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Monthly Visits',
                            data: visitCounts,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            tension: 0.1
                        }
                    ]
                });
            }
        } catch (error) {
            console.error("Error fetching monthly visit stats:", error);
        }
    };

    const fetchDailyVisits = async (startDate, endDate) => {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');

            const response = await axios.get(
                `http://localhost:3001/api/visit/daily-stats?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
            );

            if (response && Array.isArray(response)) {
                setVisitStats(response);

                // Format data for chart
                const labels = response.map(item => format(parseISO(item.date), 'dd/MM/yyyy'));
                const visitCounts = response.map(item => item.visit_count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Daily Visits',
                            data: visitCounts,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            tension: 0.1
                        }
                    ]
                });
            }
        } catch (error) {
            console.error("Error fetching daily visit stats:", error);
        }
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            // Update Dayjs objects for DatePicker
            setDateRangeDayjs(dates);

            // Convert to JavaScript Date objects for internal use
            setDateRange([
                dates[0].toDate(),
                dates[1].toDate()
            ]);
        }
    };

    // Generate year options
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = 2020; year <= currentYear; year++) {
        yearOptions.push(year);
    }

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: viewMode === 'monthly' ? 'Monthly Website Visits' : 'Daily Website Visits',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Visits'
                }
            }
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

            {/* Visit Statistics Section */}
            <div className="visit-stats mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Website Visit Statistics</h2>
                    <div className="chart-controls d-flex gap-3">
                        <Select
                            value={viewMode}
                            onChange={handleViewModeChange}
                            style={{ width: 120 }}
                        >
                            <Option value="monthly">By Month</Option>
                            <Option value="daily">By Day</Option>
                        </Select>

                        {viewMode === 'monthly' ? (
                            <Select
                                value={selectedYear}
                                onChange={handleYearChange}
                                style={{ width: 100 }}
                            >
                                {yearOptions.map(year => (
                                    <Option key={year} value={year}>{year}</Option>
                                ))}
                            </Select>
                        ) : (
                            <RangePicker
                                value={dateRangeDayjs}
                                onChange={handleDateRangeChange}
                            />
                        )}
                    </div>
                </div>

                <div className="chart-container mx-auto py-4 bg-white rounded shadow" style={{ width: "90%"}}>
                    <Line options={chartOptions} data={chartData} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;