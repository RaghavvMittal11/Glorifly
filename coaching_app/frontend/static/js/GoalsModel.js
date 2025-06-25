import React, { useState } from 'react';

function GoalsModal({ onClose, onSave }) {
    const [examType, setExamType] = useState('');
    const [rankGoal, setRankGoal] = useState('');

    const handleSave = () => {
        if (examType && rankGoal) {
            onSave({ examType, rankGoal: parseInt(rankGoal) });
            onClose();
        } else {
            alert("Please select an exam type and enter a target rank.");
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

export default GoalsModal;
