function GoalsModal({ onClose, onSave }) {
    const [examType, setExamType] = React.useState('');
    const [rankGoal, setRankGoal] = React.useState('');

    const handleSave = () => {
        if (examType && rankGoal) {
            onSave({ examType, rankGoal: parseInt(rankGoal) });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Set Your JEE Goal</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select Exam</option>
                            <option value="JEE Main">JEE Main</option>
                            <option value="JEE Advanced">JEE Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Rank</label>
                        <input
                            type="number"
                            value={rankGoal}
                            onChange={(e) => setRankGoal(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter your target rank"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Save Goal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HomePage() {
    const [showGoalsModal, setShowGoalsModal] = React.useState(false);
    const [savedGoals, setSavedGoals] = React.useState(() => {
        const saved = localStorage.getItem('jeeGoals');
        return saved ? JSON.parse(saved) : null;
    });

    const handleSaveGoal = async (goalData) => {
        try {
            const token = localStorage.getItem('token'); // yeh line add kar!
            const studentId = localStorage.getItem('student_id');
    
            if (!studentId || !token) {
                alert("Login expired or invalid. Please login again.");
                return;
            }
    
            localStorage.setItem('jeeGoals', JSON.stringify(goalData));
            setSavedGoals(goalData);
    
            const response = await fetch('/api/GoalsCreateView/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student: studentId,
                    exam: goalData.examType,
                    rank_aim: goalData.rankGoal
                }),
            });
    
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
    
    

    // const handleSaveGoal = (goals) => {
    //     localStorage.setItem('jeeGoals', JSON.stringify(goals));
    //     setSavedGoals(goals);
    // };


    const paths = {
        books: "/book/",
        pyq: "/pyq/",
        questions: "/",
        syllabus: "/syllabus/",
        goals: "/goals/",
        performance: "/perfomance/",
        tests: "/tests/"
    };

    const features = [
        {
            title: "Previous Year Questions",
            description: "Practice with carefully curated JEE Main & Advanced questions from past years",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
            ),
            link: paths.pyq
        },
        {
            title: "Recommended Books",
            description: "Expert-curated books and study materials for comprehensive JEE preparation",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
            ),
            link: paths.books
        },
        {
            title: "Question Bank",
            description: "Extensive collection of topic-wise questions for targeted practice",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
            ),
            link: paths.questions
        },
        {
            title: "JEE Syllabus",
            description: "Complete syllabus breakdown with topic-wise weightage and preparation strategy",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
            ),
            link: paths.syllabus
        }
    ];

    const subjects = [
        {
            name: "Physics",
            topics: ["Mechanics", "Electromagnetism", "Modern Physics"],
            color: "bg-blue-500"
        },
        {
            name: "Chemistry",
            topics: ["Physical", "Organic", "Inorganic"],
            color: "bg-pink-500"
        },
        {
            name: "Mathematics",
            topics: ["Calculus", "Algebra", "Coordinate Geometry"],
            color: "bg-green-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                            <span className="ml-2 text-2xl font-bold text-gray-900">Glorifly</span>
                        </div>
                        <div className="flex space-x-4">
                            <a href={paths.books} className="nav-link">Books</a>
                            <a href={paths.pyq} className="nav-link">PYQ</a>
                            <a href={paths.questions} className="nav-link">Question Bank</a>
                            <a href={paths.syllabus} className="nav-link">Syllabus</a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="hero-section relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Master JEE with</span>
                            <span className="block text-indigo-600">Glorifly</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Your comprehensive platform for JEE preparation. Practice questions, access study materials, and track your progress - all in one place.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            <div className="rounded-md shadow">
                                <a href={paths.tests} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                    Start Practice
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900">Track Your JEE Journey</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
                            Set goals, analyze performance, and strategize your preparation for success
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
                        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center w-full md:w-1/2 lg:w-1/3">
                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Goals</h3>
                            <p className="text-gray-600 text-center mb-6">Define your JEE targets and create personalized study plans</p>
                            <button 
                                onClick={() => setShowGoalsModal(true)}
                                className="mt-auto py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"     
                            >
                                Set Your Goals
                            </button>
                            {savedGoals && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        Current Goal: {savedGoals.examType} - Rank {savedGoals.rankGoal}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center w-full md:w-1/2 lg:w-1/3">
                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Analysis</h3>
                            <p className="text-gray-600 text-center mb-6">Visualize your progress and identify improvement areas</p>
                            <a href={paths.performance} className="mt-auto py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150">
                                View Analysis
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Everything you need to crack JEE</h2>
                    </div>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-card hover:shadow-lg transition-shadow duration-300 p-6 rounded-lg bg-white shadow">
                                    <a href={feature.link} className="block h-full">
                                        <div className="feature-icon text-indigo-600">{feature.icon}</div>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                                        <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Subject-wise Tests</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject, index) => (
                            <div key={index} className="subject-card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                                <div className={`subject-icon ${subject.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                                    <span className="text-xl font-bold text-white">{subject.name.charAt(0)}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mt-4">{subject.name}</h3>
                                <ul className="mt-2 space-y-1">
                                    {subject.topics.map((topic, topicIndex) => (
                                        <li key={topicIndex} className="text-gray-500">{topic}</li>
                                    ))}
                                </ul>
                                <a href={paths.tests} className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                                    Practice Now
                                    <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showGoalsModal && (
                <GoalsModal 
                    onClose={() => setShowGoalsModal(false)}
                    onSave={handleSaveGoal}
                />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HomePage />
    </React.StrictMode>
);