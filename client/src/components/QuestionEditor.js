import React from 'react';
import ImageUploader from './ImageUploader';

const QuestionEditor = ({ question, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...question,
      [name]: value
    });
  };

  const handleImageUpload = (imageUrl) => {
    onChange({
      ...question,
      image: imageUrl
    });
  };

  // For categorize questions
  const handleCategoryChange = (categoryIndex, field, value) => {
    const newCategories = [...question.categories];
    newCategories[categoryIndex] = {
      ...newCategories[categoryIndex],
      [field]: value
    };
    onChange({
      ...question,
      categories: newCategories
    });
  };

  const handleCategoryItemChange = (categoryIndex, itemIndex, value) => {
    const newCategories = [...question.categories];
    const newItems = [...newCategories[categoryIndex].items];
    newItems[itemIndex] = value;
    newCategories[categoryIndex].items = newItems;
    onChange({
      ...question,
      categories: newCategories
    });
  };

  const addCategory = () => {
    onChange({
      ...question,
      categories: [
        ...question.categories,
        { name: '', items: [] }
      ]
    });
  };

  const removeCategory = (index) => {
    const newCategories = [...question.categories];
    newCategories.splice(index, 1);
    onChange({
      ...question,
      categories: newCategories
    });
  };

  const addCategoryItem = (categoryIndex) => {
    const newCategories = [...question.categories];
    newCategories[categoryIndex].items.push('');
    onChange({
      ...question,
      categories: newCategories
    });
  };

  const removeCategoryItem = (categoryIndex, itemIndex) => {
    const newCategories = [...question.categories];
    const newItems = [...newCategories[categoryIndex].items];
    newItems.splice(itemIndex, 1);
    newCategories[categoryIndex].items = newItems;
    onChange({
      ...question,
      categories: newCategories
    });
  };

  // For cloze questions
  const handlePassageChange = (e) => {
    onChange({
      ...question,
      passage: e.target.value
    });
  };

  const handleBlankChange = (blankIndex, field, value) => {
    const newBlanks = [...question.blanks];
    newBlanks[blankIndex] = {
      ...newBlanks[blankIndex],
      [field]: value
    };
    onChange({
      ...question,
      blanks: newBlanks
    });
  };

  const addBlank = () => {
    onChange({
      ...question,
      blanks: [
        ...question.blanks,
        { position: 0, answer: '' }
      ]
    });
  };

  const removeBlank = (index) => {
    const newBlanks = [...question.blanks];
    newBlanks.splice(index, 1);
    onChange({
      ...question,
      blanks: newBlanks
    });
  };

  // For comprehension questions
  const handleComprehensionPassageChange = (e) => {
    onChange({
      ...question,
      comprehensionPassage: e.target.value
    });
  };

  const handleComprehensionQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...question.comprehensionQuestions];
    newQuestions[qIndex] = {
      ...newQuestions[qIndex],
      [field]: value
    };
    onChange({
      ...question,
      comprehensionQuestions: newQuestions
    });
  };

  const handleComprehensionOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...question.comprehensionQuestions];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions[optIndex] = value;
    newQuestions[qIndex].options = newOptions;
    onChange({
      ...question,
      comprehensionQuestions: newQuestions
    });
  };

  const addComprehensionQuestion = () => {
    onChange({
      ...question,
      comprehensionQuestions: [
        ...question.comprehensionQuestions,
        { question: '', options: ['', '', '', ''], answer: '' }
      ]
    });
  };

  const removeComprehensionQuestion = (index) => {
    const newQuestions = [...question.comprehensionQuestions];
    newQuestions.splice(index, 1);
    onChange({
      ...question,
      comprehensionQuestions: newQuestions
    });
  };

  const addComprehensionOption = (qIndex) => {
    const newQuestions = [...question.comprehensionQuestions];
    newQuestions[qIndex].options.push('');
    onChange({
      ...question,
      comprehensionQuestions: newQuestions
    });
  };

  const removeComprehensionOption = (qIndex, optIndex) => {
    const newQuestions = [...question.comprehensionQuestions];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions.splice(optIndex, 1);
    newQuestions[qIndex].options = newOptions;
    onChange({
      ...question,
      comprehensionQuestions: newQuestions
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Title
        </label>
        <input
          type="text"
          name="title"
          value={question.title}
          onChange={handleInputChange}
          className="input"
          placeholder="Enter question title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Image
        </label>
        {question.image && (
          <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
            <img src={question.image} alt="Question" className="w-full h-40 object-cover" />
          </div>
        )}
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>

      {question.type === 'categorize' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-gray-800">Categories</h3>
            <button
              onClick={addCategory}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </button>
          </div>
          
          <div className="space-y-4">
            {question.categories.map((category, catIndex) => (
              <div key={catIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Category {catIndex + 1}</h4>
                  <button
                    onClick={() => removeCategory(catIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleCategoryChange(catIndex, 'name', e.target.value)}
                    className="input"
                    placeholder="Category name"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Items
                    </label>
                    <button
                      onClick={() => addCategoryItem(catIndex)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Add Item
                    </button>
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleCategoryItemChange(catIndex, itemIndex, e.target.value)}
                        className="input mr-2"
                        placeholder="Item"
                      />
                      <button
                        onClick={() => removeCategoryItem(catIndex, itemIndex)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
          <h3 className="text-md font-medium text-gray-800 mb-4">Cloze Passage</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passage
            </label>
            <textarea
              value={question.passage}
              onChange={handlePassageChange}
              className="input"
              placeholder="Enter passage with blanks marked as [blank]"
              rows="4"
            />
            <p className="text-xs text-gray-500 mt-1">Use [blank] to mark where blanks should appear</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-gray-800">Blanks</h3>
              <button
                onClick={addBlank}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Blank
              </button>
            </div>
            {question.blanks.map((blank, blankIndex) => (
              <div key={blankIndex} className="border border-gray-200 rounded-lg p-4 mb-3 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Blank {blankIndex + 1}</h4>
                  <button
                    onClick={() => removeBlank(blankIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position in Passage
                  </label>
                  <input
                    type="number"
                    value={blank.position}
                    onChange={(e) => handleBlankChange(blankIndex, 'position', parseInt(e.target.value))}
                    className="input"
                    placeholder="Position"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <input
                    type="text"
                    value={blank.answer}
                    onChange={(e) => handleBlankChange(blankIndex, 'answer', e.target.value)}
                    className="input"
                    placeholder="Answer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {question.type === 'comprehension' && (
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-4">Comprehension Passage</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passage
            </label>
            <textarea
              value={question.comprehensionPassage}
              onChange={handleComprehensionPassageChange}
              className="input"
              placeholder="Enter comprehension passage"
              rows="4"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-gray-800">Questions</h3>
              <button
                onClick={addComprehensionQuestion}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Question
              </button>
            </div>
            {question.comprehensionQuestions.map((q, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-lg p-4 mb-3 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Question {qIndex + 1}</h4>
                  <button
                    onClick={() => removeComprehensionQuestion(qIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleComprehensionQuestionChange(qIndex, 'question', e.target.value)}
                    className="input"
                    placeholder="Question"
                  />
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    <button
                      onClick={() => addComprehensionOption(qIndex)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Add Option
                    </button>
                  </div>
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleComprehensionOptionChange(qIndex, optIndex, e.target.value)}
                        className="input mr-2"
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      <button
                        onClick={() => removeComprehensionOption(qIndex, optIndex)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <select
                    value={q.answer}
                    onChange={(e) => handleComprehensionQuestionChange(qIndex, 'answer', e.target.value)}
                    className="input"
                  >
                    <option value="">Select correct answer</option>
                    {q.options.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option || `Option ${optIndex + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;