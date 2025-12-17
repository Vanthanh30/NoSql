const Lesson = require("../../models/admin/lesson");

const createLesson = async (req, res) => {
  try {
    const { _id, title, chapterId, preview, videoDuration, attachmentUrl } =
      req.body;
    let videoUrl = req.file ? req.file.path : null;

    let durationInSeconds = null;
    if (videoDuration) {
      if (typeof videoDuration === "string" && videoDuration.includes(":")) {
        const [min, sec] = videoDuration.split(":").map(Number);
        durationInSeconds = min * 60 + sec;
      } else {
        durationInSeconds = Number(videoDuration);
      }
    }

    if (_id) {
      const updated = await Lesson.findByIdAndUpdate(
        _id,
        {
          title,
          preview,
          videoDuration: durationInSeconds,
          attachmentUrl,
          videoUrl,
          chapterId,
        },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: "Lesson not found" });
      return res
        .status(200)
        .json({ message: "Lesson updated", lesson: updated });
    }
    const newLesson = new Lesson({
      title,
      preview,
      videoDuration: durationInSeconds,
      attachmentUrl,
      videoUrl,
      chapterId,
    });

    await newLesson.save();
    res.status(201).json({ message: "Lesson created", lesson: newLesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadLessonVideo = async (req, res) => {
  try {
    const lessonId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ error: "Video file is required" });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { videoUrl: req.file.path },
      { new: true }
    );

    if (!updatedLesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.status(200).json({
      message: "Lesson video uploaded successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error("Error uploading lesson video:", error);
    res.status(500).json({ error: error.message });
  }
};

const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.videoUrl = req.file.path;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updates, {
      new: true,
    });
    if (!updatedLesson)
      return res.status(404).json({ message: "Lesson not found" });

    res
      .status(200)
      .json({ message: "Lesson updated successfully", lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson)
      return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLesson,
  uploadLessonVideo,
  getLessons,
  updateLesson,
  deleteLesson,
};
