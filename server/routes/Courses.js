const express = require("express");
const Course = require("../models/Course");
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = express.Router();

// GET all courses
router.get("/all", async (req, res) => {
  try {
    const courses = await Course.find({}, "-content"); // Exclude content here
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses." });
  }
});

// GET purchased courses (already implemented)
router.get("/purchased", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.purchasedCourses || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses." });
  }
});

// GET specific course content if purchased
router.get("/content/:title", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const courseTitle = req.params.title;

    if (!user.purchasedCourses.includes(courseTitle)) {
      return res.status(403).json({ message: "Course not purchased" });
    }

    const course = await Course.findOne({ title: courseTitle });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ sections: course.content });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch course content." });
  }
});

module.exports = router;
