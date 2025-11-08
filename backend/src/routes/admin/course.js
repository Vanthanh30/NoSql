const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const courseController = require('../../controllers/admin/courseController');

router.post(
    '/',
    upload.fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'videoUrl', maxCount: 1 }]),
    courseController.createCourse
);

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', upload.fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'videoUrl', maxCount: 1 }]), courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
