import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Define types for the skill statistics
interface SkillStat {
    id: string;
    requirementName: string;
    userCount: number;
    averageScore: number;
    maxScore: number;
    minScore: number;
}

const StatsChart: React.FC = () => {
    // State to store the fetched data
    const [data, setData] = useState<SkillStat[]>([]);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://34.121.92.80:8080/admin/dashboard/skills');
                const result = await response.json();
                setData(result);  // Update state with the fetched data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on component mount

    // Prepare chart data
    const chartData = {
        labels: data.map(stat => stat.requirementName), // X-axis labels (skill names)
        datasets: [
            {
                label: 'User Count',
                data: data.map(stat => stat.userCount),
                backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue for user count
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                barThickness: 10,
            },
            {
                label: 'Average Score',
                data: data.map(stat => stat.averageScore),
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Green for average score
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barThickness: 10,
            },
            {
                label: 'Max Score',
                data: data.map(stat => stat.maxScore),
                backgroundColor: 'rgba(255, 159, 64, 0.5)', // Orange for max score
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                barThickness: 10,
            },
            {
                label: 'Min Score',
                data: data.map(stat => stat.minScore),
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Red for min score
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                barThickness: 10,
            }
        ]
    };

    // Chart options for styling
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const, // Validating position as one of the expected values
            },
            title: {
                display: true,
                text: 'Skill Statistics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '80%', height: '600px' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default StatsChart;
