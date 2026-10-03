import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  calculateQuizResult,
  completeQuizAttempt,
  createQuizAttempt,
  getActiveQuiz,
  getCompletedQuiz,
  saveActiveQuiz
} from '../utils/quizStorage';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const activeQuiz = getActiveQuiz(id);
    if (activeQuiz) {
      setQuiz(activeQuiz);
      setResult(null);
    } else {
      const completed = getCompletedQuiz(id);
      if (completed) {
        setQuiz(completed.quiz);
        setResult(completed.result);
      } else {
        setError('This quiz could not be found in local quiz history.');
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!quiz || result) return undefined;
    const handleBeforeUnload = (event) => {
      if (Object.values(quiz.selectedAnswers).some((answer) => answer !== null)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [quiz, result]);

  const selectAnswer = (questionId, optionIndex) => {
    const updated = {
      ...quiz,
      selectedAnswers: { ...quiz.selectedAnswers, [questionId]: optionIndex }
    };
    setQuiz(updated);
    saveActiveQuiz(updated);
  };

  const submitQuiz = () => {
    if (!window.confirm('Submit this quiz and calculate your score? You can review your answers afterward.')) return;
    const score = calculateQuizResult(quiz);
    const completedQuiz = { ...quiz, status: 'submitted' };
    completeQuizAttempt(completedQuiz, score);
    setQuiz(completedQuiz);
    setResult(score);
  };

  const retakeQuiz = () => {
    const nextQuiz = createQuizAttempt({
      workspace: {
        _id: quiz.workspace,
        name: quiz.workspaceName,
        role: quiz.role,
        experienceLevel: quiz.experience,
        difficulty: quiz.difficulty
      },
      topic: quiz.topic
    });
    if (nextQuiz) navigate(`/quizzes/${nextQuiz.id}`);
  };

  if (loading) return <div className="page-shell text-slate-300">Loading quiz...</div>;
  if (error || !quiz) {
    return (
      <main className="page-shell">
        <div role="alert" className="card p-6 text-rose-200">{error || 'Quiz unavailable.'}</div>
        <Link className="button-secondary mt-4" to="/dashboard">Back to Dashboard</Link>
      </main>
    );
  }

  if (result) {
    return (
      <main className="page-shell">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Quiz result</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{quiz.topic}</h1>
            <p className="mt-2 text-slate-400">{quiz.workspaceName} · {quiz.role} · {quiz.experience} · {quiz.difficulty}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="button-primary" onClick={retakeQuiz}>Retake Quiz</button>
            <Link className="button-secondary" to={`/workspaces/${quiz.workspace}#topics`}>Back to Topic</Link>
            <Link className="button-secondary" to={`/workspaces/${quiz.workspace}`}>Back to Workspace</Link>
          </div>
        </header>

        <section className="card p-6 sm:p-8" aria-labelledby="quiz-result-heading">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Scorecard</p>
          <h2 id="quiz-result-heading" className="mt-2 text-2xl font-bold text-white">{result.performance}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="text-sm text-slate-400">Score</p><p className="mt-1 text-2xl font-bold text-white">{result.score} / {result.totalQuestions}</p></div>
            <div><p className="text-sm text-slate-400">Percentage</p><p className="mt-1 text-2xl font-bold text-white">{result.percentage}%</p></div>
            <div><p className="text-sm text-slate-400">Correct</p><p className="mt-1 text-2xl font-bold text-emerald-300">{result.correct}</p></div>
            <div><p className="text-sm text-slate-400">Incorrect / unanswered</p><p className="mt-1 text-2xl font-bold text-white">{result.incorrect} / {result.unanswered}</p></div>
          </div>
          <p className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-300">Accuracy: {result.accuracy}% of answered questions</p>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-white">Review weak topics</h2>
          {result.weakTopics.length ? (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
              <p className="font-semibold text-amber-100">Areas to revise</p>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-amber-200">
                {result.weakTopics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-emerald-300">No incorrect answers. Keep up the good work.</p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Question review</h2>
          <div className="space-y-4">
            {result.review.map((question, index) => (
              <article key={question.id} className={`card border-l-4 p-5 ${question.isCorrect ? 'border-l-emerald-400' : question.selectedIndex === null ? 'border-l-amber-300' : 'border-l-rose-400'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-slate-400">Question {index + 1} · {question.weakArea}</p>
                  <span className={question.isCorrect ? 'text-sm font-semibold text-emerald-300' : question.selectedIndex === null ? 'text-sm font-semibold text-amber-200' : 'text-sm font-semibold text-rose-300'}>
                    {question.isCorrect ? 'Correct' : question.selectedIndex === null ? 'Unanswered' : 'Incorrect'}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-white">{question.question}</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="text-sm text-slate-300"><span className="text-slate-500">Your answer:</span> {question.yourAnswer || 'No answer'}</p>
                  <p className="text-sm text-emerald-200"><span className="text-slate-500">Correct answer:</span> {question.correctAnswer}</p>
                </div>
                <p className="mt-4 border-t border-slate-800 pt-3 text-sm text-slate-300">{question.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const question = quiz.questions[currentIndex];
  const selectedIndex = quiz.selectedAnswers[question.id] ?? null;
  const answeredCount = Object.values(quiz.selectedAnswers).filter((answer) => answer !== null).length;

  return (
    <main className="page-shell max-w-6xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">{quiz.workspaceName}</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{quiz.topic}</h1>
          <p className="mt-2 text-sm text-slate-400">{quiz.role} · {quiz.experience} · {quiz.difficulty}</p>
        </div>
        <p className="text-sm text-slate-300">{answeredCount} of {quiz.questions.length} answered</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px]">
        <section className="card p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-blue-200">Question {currentIndex + 1} / {quiz.questions.length}</p>
            <span className="badge">{quiz.difficulty}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }} />
          </div>

          <h2 className="mt-7 text-xl font-semibold leading-relaxed text-white sm:text-2xl">{question.question}</h2>
          <div className="mt-6 space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedIndex === optionIndex;
              return (
                <button
                  key={`${question.id}-${optionIndex}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => selectAnswer(question.id, optionIndex)}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${isSelected ? 'border-blue-400 bg-blue-500/15 text-white' : 'border-slate-700 bg-slate-950/50 text-slate-200 hover:border-slate-500'}`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-blue-300 bg-blue-500 text-xs text-white' : 'border-slate-500'}`} aria-hidden="true">{isSelected ? 'x' : ''}</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
            <button className="button-secondary" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0}>Previous</button>
            <div className="flex gap-2">
              {currentIndex < quiz.questions.length - 1 && (
                <button className="button-secondary" onClick={() => setCurrentIndex((index) => Math.min(quiz.questions.length - 1, index + 1))}>Next</button>
              )}
              <button className="button-primary" onClick={submitQuiz}>Submit Quiz</button>
            </div>
          </div>
        </section>

        <aside className="card h-fit p-4">
          <h2 className="font-semibold text-white">Question navigation</h2>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {quiz.questions.map((item, index) => {
              const isAnswered = quiz.selectedAnswers[item.id] !== null && quiz.selectedAnswers[item.id] !== undefined;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Question ${index + 1}${isAnswered ? ', answered' : ', unanswered'}`}
                  aria-current={currentIndex === index ? 'step' : undefined}
                  className={`aspect-square rounded-lg border text-sm font-medium ${currentIndex === index ? 'border-blue-300 bg-blue-600 text-white' : isAnswered ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200' : 'border-slate-700 bg-slate-950 text-slate-400'}`}
                >{index + 1}</button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-slate-400">Answers are saved locally as you go.</p>
        </aside>
      </div>
    </main>
  );
};

export default QuizPage;
