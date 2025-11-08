const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const lessonController = require('../../controllers/admin/lessonController');

router.post('/', upload.single('lessonVideo'), lessonController.createLesson);
router.post('/:id/uploadVideo', upload.single('lessonVideo'), lessonController.uploadLessonVideo);
router.get('/', lessonController.getLessons);
router.put('/:id', upload.single('lessonVideo'), lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
