// Performance Chart Data
const performanceData = {
    labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],
    datasets: [
        {
            label: 'Your Score',
            data: [85, 78, 92, 88, 95],
            backgroundColor: '#6366f1',
            borderColor: '#6366f1',
            borderWidth: 1
        },
        {
            label: 'Average Score',
            data: [75, 72, 78, 76, 80],
            backgroundColor: '#f59e0b',
            borderColor: '#f59e0b',
            borderWidth: 1
        }
    ]
};

const ctx = document.getElementById('performanceChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: performanceData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Test Performance Comparison',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Score'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tests'
                }
            }
        },
        barPercentage: 0.8,
        categoryPercentage: 0.7
    }
});