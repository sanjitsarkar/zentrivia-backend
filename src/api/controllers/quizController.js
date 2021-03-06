const { Quiz, Category, Question } = require("../models");

const addQuiz = async (req, res) => {
  try {
    const { title, quizCoverImage, quizDifficulty, categoryId, quizDesc } =
      req.body;
    const creatorId = req.user.id;
    const isCategoryExists = await Category.findById(categoryId);
    if (!isCategoryExists) throw Error("Category does not exist");
    const quiz = await Quiz.create({
      title,
      quizCoverImage,
      quizDifficulty,
      categoryId,
      quizDesc,
      creatorId,
    });

    res.json({ quiz });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, quizCoverImage, quizDifficulty, categoryId, quizDesc } =
      req.body;
    const creatorId = req.user.id;
    const isQuizExists = await Quiz.findOne({ _id: id, creatorId });
    if (isQuizExists) {
      const isCategoryExists = await Category.findById(categoryId);
      if (!isCategoryExists) throw Error("Category does not exist");

      const quiz = await Quiz.updateOne(
        { _id: id },
        {
          title,
          quizCoverImage,
          quizDifficulty,
          categoryId,
          quizDesc,
          creatorId,
        }
      );
      res.json({ quiz });
    } else throw Error("You are not authorized to perform this action");
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id;
    const isQuizExists = await Quiz.findOne({ _id: id, creatorId });
    if (isQuizExists) {
      const quiz = await Quiz.deleteOne({ _id: id });
      res.json({ quiz });
    } else throw Error("You are not authorized to perform this action");
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    res.json({ quiz });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json({ quizzes });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllQuizByCreatorId = async (req, res) => {
  try {
    const { q } = req.query;
    let quizzes;
    if (q)
      quizzes = await Quiz.find(
        { creatorId: req.user.id, $text: { $search: q } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    else quizzes = await Quiz.find({ creatorId: req.user.id });
    res.json({ quizzes });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllQuestionByQuizId = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const questions = await Question.find({ quizId });
    res.json({ questions });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const searchQuiz = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) throw Error("Please add query q value");
    const quizzes = await Quiz.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    res.json({ quizzes });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
module.exports = {
  addQuiz,
  updateQuiz,
  deleteQuiz,
  fetchQuiz,
  fetchAllQuiz,
  fetchAllQuestionByQuizId,
  fetchAllQuizByCreatorId,
  searchQuiz,
};
