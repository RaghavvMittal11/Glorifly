// Marks for correct answers = 4
// Marks for wrong answers = -1
// Marks for unattempted questions = 0

const result = {};
const results = JSON.parse(localStorage.getItem('testResults'));

console.log(results);

function getTotalCorrect(result) {
    const subjects = ["Physics", "Chemistry", "Mathematics"]; // Define default subjects
    return subjects.reduce((total, subject) => {
        const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 }; // Use default if subject is not present
        return total + data.correct;
    }, 0);
}

function getTotalWrong(result) {
    const subjects = ["Physics", "Chemistry", "Mathematics"]; // Define default subjects
    return subjects.reduce((total, subject) => {
        const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 }; // Use default if subject is not present
        return total + data.wrong;
    }, 0);
}

function getTotalUnattempted(result) {
    const subjects = ["Physics", "Chemistry", "Mathematics"]; // Define default subjects
    return subjects.reduce((total, subject) => {
        const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 }; // Use default if subject is not present
        return total + data.unattempted;
    }, 0);
}

function getTotalMarksObtained(result) {
    const subjects = ["Physics", "Chemistry", "Mathematics"]; // Define default subjects
    return subjects.reduce((total, subject) => {
        const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 }; // Use default if subject is not present
        return total + (data.correct * 4) + (data.wrong * -1) + (data.unattempted * 0);
    }, 0);
}

function getTotalQuestions(result) {
    return Object.values(result).reduce((total, subject) => {
        return total + subject.correct + subject.wrong + subject.unattempted;
    }, 0);
}

function getTotalMarksperSubject(result) {
    const subjects = ["Physics", "Chemistry", "Mathematics"]; // Define default subjects
    return subjects.map(subject => {
        const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 }; // Use default if subject is not present
        const marks = (data.correct * 4) + (data.wrong * -1) + (data.unattempted * 0);
        return { subject, marks };
    });
}

function getTotalQuestionsperSubject(result) {
    const subjects = ["Physics", "Chemistry", "Mathematics"]; // Define default subjects
    return subjects.map(subject => {
        const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 }; // Use default if subject is not present
        const total = data.correct + data.wrong + data.unattempted; // Calculate total as the sum of correct, wrong, and unattempted
        return { subject, total };
    });
}

function get_rank(result){
    // Based on the percentage of marks obtained, assign a rank
    const totalMarks = getTotalMarksObtained(result);
    const totalQuestions = getTotalQuestions(result);
    const percentage = (totalMarks / (totalQuestions * 4)) * 100; // Assuming each question carries 4 marks
    // rank will be from 1 to 10
    let rank = 0;
    if (percentage >= 90) {
        rank = 1; // Top rank
    } else if (percentage >= 80) {
        rank = 9;
    } else if (percentage >= 70) {
        rank = 30;
    } else if (percentage >= 60) {
        rank = 50;
    } else if (percentage >= 50) {
        rank = 60;
    } else if (percentage >= 40) {
        rank = 70;
    } else if (percentage >= 30) {
        rank = 80;
    } else if (percentage >= 20) {
        rank = 100;
    } else if (percentage >= 10) {
        rank = 130;
    } else {
        rank = 150; // Lowest rank
    }

    return rank;
}

// Make a SWOT analysis of the student based on the marks obtained
// if correct by attempted questions are more than 50% of the total questions, then it is a strength
// if correct by attempted questions are less than 50% of the total questions, then it is a weakness
// if unattempted > wrong then it is an opportunity
// if unattempted < wrong then it is a threat
function getSWOTAnalysisPerSubject(result) {
    const subjects = ["Physics", "Chemistry", "Mathematics"]; // Define default subjects
    return subjects.map(subject => {
        const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 }; // Use default if subject is not present
        const totalQuestions = data.correct + data.wrong + data.unattempted;
        const strength = (data.correct / totalQuestions) > 0.5 ? "Strength" : "Weakness";
        const opportunity = data.unattempted >= data.wrong ? "Opportunity" : "Threat";

        return {subject, strength, opportunity};
    });
}

function mapSubjectsBySWOTCategory(result) {
    // Get the SWOT analysis for each subject
    const swotPerSubject = getSWOTAnalysisPerSubject(result);
    
    // Initialize the map with empty arrays for each category
    const swotMap = {
        Strength: [],
        Weakness: [],
        Opportunity: [],
        Threat: []
    };
    
    // Populate the map by categorizing each subject
    swotPerSubject.forEach(item => {
        // Add subject to the strength or weakness category
        swotMap[item.strength].push(item.subject);
        
        // Add subject to the opportunity or threat category
        swotMap[item.opportunity].push(item.subject);
    });
    
    return swotMap;
}




