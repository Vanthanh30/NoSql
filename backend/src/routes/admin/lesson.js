const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const lessonController = require('../../controllers/admin/lessonController');

router.post('/', upload.single('videoUrl'), lessonController.createLesson);
router.post('/:id/uploadVideo', upload.single('videoUrl'), lessonController.uploadLessonVideo);
router.get('/', lessonController.getLessons);
router.put('/:id', upload.single('videoUrl'), lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
