import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormFiller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);
        const data = await response.json();
        setForm(data);
        
        // Initialize responses
        const initialResponses = {};
        data.questions.forEach((question, index) => {
          if (question.type === 'categorize') {
            initialResponses[index] = {};
            question.categories.forEach((category, catIndex) => {
              initialResponses[index][category.name] = [];
            });
          } else if (question.type === 'cloze') {
            initialResponses[index] = {};
            question.blanks.forEach((blank, blankIndex) => {
              initialResponses[index][blankIndex] = '';
            });
          } else if (question.type === 'comprehension') {
            initialResponses[index] = {};
            question.comprehensionQuestions.forEach((q, qIndex) => {
              initialResponses[index][qIndex] = '';
            });
          }
        });
        setResponses(initialResponses);
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleCategorizeChange = (questionIndex, categoryName, item) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      
      // Remove item from all categories
      Object.keys(newResponses[questionIndex]).forEach(cat => {
        newResponses[questionIndex][cat] = newResponses[questionIndex][cat].filter(i => i !== item);
      });
      
      // Add item to selected category
      if (!newResponses[questionIndex][categoryName].includes(item)) {
        newResponses[questionIndex][categoryName] = [...newResponses[questionIndex][categoryName], item];
      }
      
      return newResponses;
    });
  };

  const handleClozeChange = (questionIndex, blankIndex, value) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      newResponses[questionIndex][blankIndex] = value;
      return newResponses;
    });
  };

  const handleComprehensionChange = (questionIndex, qIndex, value) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      newResponses[questionIndex][qIndex] = value;
      return newResponses;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Format responses for API
      const formattedResponses = Object.keys(responses).map(questionIndex => {
        const question = form.questions[questionIndex];
        let answer;
        
        if (question.type === 'categorize') {
          answer = responses[questionIndex];
        } else if (question.type === 'cloze') {
          answer = Object.values(responses[questionIndex]);
        } else if (question.type === 'comprehension') {
          answer = Object.values(responses[questionIndex]);
        }
        
        return {
          questionId: question._id,
          answer
        };
      });
      
      const response = await fetch(`/api/responses/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ responses: formattedResponses })
      });
      
      if (response.ok) {
        alert('Form submitted successfully!');
        navigate('/');
      } else {
        console.error('Error submitting form');
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-6">The form you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary w-full"
          >
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fill Form</h1>
              <p className="mt-1 text-gray-500">Complete the form below</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Back to Forms
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Form Header */}
            {form.headerImage && (
              <div className="h-64 overflow-hidden">
                <img src={form.headerImage} alt="Header" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{form.title}</h2>
                {form.description && (
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">{form.description}</p>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-10">
                {form.questions.map((question, index) => (
                  <div key={index} className="border-b border-gray-200 pb-10 last:border-0 last:pb-0">
                    <div className="flex items-start mb-6">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <span className="text-indigo-600 font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.title}</h3>
                        
                        {question.image && (
                          <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
                            <img src={question.image} alt="Question" className="w-full h-48 object-cover" />
                          </div>
                        )}

                        {question.type === 'categorize' && (
                          <div>
                            <p className="text-gray-600 mb-6">Categorize the items below:</p>
                            
                            {(() => {
                              const allItems = new Set();
                              question.categories.forEach(category => {
                                category.items.forEach(item => allItems.add(item));
                              });
                              
                              return (
                                <div>
                                  <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="font-medium mb-4 text-gray-700">Items:</p>
                                    <div className="flex flex-wrap gap-3">
                                      {Array.from(allItems).map((item, itemIndex) => (
                                        <span key={itemIndex} className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 shadow-sm">
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {question.categories.map((category, catIndex) => (
                                      <div key={catIndex} className="border border-gray-200 rounded-lg p-5 bg-white">
                                        <h4 className="font-semibold mb-4 text-gray-800 flex items-center">
                                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                            <span className="text-xs text-indigo-600">{catIndex + 1}</span>
                                          </div>
                                          {category.name}
                                        </h4>
                                        <div className="min-h-20 bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                                          {responses[index] && responses[index][category.name] && responses[index][category.name].length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                              {responses[index][category.name].map((item, itemIndex) => (
                                                <span key={itemIndex} className="bg-indigo-100 text-indigo-800 rounded-lg px-3 py-1">
                                                  {item}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-gray-400 text-sm">Drag items here or click to select</p>
                                          )}
                                        </div>
                                        
                                        <div>
                                          <p className="text-sm text-gray-600 mb-3">Select items for this category:</p>
                                          <div className="flex flex-wrap gap-2">
                                            {Array.from(allItems).map((item, itemIndex) => (
                                              <button
                                                key={itemIndex}
                                                type="button"
                                                onClick={() => handleCategorizeChange(index, category.name, item)}
                                                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                                                  responses[index] && responses[index][category.name] && responses[index][category.name].includes(item)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                              >
                                                {item}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {question.type === 'cloze' && (
                          <div>
                            <p className="text-gray-600 mb-6">Fill in the blanks:</p>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                              {question.passage.split('[blank]').map((part, partIndex) => (
                                <span key={partIndex} className="text-lg">
                                  {part}
                                  {partIndex < question.passage.split('[blank]').length - 1 && (
                                    <input
                                      type="text"
                                      value={responses[index] && responses[index][partIndex] ? responses[index][partIndex] : ''}
                                      onChange={(e) => handleClozeChange(index, partIndex, e.target.value)}
                                      className="inline-block w-24 border-b-2 border-indigo-500 mx-1 bg-white px-2 text-center rounded-t focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                      placeholder="?"
                                    />
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.type === 'comprehension' && (
                          <div>
                            <p className="text-gray-600 mb-6">Read the passage and answer the questions:</p>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                              {question.comprehensionPassage}
                            </div>
                            <div className="space-y-8">
                              {question.comprehensionQuestions.map((q, qIndex) => (
                                <div key={qIndex}>
                                  <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                      <span className="text-xs text-indigo-600">{qIndex + 1}</span>
                                    </div>
                                    {q.question}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center">
                                        <input
                                          type="radio"
                                          id={`q${index}_${qIndex}_opt${optIndex}`}
                                          name={`question_${index}_${qIndex}`}
                                          value={option}
                                          checked={responses[index] && responses[index][qIndex] === option}
                                          onChange={() => handleComprehensionChange(index, qIndex, option)}
                                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <label htmlFor={`q${index}_${qIndex}_opt${optIndex}`} className="ml-3 block text-gray-700">
                                          {option}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex items-center px-6 py-3"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Form
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FormFiller;