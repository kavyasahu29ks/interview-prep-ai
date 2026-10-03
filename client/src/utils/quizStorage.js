import { getQuizQuestionBank } from '../data/quizQuestionBank.js';

const activeQuizKey = 'interviewprepai.activeQuiz.v1';
const historyKey = 'interviewprepai.quizHistory.v1';

const readArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export const readQuizHistory = () => readArray(historyKey);

export const getActiveQuiz = (id) => {
  try {
    const quiz = JSON.parse(localStorage.getItem(activeQuizKey) || 'null');
    return quiz?.id === id ? quiz : null;
  } catch {
    return null;
  }
};

export const getCompletedQuiz = (id) => {
  const attempt = readQuizHistory().find((item) => item.id === id);
  return attempt?.quiz ? { quiz: attempt.quiz, result: attempt.result } : null;
};

export const saveActiveQuiz = (quiz) => {
  localStorage.setItem(activeQuizKey, JSON.stringify(quiz));
};

export const createQuizAttempt = ({ workspace, topic }) => {
  const questions = getQuizQuestionBank(topic);
  if (questions.length !== 10) return null;
  const id = globalThis.crypto?.randomUUID?.() || `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const quiz = {
    id,
    workspace: workspace._id,
    workspaceName: workspace.name,
    role: workspace.role,
    experience: workspace.experienceLevel,
    difficulty: workspace.difficulty || 'Medium',
    topic: questions[0].topic,
    questions,
    selectedAnswers: {},
    startedAt: new Date().toISOString(),
    status: 'in_progress'
  };
  saveActiveQuiz(quiz);
  return quiz;
};

export const calculateQuizResult = (quiz) => {
  const review = quiz.questions.map((question) => {
    const selectedIndex = quiz.selectedAnswers[question.id] ?? null;
    return {
      ...question,
      selectedIndex,
      yourAnswer: selectedIndex === null ? '' : question.options[selectedIndex],
      isCorrect: selectedIndex !== null && selectedIndex === question.correctIndex
    };
  });
  const totalQuestions = review.length;
  const correct = review.filter((question) => question.isCorrect).length;
  const incorrect = review.filter((question) => question.selectedIndex !== null && !question.isCorrect).length;
  const unanswered = totalQuestions - correct - incorrect;
  const answered = correct + incorrect;
  const percentage = totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0;
  const weakTopics = [...new Set(review.filter((question) => question.selectedIndex !== null && !question.isCorrect).map((question) => question.weakArea))];
  const performance = percentage >= 90
    ? 'Excellent'
    : percentage >= 75
      ? 'Good'
      : percentage >= 60
        ? 'Needs Improvement'
        : 'Needs More Practice';

  return {
    totalQuestions,
    correct,
    incorrect,
    unanswered,
    score: correct,
    percentage,
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    performance,
    review,
    weakTopics
  };
};

export const completeQuizAttempt = (quiz, result) => {
  const completedAt = new Date().toISOString();
  const attempt = {
    id: quiz.id,
    workspace: quiz.workspace,
    workspaceName: quiz.workspaceName,
    role: quiz.role,
    experience: quiz.experience,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    score: result.score,
    totalQuestions: result.totalQuestions,
    percentage: result.percentage,
    correct: result.correct,
    incorrect: result.incorrect,
    unanswered: result.unanswered,
    completedAt,
    quiz,
    result
  };
  const history = readQuizHistory();
  localStorage.setItem(historyKey, JSON.stringify([attempt, ...history.filter((item) => item.id !== attempt.id)].slice(0, 30)));
  localStorage.removeItem(activeQuizKey);
  return attempt;
};
