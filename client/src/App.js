import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormList from './components/FormList';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import FormFiller from './components/FormFiller';
import FormResponses from './components/FormResponses';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<FormList />} />
          <Route path="/forms/new" element={<FormBuilder />} />
          <Route path="/forms/:id/edit" element={<FormBuilder />} />
          <Route path="/forms/:id/preview" element={<FormPreview />} />
          <Route path="/forms/:id/fill" element={<FormFiller />} />
          <Route path="/forms/:id/responses" element={<FormResponses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;