const handleSaveGoal = async (goalData) => {
    try {
    console.log("Saving goal data:", goalData);
    console.log("")

        // const token = localStorage.getItem('token');
        const studentId = localStorage.getItem('student_id');

        // console.log("Token:", token);
        // console.log("Student ID:", studentId);

        if (!studentId) {
            alert("Token or Student ID is missing. Please login again.");
            return;
        }
        // console.log("React App Mounted");


        const response = await fetch('http://127.0.0.1:8000/api/GoalsCreateView/', {
            

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // optional if your view doesn't require authentication
            },
            body: JSON.stringify({
                student: studentId,
                exam: goalData.examType,
                rank_aim: goalData.rankGoal
            }),
        });

        console.log("duhailshiludhliuashiludhluash")
        const data = await response.json();
        console.log("Goal API Response:", data);

        if (response.ok) {
            alert("Goal saved successfully!");
        } else {
            alert("Failed to save goal.");
        }
    } catch (error) {
        console.error("Error saving goal:", error);
        alert("An error occurred while saving the goal.");
    }
};
