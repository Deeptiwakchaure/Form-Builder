const express = require('express');
const router = express.Router();
const Form = require('../models/Form');

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms || []);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json([]);
  }
});

// Get a specific form
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new form
router.post('/', async (req, res) => {
  const form = new Form({
    title: req.body.title,
    description: req.body.description,
    headerImage: req.body.headerImage || '',
    questions: req.body.questions || []
  });

  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a form
router.put('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    form.title = req.body.title || form.title;
    form.description = req.body.description || form.description;
    form.headerImage = req.body.headerImage || form.headerImage;
    form.questions = req.body.questions || form.questions;
    form.updatedAt = Date.now();

    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    await form.remove();
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;