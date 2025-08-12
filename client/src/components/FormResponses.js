import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form details
        const formResponse = await fetch(`/api/forms/${id}`);
        const formData = await formResponse.json();
        setForm(formData);
        
        // Fetch form responses
        const responsesResponse = await fetch(`/api/responses/${id}`);
        const responsesData = await responsesResponse.json();
        setResponses(responsesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
              <h1 className="text-2xl font-bold text-gray-900">Form Responses</h1>
              <p className="mt-1 text-gray-500">View and analyze form submissions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/forms/${id}/preview`)}
                className="btn btn-secondary"
              >
                Preview Form
              </button>
              <button
                onClick={() => navigate(`/forms/${id}/edit`)}
                className="btn btn-secondary"
              >
                Edit Form
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{form.title}</h2>
                <p className="text-gray-600 mt-1">{form.description}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-indigo-800">Total Responses:</span>
                  <span className="ml-2 font-semibold">{responses.length}</span>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-800">Questions:</span>
                  <span className="ml-2 font-semibold">{form.questions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Responses */}
          <div className="p-6">
            {responses.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-5xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No responses yet</h3>
                <p className="text-gray-600 mb-6">Share your form to start collecting responses</p>
                <button
                  onClick={() => navigate(`/forms/${id}/fill`)}
                  className="btn btn-primary"
                >
                  Fill Out Form
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {responses.map((response, responseIndex) => (
                  <div key={responseIndex} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Response #{responseIndex + 1}
                      </h3>
                      <div className="text-sm text-gray-500">
                        {new Date(response.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {form.questions.map((question, questionIndex) => {
                        const questionResponse = response.responses.find(
                          r => r.questionId.toString() === question._id.toString()
                        );
                        
                        return (
                          <div key={questionIndex} className="border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                            <div className="flex items-start mb-4">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-3">
                                <span className="text-indigo-600 font-medium">{questionIndex + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 mb-4">{question.title}</h4>
                                
                                {question.type === 'categorize' && questionResponse && (
                                  <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {Object.entries(questionResponse.answer).map(([category, items], catIndex) => (
                                        <div key={catIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                                          <h5 className="font-semibold mb-3 text-gray-700 flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                              <span className="text-xs text-indigo-600">{catIndex + 1}</span>
                                            </div>
                                            {category}
                                          </h5>
                                          <div className="flex flex-wrap gap-2">
                                            {items.map((item, itemIndex) => (
                                              <span key={itemIndex} className="bg-indigo-100 text-indigo-800 rounded-lg px-3 py-1">
                                                {item}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {question.type === 'cloze' && questionResponse && (
                                  <div>
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                      {question.passage.split('[blank]').map((part, partIndex) => (
                                        <span key={partIndex} className="text-lg">
                                          {part}
                                          {partIndex < question.passage.split('[blank]').length - 1 && (
                                            <span className="inline-block min-w-24 border-b-2 border-indigo-500 mx-1 px-2 text-center font-medium bg-white rounded-t">
                                              {questionResponse.answer[partIndex] || '___'}
                                            </span>
                                          )}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {question.type === 'comprehension' && questionResponse && (
                                  <div>
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                                      {question.comprehensionPassage}
                                    </div>
                                    <div className="space-y-6">
                                      {question.comprehensionQuestions.map((q, qIndex) => (
                                        <div key={qIndex}>
                                          <p className="font-medium text-gray-800 mb-3 flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                              <span className="text-xs text-indigo-600">{qIndex + 1}</span>
                                            </div>
                                            {q.question}
                                          </p>
                                          <p className="text-indigo-600 font-medium">
                                            Answer: {questionResponse.answer[qIndex] || 'Not answered'}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormResponses;