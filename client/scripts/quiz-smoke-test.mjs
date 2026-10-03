import assert from 'node:assert/strict';
import {
  getQuizQuestionBank,
  getWorkspaceQuizTopics,
  quizTopics
} from '../src/data/quizQuestionBank.js';
import {
  calculateQuizResult,
  completeQuizAttempt,
  createQuizAttempt,
  getActiveQuiz,
  getCompletedQuiz,
  readQuizHistory,
  saveActiveQuiz
} from '../src/utils/quizStorage.js';

const storage = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key)
  }
};

assert.equal(quizTopics.length, 14, 'all requested topic banks exist');
for (const topic of quizTopics) {
  const questions = getQuizQuestionBank(topic);
  assert.equal(questions.length, 10, `${topic} has ten questions`);
  for (const question of questions) {
    assert.ok(question.question && question.explanation && question.weakArea, `${topic} questions have review metadata`);
    assert.equal(question.options.length, 4, `${topic} questions have four options`);
    assert.equal(question.options[question.correctIndex], question.correctAnswer, `${topic} correct answer matches its option`);
  }
}

assert.deepEqual(
  getWorkspaceQuizTopics(['REST APIs', 'Bug Reporting'], ['Automation', 'SQL']),
  ['API Testing', 'Bug Reporting / Defect Management', 'Automation Testing', 'SQL']
);

const workspace = {
  _id: 'workspace-local-1',
  name: 'QA Practice',
  role: 'QA Engineer',
  experienceLevel: 'Fresher',
  difficulty: 'Medium'
};
const quiz = createQuizAttempt({ workspace, topic: 'Manual Testing' });
assert.equal(quiz.questions.length, 10);
assert.equal(quiz.role, workspace.role);
assert.equal(quiz.experience, workspace.experienceLevel);

quiz.selectedAnswers = Object.fromEntries(quiz.questions.map((question, index) => [
  question.id,
  index < 8 ? question.correctIndex : index === 8 ? null : (question.correctIndex + 1) % question.options.length
]));
saveActiveQuiz(quiz);
assert.equal(getActiveQuiz(quiz.id).selectedAnswers[quiz.questions[0].id], quiz.questions[0].correctIndex, 'answers resume from localStorage');

const result = calculateQuizResult(quiz);
assert.deepEqual(
  { total: result.totalQuestions, correct: result.correct, incorrect: result.incorrect, unanswered: result.unanswered, percentage: result.percentage, accuracy: result.accuracy, performance: result.performance },
  { total: 10, correct: 8, incorrect: 1, unanswered: 1, percentage: 80, accuracy: 89, performance: 'Good' }
);
assert.deepEqual(result.weakTopics, [quiz.questions[9].weakArea]);

const completedQuiz = { ...quiz, status: 'submitted' };
completeQuizAttempt(completedQuiz, result);
assert.equal(getActiveQuiz(quiz.id), null, 'completed quiz is removed from active state');
assert.equal(readQuizHistory().length, 1, 'completed attempt persists locally');
assert.equal(getCompletedQuiz(quiz.id).result.percentage, 80, 'saved result is available after refresh');
assert.equal(readQuizHistory()[0].workspace, workspace._id);
assert.equal(readQuizHistory()[0].topic, 'Manual Testing');

const retake = createQuizAttempt({ workspace, topic: 'Manual Testing' });
assert.notEqual(retake.id, quiz.id, 'retake creates a fresh attempt');
assert.deepEqual(retake.selectedAnswers, {});

console.log('Quiz question bank and local attempt smoke tests passed.');
