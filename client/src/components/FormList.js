import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FormList = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/forms');
        if (!response.ok) throw new Error('Failed to fetch forms');
        const data = await response.json();
        setForms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching forms:', error);
        setError(error.message);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">Unable to connect to the server. Please check your connection.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full"
          >
            Try Again
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
              <p className="mt-1 text-gray-500">Create and manage professional forms</p>
            </div>
            <button
              onClick={() => navigate('/forms/new')}
              className="mt-4 md:mt-0 btn btn-primary flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Form
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Total Forms:</span>
              <span className="ml-2 font-semibold">{forms.length}</span>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No forms found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Create your first form to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/forms/new')}
                className="btn btn-primary"
              >
                Create Form
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div key={form._id} className="card fade-in">
                {form.headerImage && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={form.headerImage} 
                      alt={form.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{form.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {form.questions.length} {form.questions.length === 1 ? 'question' : 'questions'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{form.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/forms/${form._id}/preview`)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Preview"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate(`/forms/${form._id}/edit`)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate(`/forms/${form._id}/responses`)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Responses"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FormList;