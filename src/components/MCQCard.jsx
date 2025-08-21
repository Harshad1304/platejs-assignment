import React, { useState } from "react";

const MCQCard = ({data, onEdit}) => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

 

  const handleSelect = (id) => {
    if (!showResult) {
      setSelectedOption(id);
      setHasAnswered(true);
    }
  };

  const handleSubmit = () => {
    if (selectedOption) setShowResult(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
    setHasAnswered(false);
  };

  const isCorrect = selectedOption === data.correctOptionId;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
            <button className="text-blue-500 hover:text-blue-600 cursor-pointer p-2" onClick={()=>onEdit(data)}>Edit</button>
        </div>
        {showResult && (
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800">{data.question}</h2>

      <div className="space-y-3 mb-6">
        {data.options.map((option) => {
          const isOptionCorrect = option.id === data.correctOptionId;
          const isSelected = option.id === selectedOption;
          let borderClass = "border-gray-200 hover:border-blue-300 bg-gray-50";
          let textClass = "text-gray-700";

          if (showResult) {
            if (isOptionCorrect) {
              borderClass = "border-green-500 bg-green-50";
              textClass = "text-green-700";
            } else if (isSelected && !isOptionCorrect) {
              borderClass = "border-red-500 bg-red-50";
              textClass = "text-red-700";
            }
          } else if (isSelected) {
            borderClass = "border-blue-500 bg-blue-50";
            textClass = "text-blue-700";
          }

          return (
            <div
              key={option.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${borderClass} ${!showResult && 'hover:shadow-md'}`}
              onClick={() => handleSelect(option.id)}
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="mcq-options"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleSelect(option.id)}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  disabled={showResult}
                />
                <span className={textClass}>{option.text}</span>
                {showResult && isOptionCorrect && (
                  <span className="ml-auto text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {showResult && isSelected && !isOptionCorrect && (
                  <span className="ml-auto text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || showResult}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Submit Answer
        </button>
        
        {showResult && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      {showResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            <strong className="text-gray-800">Explanation:</strong>
          </div>
          <p className="text-gray-700">{data.explanation}</p>
          
         
        </div>
      )}
    </div>
  );
};

export default MCQCard;