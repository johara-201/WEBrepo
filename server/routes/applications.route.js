const express = require("express");
const router = express.Router();
const Application = require("../models/applicationSchema");

// POST - submit a new application
router.post("/", async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).send(application);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET - all applications (for admin)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ submittedAt: -1 });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET - applications for a specific job
router.get("/job/:jobId", async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId }).sort({ submittedAt: -1 });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE - delete an application
router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).send("Application deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
