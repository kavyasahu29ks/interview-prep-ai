import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import YouTubeResources from '../components/YouTubeResources';
import { getWorkspaceQuizTopics, quizTopics } from '../data/quizQuestionBank';
import { createQuizAttempt } from '../utils/quizStorage';

const WorkspaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [quizError, setQuizError] = useState('');

  const fetchWorkspace = async () => {
    try {
      const res = await api.get(`/workspaces/${id}`);
      setWorkspace(res.data.workspace);
      setQuestions(res.data.questions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  const handleGenerateQuestion = async () => {
    setGenerating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.post('/questions/generate', {
        workspaceId: id,
        count: 10,
        difficulty: workspace.difficulty || 'Medium'
      });

      setQuestions((prev) => [...res.data.questions, ...prev]);
      setSuccessMessage(res.data.message || 'Questions generated successfully.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to generate questions right now.');
    } finally {
      setGenerating(false);
    }
  };

  const handleTakeQuiz = (topic) => {
    setQuizError('');
    const attempt = createQuizAttempt({ workspace, topic });
    if (!attempt) {
      setQuizError(`There is no curated question bank for ${topic}.`);
      return;
    }
    navigate(`/quizzes/${attempt.id}`);
  };

  const handleDeleteWorkspace = async () => {
    if (!window.confirm('Delete this workspace and its questions?')) return;

    try {
      await api.delete(`/workspaces/${id}`);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !workspace) {
    return <div className="page-shell text-slate-300">Loading workspace...</div>;
  }

  const matchedQuizTopics = getWorkspaceQuizTopics(workspace.topics || [], workspace.skills || []);
  const availableQuizTopics = matchedQuizTopics.length ? matchedQuizTopics : quizTopics;

  return (
    <div className="page-shell">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{workspace.name}</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="button-secondary" onClick={handleDeleteWorkspace}>Delete</button>
          <button className="button-secondary" onClick={() => handleTakeQuiz(availableQuizTopics[0])}>
            Take Quiz
          </button>
          <button className="button-primary" onClick={handleGenerateQuestion} disabled={generating}>
            {generating ? 'Generating questions...' : 'Generate Questions with AI'}
          </button>
        </div>
      </div>

      {successMessage && <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{successMessage}</div>}
      {errorMessage && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{errorMessage}</div>}
      {quizError && (
        <div role="alert" className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
          <span>{quizError}</span>
          <button className="button-secondary shrink-0" onClick={() => setQuizError('')}>Dismiss</button>
        </div>
      )}

      <div className="card mb-6 p-6">
        <div className="flex flex-wrap gap-3">
          <span className="badge">{workspace.role}</span>
          <span className="badge">{workspace.experienceLevel}</span>
          <span className="badge">{workspace.difficulty || 'Medium'}</span>
        </div>

        <p className="mt-4 text-slate-300">{workspace.description || 'No description yet.'}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(workspace.skills || []).map((skill) => (
            <span key={skill} className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300">
              {skill}
            </span>
          ))}
        </div>

        {(workspace.topics || []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(workspace.topics || []).map((topic) => (
              <span key={topic} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-200">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <section id="topics" className="mt-8 scroll-mt-8">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Practice by topic</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Topic quizzes</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {availableQuizTopics.map((topic) => (
            <article key={topic} className="card flex flex-col justify-between gap-4 p-5">
              <div>
                <h3 className="text-lg font-semibold text-white">{topic}</h3>
                <p className="mt-1 text-sm text-slate-400">10 questions · {workspace.role} · {workspace.difficulty || 'Medium'}</p>
              </div>
              <button className="button-secondary self-start" onClick={() => handleTakeQuiz(topic)}>Take Quiz</button>
            </article>
          ))}
        </div>
      </section>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-white">Interview Questions</h2>

        {questions.length === 0 ? (
          <div className="card p-8 text-slate-300">No saved questions yet. Generate one to get started.</div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <Link key={question._id} to={`/questions/${question._id}`} className="card block p-5 hover:border-blue-500/60">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{index + 1}. {question.category} • {question.difficulty}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{question.prompt}</h3>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${question.isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                    {question.isCompleted ? 'Completed' : 'Open'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <YouTubeResources
        topics={[
          ...(workspace.topics || []),
          ...questions.map((question) => question.category)
        ]}
      />
    </div>
  );
};

export default WorkspaceDetailPage;
