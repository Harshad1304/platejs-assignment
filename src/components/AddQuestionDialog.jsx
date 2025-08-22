import { nanoid } from 'nanoid';
import React, { useState, useEffect, useRef } from 'react';

// Simple form state management without external dependencies
function AddQuestionDialog({ open, onClose, onSubmit, initialValues }) { 
  const id = nanoid()
  const [formData, setFormData] = useState({
    id: '',
    question: '',
    options: [
      { id: 'opt1', text: '' },
      { id: 'opt2', text: '' }
    ],
    correctOptionId: '',
    explanation: ''
  });
  
  const [errors, setErrors] = useState({});
  const questionRef = useRef(null);

  // Generate unique ID
  const generateId = () => 'opt_' + Math.random().toString(36).substr(2, 9);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialValues) {
        setFormData(initialValues);
      } else {
        setFormData({
          id: id,
          question: '',
          options: [
            { id: generateId(), text: '' },
            { id: generateId(), text: '' }
          ],
          correctOptionId: '',
          explanation: ''
        });
      }
      setErrors({});
      
      // Focus on question field
      setTimeout(() => {
        if (questionRef.current) {
          questionRef.current.focus();
        }
      }, 100);
    }
  }, [open, initialValues]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters';
    } else if (formData.question.length > 300) {
      newErrors.question = 'Question must be 300 characters or less';
    }

    if (formData.options.length < 2) {
      newErrors.options = 'At least 2 options are required';
    } else if (formData.options.length > 6) {
      newErrors.options = 'Maximum 6 options allowed';
    }

    // Check if all options have text
    const optionErrors = {};
    formData.options.forEach((option, index) => {
      if (!option.text.trim()) {
        optionErrors[index] = 'Option text is required';
      } else if (option.text.length > 120) {
        optionErrors[index] = 'Option text must be 120 characters or less';
      }
    });

    if (Object.keys(optionErrors).length > 0) {
      newErrors.optionErrors = optionErrors;
    }

    // Check for duplicate options
    const optionTexts = formData.options.map(opt => opt.text.toLowerCase().trim()).filter(text => text);
    const uniqueTexts = new Set(optionTexts);
    if (optionTexts.length !== uniqueTexts.size) {
      newErrors.options = 'All options must be unique';
    }

    if (!formData.correctOptionId) {
      newErrors.correctOptionId = 'Please select the correct answer';
    }

    if (formData.explanation && formData.explanation.length > 500) {
      newErrors.explanation = 'Explanation must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    
    if (validateForm()) {
      console.log('Form data being submitted:', formData);
      onSubmit(formData);
      onClose();
    }
  };

  // Handle input changes
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle option text change
  const updateOptionText = (index, text) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text };
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (optionId) => {
    console.log('Selected correct answer:', optionId);
    setFormData(prev => ({ ...prev, correctOptionId: optionId }));
  };

  // Add new option
  const addOption = () => {
    if (formData.options.length < 6) {
      const newOptions = [...formData.options, { id: generateId(), text: '' }];
      setFormData(prev => ({ ...prev, options: newOptions }));
    }
  };

  // Remove option
  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      const removedOptionId = formData.options[index].id;
      
      // Clear correct answer if the removed option was selected
      const newCorrectOptionId = formData.correctOptionId === removedOptionId ? '' : formData.correctOptionId;
      
      setFormData(prev => ({ 
        ...prev, 
        options: newOptions,
        correctOptionId: newCorrectOptionId
      }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 "
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialValues ? 'Edit Question' : 'Add Question'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Question Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                ref={questionRef}
                value={formData.question}
                onChange={(e) => updateFormData('question', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your question..."
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600">{errors.question}</p>
              )}
            </div>

            {/* Options */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-4">
                  Answer Options * (Select the correct answer)
                </legend>
                
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      {/* Radio Button */}
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`correct-${option.id}`}
                          name="correctAnswer"
                          value={option.id}
                          checked={formData.correctOptionId === option.id}
                          onChange={() => handleCorrectAnswerChange(option.id)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                        />
                        <label 
                          htmlFor={`correct-${option.id}`}
                          className="ml-2 text-sm text-gray-600 cursor-pointer"
                        >
                          Correct
                        </label>
                      </div>

                      {/* Option Text Input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOptionText(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.optionErrors?.[index] && (
                          <p className="mt-1 text-sm text-red-600">{errors.optionErrors[index]}</p>
                        )}
                      </div>

                      {/* Remove Button */}
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Errors */}
                {errors.options && (
                  <p className="mt-2 text-sm text-red-600">{errors.options}</p>
                )}
                {errors.correctOptionId && (
                  <p className="mt-2 text-sm text-red-600">{errors.correctOptionId}</p>
                )}

                {/* Add Option Button */}
                {formData.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Option
                  </button>
                )}
              </fieldset>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => updateFormData('explanation', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide an explanation for the correct answer..."
              />
              {errors.explanation && (
                <p className="mt-1 text-sm text-red-600">{errors.explanation}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionDialog;