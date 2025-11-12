const express = require('express');
const router = express.Router();
const courseController = require("../../controllers/admin/courseController");
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);

module.exports = router;