document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the results from localStorage
    const results = JSON.parse(localStorage.getItem('testResults'));

    // const results = JSON.parse(localStorage.getItem('testResults'));
    const studentId = localStorage.getItem('student_id');
    const testId = localStorage.getItem('mocktest');

    console.log("Student ID:", studentId);
    console.log("Test ID:", testId);
    console.log("Test Results:", results);

    // Check if all required data is available
    if (results && studentId && testId) {
        // Calculate rank and SWOT analysis using existing functions
        const rank = get_rank(results);
        const swot = mapSubjectsBySWOTCategory(results);

        // Prepare data for Ranking API
        const rankingData = {
            student: studentId,
            test: testId,
            rank_position: rank
        };

        // Prepare data for SWOTanalysis API
        // Convert arrays to comma-separated strings
        const swotData = {
            student: studentId,
            test: testId,
            strength: swot.Strength.join(', '),
            weakness: swot.Weakness.join(', '),
            opportunity: swot.Opportunity.join(', '),
            threat: swot.Threat.join(', ')
        };

        // Send POST request to Ranking API
        fetch('/api/ranking/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers if required, e.g., 'Authorization': 'Bearer <token>'
            },
            body: JSON.stringify(rankingData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to save ranking');
            return response.json();
        })
        .then(data => console.log('Ranking saved:', data))
        .catch(error => console.error('Error saving ranking:', error));

        // Send POST request to SWOTanalysis API
        fetch('/api/swotanalysis/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers if required
            },
            body: JSON.stringify(swotData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to save SWOT analysis');
            return response.json();
        })
        .then(data => console.log('SWOTanalysis saved:', data))
        .catch(error => console.error('Error saving SWOTanalysis:', error));
    } else {
        console.error('Missing data in localStorage. Please ensure studentId, testId, and testResults are set.');
    }

    if (results) {
        Object.assign(result, results);  // <- This line assigns the loaded results to the global result object

        // Calculate values using the provided functions
        const totalMarks = getTotalMarksObtained(result);
        console.log(totalMarks);
        const x = getTotalMarksperSubject(result);
        const y = getTotalQuestionsperSubject(result);
        console.log(x);
        console.log(y);

        const physicsMarks = x.find(subjectData => subjectData.subject === "Physics") || { marks: 0, subject: "Physics" };
        const chemistryMarks = x.find(subjectData => subjectData.subject === "Chemistry") || { marks: 0, subject: "Chemistry" };
        const mathematicsMarks = x.find(subjectData => subjectData.subject === "Mathematics") || { marks: 0, subject: "Mathematics" };

        document.getElementById('score').textContent = `Score: ${totalMarks}`;
        document.getElementById('p-score').textContent = `Physics_marks: ${physicsMarks.marks}/${y.find(subjectData => subjectData.subject === "Physics").total*4}`;
        document.getElementById('c-score').textContent = `Chemistry_marks: ${chemistryMarks.marks}/${y.find(subjectData => subjectData.subject === "Chemistry").total*4}`;
        document.getElementById('m-score').textContent = `Mathematics_marks: ${mathematicsMarks.marks}/${y.find(subjectData => subjectData.subject === "Mathematics").total*4}`;
        document.getElementById('rank').textContent = `Rank: ${get_rank(result)}`;
    } else {
        console.error('No results found in localStorage.');
    }

    // Now map and display SWOT
    const analysisResult = mapSubjectsBySWOTCategory(result);
    console.log(analysisResult);
    
    const resultContainer = document.getElementById('result');

for (const category in analysisResult) {
    const div = document.createElement('div');
    div.className = 'category';

    const title = document.createElement('h2');
    title.textContent = category;

    const list = document.createElement('ul');
    list.className = 'subject-list';

    // analysisResult[category].forEach(subject => {
    //     const li = document.createElement('li');
    //     li.textContent = subject;
    //     list.appendChild(li);
    // });

    // div.appendChild(title);
    // div.appendChild(list);
    // resultContainer.appendChild(div);

    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results
    
    const categoryColors = {
        Strength: 'strength',
        Weakness: 'weakness',
        Opportunity: 'opportunity',
        Threat: 'threat'
    };
    
    const swotGrid = document.createElement('div');
    swotGrid.className = 'swot-grid';
    
    Object.keys(analysisResult).forEach(category => {
        const card = document.createElement('div');
        card.className = `swot-card ${categoryColors[category] || ''}`;
    
        const title = document.createElement('h3');
        title.textContent = category;
    
        const list = document.createElement('ul');
        analysisResult[category].forEach(subject => {
            const li = document.createElement('li');
            li.textContent = subject;
            list.appendChild(li);
        });
    
        card.appendChild(title);
        card.appendChild(list);
        swotGrid.appendChild(card);
    });
    
    resultContainer.appendChild(swotGrid);
    

}
    
    });
