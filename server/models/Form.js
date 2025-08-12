const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  headerImage: {
    type: String,
    default: ''
  },
  questions: [{
    type: {
      type: String,
      enum: ['categorize', 'cloze', 'comprehension'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    // For categorize questions
    categories: [{
      name: String,
      items: [String]
    }],
    // For cloze questions
    passage: String,
    blanks: [{
      position: Number,
      answer: String
    }],
    // For comprehension questions
    comprehensionPassage: String,
    comprehensionQuestions: [{
      question: String,
      options: [String],
      answer: String
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', FormSchema);