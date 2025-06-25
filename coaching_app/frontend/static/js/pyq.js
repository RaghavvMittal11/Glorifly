function PYQBank() {
    const [filters, setFilters] = React.useState({
        year_num: '',
        level: '',
        subject: '',
    });
    
    const [pyqs, setPyqs] = React.useState([]);
    const [expandedQuestion, setExpandedQuestion] = React.useState(null);

    const fetchQuestions = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.subject) params.append('subject_id', filters.subject); // Use subject_id from actual ID if needed
            if (filters.level) params.append('level_mode', filters.level);
            if (filters.year_num) params.append('year_num', filters.year_num);

            const response = await fetch(`/api/pyq_questions/?${params.toString()}`);
            const data = await response.json();

            console.log('API Response:', data);

            const mapped = data.map(q => ({
                id: q.id,
                subject: q.subject || 'Unknown',  // or use lookup table
                level: q.level === 'JEE Mains' ? 'JEE Mains' : 'JEE Advanced', // Adjust as needed
                year_num: q.year_num,
                content: q.content,
                options: q.options || [],  // Assuming answer.options is a list
                isBookmarked: false
            }));

            console.log('Mapped Questions:', mapped);

            setPyqs(mapped);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    React.useEffect(() => {
        fetchQuestions();
    }, [filters]);



    const filter_change_handler = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const toggleBookmark = (questionId) => {
        setPyqs(prev =>
            prev.map(q =>
                q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
            )
        );
    };

    const toggleExpand = (questionId) => {
        setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-900">JEE Previous Year Questions</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={filters.year_num}
                            onChange={(e) => filter_change_handler('year_num', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Select Year</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                        </select>

                        <select
                            value={filters.level}
                            onChange={(e) => filter_change_handler('level', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Select Exam Type</option>
                            <option value="JEE Mains">JEE Mains</option>
                            <option value="JEE Advanced">JEE Advanced</option>
                        </select>

                        <select
                            value={filters.subject}
                            onChange={(e) => filter_change_handler('subject', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Select Subject</option>
                            <option value="2">Physics</option>
                            <option value="3">Chemistry</option>
                            <option value="1">Mathematics</option>
                        </select>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {pyqs.map((question) => (
                        <div key={question.id} className="pyq-card bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className={`tag tag-${question.level.toLowerCase().replace(' ', '-')}`}>
                                            {question.level}
                                        </span>
                                        <span className={`tag tag-${question.subject.toLowerCase()}`}>
                                            {question.subject}
                                        </span>
                                        <span className="tag tag-year">
                                            {question.year_num}
                                        </span>
                                    </div>
                                    <div className="question-content">
                                        <p className="text-gray-900 mb-4">{question.content}</p>
                                        <div className="space-y-2">
                                            {question.options.map((option, index) => (
                                                <div key={index} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <label className="ml-3 text-sm text-gray-700">{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* {expandedQuestion === question.id && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                            <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                                            <p className="text-gray-700">{question.solution}</p>
                                        </div> */
                                    /* )} */}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={() => toggleBookmark(question.id)}
                                        className={`bookmark-btn p-2 ${question.isBookmarked ? 'active' : ''}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={question.isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                        </svg>
                                    </button>
                                    {/* <button
                                        onClick={() => toggleExpand(question.id)}
                                        className="solution-btn p-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 16v-4"/>
                                            <path d="M12 8h.01"/>
                                        </svg>
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <PYQBank />
    </React.StrictMode>
);