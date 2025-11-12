const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const authJWT = require("../../middlewares/authJWT");
const courseController = require('../../controllers/admin/courseController');

router.post(
    '/', authJWT,
    upload.fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'videoUrl', maxCount: 1 }]),
    courseController.createCourse
);

router.get('/', authJWT, courseController.getCourses);
router.get('/:id', authJWT, courseController.getCourseById);
router.put('/:id', authJWT, upload.fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'videoUrl', maxCount: 1 }]), courseController.updateCourse);
router.delete('/:id', authJWT, courseController.deleteCourse);

module.exports = router;
