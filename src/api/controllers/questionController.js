const { Question, Quiz } = require("../models");

const addQuestion = async (req, res) => {
  try {
    const { title, quizId, options } = req.body;
    const isQuizExists = await Quiz.findOne({ quizId, creatorId: req.user.id });
    if (!isQuizExists)
      throw Error("You are not authorized to perform this action");
    const question = await Question.create({
      title,
      quizId,
      options,
    });

    res.json({ question });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, quizId, options } = req.body;
    const isQuizExists = await Quiz.findOne({ quizId, creatorId: req.user.id });
    if (!isQuizExists)
      throw Error("You are not authorized to perform this action");

    const question = await Question.updateOne(
      { _id: id },
      {
        title,
        quizId,
        options,
      }
    );
    res.json({ question });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const Question = await Question.deleteOne({ _id: id });
    res.json({ Question });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    res.json({ question });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllQuestion = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ questions });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const searchQuestion = async (req, res) => {
  try {
    const { q } = req.query;
    const { id: quizId } = req.params;
    if (!q) throw Error("Please add query q value");
    const questions = await Question.find(
      { quizId, $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    res.json({ questions });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  fetchQuestion,
  fetchAllQuestion,
  searchQuestion,
};
