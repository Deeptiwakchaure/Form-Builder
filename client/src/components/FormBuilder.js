import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import QuestionEditor from './QuestionEditor';

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    headerImage: '',
    questions: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        setLoading(true);
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
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleHeaderImageUpload = (imageUrl) => {
    setForm(prev => ({ ...prev, headerImage: imageUrl }));
  };

  const handleQuestionChange = (index, question) => {
    const newQuestions = [...form.questions];
    newQuestions[index] = question;
    setForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      title: '',
      image: '',
      ...(type === 'categorize' && {
        categories: [
          { name: 'Category 1', items: [] },
          { name: 'Category 2', items: [] }
        ]
      }),
      ...(type === 'cloze' && {
        passage: '',
        blanks: []
      }),
      ...(type === 'comprehension' && {
        comprehensionPassage: '',
        comprehensionQuestions: []
      })
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (index) => {
    const newQuestions = [...form.questions];
    newQuestions.splice(index, 1);
    setForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const saveForm = async () => {
    if (!form.title.trim()) {
      alert('Please enter a form title');
      return;
    }

    setSaving(true);
    try {
      const url = id ? `/api/forms/${id}` : '/api/forms';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const savedForm = await response.json();
        navigate(`/forms/${savedForm._id}/preview`);
      } else {
        console.error('Error saving form');
        alert('Failed to save form. Please try again.');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Edit Form' : 'Create New Form'}
              </h1>
              <p className="mt-1 text-gray-500">Design your form with our intuitive builder</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveForm}
                disabled={saving}
                className="btn btn-primary flex items-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Form
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Settings */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Form Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Form Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter form title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter form description"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Header Image
                  </label>
                  {form.headerImage && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                      <img src={form.headerImage} alt="Header" className="w-full h-40 object-cover" />
                    </div>
                  )}
                  <ImageUploader onImageUpload={handleHeaderImageUpload} />
                </div>
              </div>
            </div>

            {/* Add Question */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Question</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => addQuestion('categorize')}
                  className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">Categorize</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>

                <button
                  onClick={() => addQuestion('cloze')}
                  className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">Cloze</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>

                <button
                  onClick={() => addQuestion('comprehension')}
                  className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">Comprehension</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  {form.questions.length} {form.questions.length === 1 ? 'question' : 'questions'}
                </span>
              </div>

              {form.questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">❓</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No questions added yet</h3>
                  <p className="text-gray-500 mb-6">Add questions using the options on the left</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {form.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-medium">{index + 1}</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {question.title || 'Untitled Question'}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeQuestion(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <QuestionEditor
                        question={question}
                        onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormBuilder;