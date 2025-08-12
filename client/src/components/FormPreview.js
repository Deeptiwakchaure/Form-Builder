import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);
        const data = await response.json();
        setForm(data);
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
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
              <h1 className="text-2xl font-bold text-gray-900">Form Preview</h1>
              <p className="mt-1 text-gray-500">Preview how your form will appear to users</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/forms/${id}/edit`)}
                className="btn btn-secondary"
              >
                Edit Form
              </button>
              <button
                onClick={() => navigate(`/forms/${id}/fill`)}
                className="btn btn-primary"
              >
                Fill Form
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <div className="flex items-start mb-4">
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {question.categories.map((category, catIndex) => (
                              <div key={catIndex} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                                <h4 className="font-semibold mb-4 text-gray-800 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                    <span className="text-xs text-indigo-600">{catIndex + 1}</span>
                                  </div>
                                  {category.name}
                                </h4>
                                <div className="space-y-2">
                                  {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.type === 'cloze' && (
                        <div>
                          <p className="text-gray-600 mb-6">Fill in the blanks:</p>
                          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            {question.passage.split('[blank]').map((part, index) => (
                              <span key={index} className="text-lg">
                                {part}
                                {index < question.passage.split('[blank]').length - 1 && (
                                  <span className="inline-block w-24 border-b-2 border-indigo-500 mx-1"></span>
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
                                      <div className="flex items-center justify-center h-5 w-5 rounded-full border border-gray-300 mr-3">
                                        {q.answer === option && (
                                          <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                                        )}
                                      </div>
                                      <label className="text-gray-700">{option}</label>
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
      </main>
    </div>
  );
};

export default FormPreview;