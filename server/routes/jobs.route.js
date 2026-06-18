const express = require("express");
const router = express.Router();

const Job = require("../models/jobSchema");

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET job by id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    res.status(200).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST create new job
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);

    await job.save();

    res.status(201).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT update job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).send("Job deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;