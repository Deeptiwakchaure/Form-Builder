const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// Submit a response to a form
router.post('/:formId', async (req, res) => {
  try {
    const response = new Response({
      formId: req.params.formId,
      responses: req.body.responses
    });

    const newResponse = await response.save();
    res.status(201).json(newResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all responses for a form
router.get('/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;