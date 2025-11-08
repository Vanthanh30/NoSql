const express = require('express');
const router = express.Router();
const chapterController = require('../../controllers/admin/chapterController');

router.post('/', chapterController.createChapter);
router.get('/', chapterController.getChapters);
router.put('/:id', chapterController.updateChapter);
router.delete('/:id', chapterController.deleteChapter);

module.exports = router;
