function Books() {
    const [filters, setFilters] = React.useState({
        subject: '',
        book_name: '',
        type: ''
    });
    
    const [pyqs, setPyqs] = React.useState([]);
    const [show_test_dropdown, set_show_test_dropdown] = React.useState(false);
    // const [expandedQuestion, setExpandedQuestion] = React.useState(null);

    const fetchQuestions = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.subject) params.append('subject_id', filters.subject); // Use subject_id from actual ID if needed
            if (filters.book_name) params.append('book_name', filters.book_name);
            if (filters.type) params.append('type', filters.type);

            const response = await fetch(`/api/book_questions/?${params.toString()}`);
            const data = await response.json();

            console.log('API Response:', data);

            const mapped = data.map(q => ({
                id: q.id,
                subject: q.subject || 'Unknown',  // or use lookup table
                book_name: q.book_name || 'Unknown',  // or use lookup table
                type: q.type === 'MCQ' ? 'MCQ' : 'Multiple Choice MCQ', // Adjust as needed
                content: q.content,
                options: q.options || [],  // Assuming answer.options is a list
                isMarked: false
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
                q.id === questionId ? { ...q, Marked: !q.Marked } : q
            )
        );
    };

    // const toggleExpand = (questionId) => {
    //     setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
    // };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header and filters remain unchanged... */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-900">JEE Books</h1>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => set_show_test_dropdown(!show_test_dropdown)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Test
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        {show_test_dropdown && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Customize Test
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Standard Test
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>


            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <select
                    value={filters.book_name}
                    onChange={(e) => filter_change_handler('book_name', e.target.value)}
                    className="filter-select"
                >
                    <option value="">Select Book</option>
                    <option value="Maths Vol I">Maths Vol I</option>
                    <option value="Concepts of Physics">Concepts of Physics</option>
                </select>

                <select
                    value={filters.type}
                    onChange={(e) => filter_change_handler('type', e.target.value)}
                    className="filter-select"
                >
                    <option value="">Select Question Type</option>
                    <option value="MCQ">Single Choice MCQ</option>
                    <option value="Multiple Choice MCQ">Multiple Choice MCQ</option>
                </select>
            </div>

            {/* Questions List (same as your original JSX) */}
            <div className="space-y-4">
                    {pyqs.map((question) => (
                        <div key={question.id} className="question-card bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className={`tag tag-${question.subject.toLowerCase()}`}>
                                            {question.subject}
                                        </span>
                                        <span className="tag bg-purple-100 text-purple-800">
                                            {question.book_name}
                                        </span>
                                        <span className="tag bg-green-100 text-green-800">
                                            {question.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 mb-4">{question.content}</p>
                                    <div className="space-y-2">
                                        {question.options.map((option, index) => (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    type={question.type === 'MCQ' ? 'radio' : 'checkbox'}
                                                    name={`question-${question.id}`}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <label className="ml-3 text-sm text-gray-700">{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleBookmark(question.id)}
                                    className={`bookmark-btn ml-4 p-2 ${question.isMarked ? 'active' : ''}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={question.isMarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    );
}
// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Books />
    </React.StrictMode>
);