function TestModal({ test, onClose, onStartTest }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{test.name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Syllabus:</h4>
                        <p className="text-gray-600">{test.syallabus}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Questions: {test.questions}</p>
                            <p className="font-medium">Time: {test.time}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onStartTest}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        Start Test
                    </button>
                </div>
            </div>
        </div>
    );
}

function TestsPage({ onTestSelect }) {
    const [tests, setTests] = React.useState([]);
    const [selectedTest, setSelectedTest] = React.useState(null);

    const fetchTests = async () => {
        try {
            const response = await fetch(`/api/show_tests/`);
            const data = await response.json();

            console.log('API Response:', data);

            const mapped = data.map(q => ({
                id: q.id,
                name: "Standard Test " + q.id,
                syallabus: q.syallabus || null,
                nos_question: q.nos_question || 0, // Integer for number of questions
                time: q.test_time || null,
                test_type: q.test_type || 'Standard', // Valid choice
                created_at: q.created_at || null, // Optional, as auto_now_add=True in model
                taken_at: q.taken_at ? new Date(q.taken_at).toISOString() : null, // ISO format or null
                list_of_questions: q.questions || [], // Array of question objects
            }));

            console.log('Mapped Questions:', mapped);

            setTests(mapped);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    React.useEffect(() => {
        fetchTests();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Select Your Test</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map(test => (
                        <div 
                            key={test.id}
                            onClick={() => setSelectedTest(test)}
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-semibold mb-2">{test.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                                    {test.questions} Questions
                                </span>
                                <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                                    {test.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedTest && (
                <TestModal
                    test={selectedTest}
                    onClose={() => setSelectedTest(null)}
                    onStartTest={() => onTestSelect(selectedTest)}
                />
            )}
        </div>
    );
}

function QuestionBank({ test, setShowTestsPage }) {
    const [selectedOptions, setSelectedOptions] = React.useState({});

    const handleOptionChange = (questionId, option, isChecked) => {
        setSelectedOptions(prev => {
            if (test.list_of_questions.find(q => q.id === questionId).type === 'MCQ') {
                return { ...prev, [questionId]: option };
            } else {
                const selected = prev[questionId] || [];
                return {
                    ...prev,
                    [questionId]: isChecked
                        ? [...selected, option]
                        : selected.filter(opt => opt !== option)
                };
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">JEE Test</h1>
                    <button
                        onClick={() => setShowTestsPage(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Back to Tests
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {test.list_of_questions.map((question) => (
                    <div key={question.id} className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-900 font-medium mb-4">{question.content}</p>
                        <div className="space-y-2">
                            {question.options.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type={question.type === 'MCQ' ? 'radio' : 'checkbox'}
                                        name={`question-${question.id}`}
                                        className="h-4 w-4 text-indigo-600"
                                        checked={
                                            question.type === 'MCQ'
                                                ? selectedOptions[question.id] === option
                                                : selectedOptions[question.id] && selectedOptions[question.id].includes(option)
                                        }
                                        onChange={(e) => handleOptionChange(question.id, option, e.target.checked)}
                                    />
                                    <label className="ml-3 text-sm text-gray-700">{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="text-center pt-6">
                    <button
                        className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 text-lg"
                        onClick={async () => {
                            function getTotalMarksObtained(result) {
                                const subjects = ["Physics", "Chemistry", "Mathematics"];
                                return subjects.reduce((total, subject) => {
                                    const data = result[subject] || { correct: 0, wrong: 0, unattempted: 0 };
                                    return total + (data.correct * 4) + (data.wrong * -1) + (data.unattempted * 0);
                                }, 0);
                            }

                            const evaluateAnswers = async (selectedOptions) => {
                                try {
                                    const results = {};
                                    await Promise.all(
                                        test.list_of_questions.map(async ({ id, subject }) => {
                                            const question_id = id;
                                            const response = await fetch(`/api/question/${question_id}/`);
                                            const questionData = await response.json();
                                            const answer_text = questionData.answer.answer_text;
                                            const selected = selectedOptions[question_id];

                                            if (!results[subject]) {
                                                results[subject] = { correct: 0, wrong: 0, unattempted: 0 };
                                            }

                                            if (!selected) {
                                                results[subject].unattempted++;
                                            } else if (Array.isArray(selected)) {
                                                const isCorrect = selected.sort().join(',') === answer_text.sort().join(',');
                                                isCorrect ? results[subject].correct++ : results[subject].wrong++;
                                            } else {
                                                selected === answer_text ? results[subject].correct++ : results[subject].wrong++;
                                            }
                                        })
                                    );
                                    return results;
                                } catch (error) {
                                    console.error('Error evaluating answers:', error);
                                    return {};
                                }
                            };

                            const results = await evaluateAnswers(selectedOptions);
                            console.log('Results:', results);
                            localStorage.setItem('testResults', JSON.stringify(results));
                            console.log('Results stored in localStorage:', localStorage.getItem('testResults'));

                            const data1 = getTotalMarksObtained(results);
                            const token = localStorage.getItem('token');
                            const studentId = localStorage.getItem('student_id');
                            console.log("Token:", token);
                            console.log("Student ID:", studentId);

                            try {
                                const response = await fetch('http://127.0.0.1:8000/api/mocktests/create/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        student: studentId,
                                        test: test.id,
                                        test_type: 'Standard',
                                        total_marks_obtained: data1,
                                        nos_question: test.nos_question,
                                        test_time: test.time,
                                        taken_at: test.taken_at ? new Date(test.taken_at).toISOString() : null,
                                    }),
                                    credentials: 'include'
                                });
                            
                                const data = await response.json();
                                
                                console.log('Response:', data);

                                localStorage.setItem('mocktest',data.id);
                                localStorage.setItem('student_id',studentId);
                                console.log('Mock Test ID:', data.id);
                            
                                if (response.ok) {
                                    setTimeout(() => {
                                        window.location.href = '/submit/';
                                    }, 15000);
                                } else {
                                    console.error('Error:', data.message || "Test creation failed");
                                }
                            } catch (error) {
                                console.error('Error:', error);
                            }

                            console.log('Results:', results);

                            window.location.href = '/submit/';

                        }}
                    >
                        Submit Test
                    </button>
                </div>
            </div>
        </div>
    );
}


// function showToast(message, type) {
//     const backgroundColor = type === 'success' ? '#22c55e' : '#ef4444';
//     Toastify({
//         text: message,
//         duration: 3000,
//         gravity: "top",
//         position: "right",
//         style: {
//             background: backgroundColor,
//         }
//     }).showToast();
// }

function App() {
    const [currentTest, setCurrentTest] = React.useState(null);
    const [showTestsPage, setShowTestsPage] = React.useState(true);

    return (
        <React.StrictMode>
            {showTestsPage ? (
                <TestsPage onTestSelect={(test) => {
                    setCurrentTest(test);
                    setShowTestsPage(false);
                }} />
            ) : (
                <QuestionBank test={currentTest} setShowTestsPage={setShowTestsPage} />
            )}
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
