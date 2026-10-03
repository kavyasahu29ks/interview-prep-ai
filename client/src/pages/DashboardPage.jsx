import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { readQuizHistory } from '../utils/quizStorage';

const DashboardPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [quizHistory, setQuizHistory] = useState(() => readQuizHistory());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/workspaces');
        setWorkspaces(response.data.workspaces || []);
      } catch (error) {
        console.error(error);
      } finally {
        setQuizHistory(readQuizHistory());
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalQuestions = workspaces.reduce((sum, workspace) => sum + (workspace.questions?.length || 0), 0);
  const completedQuestions = workspaces.reduce((sum, workspace) => sum + (workspace.questions?.filter((q) => q.isCompleted).length || 0), 0);
  const averagePercentage = quizHistory.length
    ? Math.round(quizHistory.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizHistory.length)
    : 0;
  const highestPercentage = quizHistory.length ? Math.max(...quizHistory.map((attempt) => attempt.percentage)) : 0;
  const topicPerformanceMap = new Map();
  for (const attempt of quizHistory) {
    const current = topicPerformanceMap.get(attempt.topic) || { topic: attempt.topic, correct: 0, total: 0 };
    current.correct += attempt.correct;
    current.total += attempt.totalQuestions;
    topicPerformanceMap.set(attempt.topic, current);
  }
  const topicPerformance = [...topicPerformanceMap.values()].map((topic) => ({
    ...topic,
    percentage: topic.total ? Math.round((topic.correct / topic.total) * 100) : 0
  }));

  return (
    <div className="page-shell">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Overview</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
        </div>

        <Link to="/workspaces/new" className="button-primary">
          + New workspace
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="card p-5">
          <p className="text-sm text-slate-400">Workspaces</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{workspaces.length}</h3>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-400">Questions</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{totalQuestions}</h3>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-400">Completed</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{completedQuestions}</h3>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-400">Quizzes attempted</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{quizHistory.length}</h3>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-400">Average quiz score</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{averagePercentage}%</h3>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-400">Best quiz score</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{highestPercentage}%</h3>
        </div>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Recent quiz attempts</h2>
          {loading ? (
            <div className="card p-6 text-slate-300">Loading quiz history...</div>
          ) : quizHistory.length === 0 ? (
            <div className="card p-6 text-slate-300">No quiz attempts yet. Open a workspace and take your first quiz.</div>
          ) : (
            <div className="space-y-3">
              {quizHistory.slice(0, 5).map((attempt) => (
                <Link key={attempt.id} to={`/quizzes/${attempt.id}`} className="card flex items-center justify-between gap-4 p-4 transition hover:border-blue-500/60">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">{attempt.topic} · {attempt.workspaceName}</h3>
                    <p className="mt-1 text-sm text-slate-400">{attempt.role} · {new Date(attempt.completedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="shrink-0 text-lg font-bold text-blue-200">{attempt.percentage}%</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Topic performance</h2>
          {topicPerformance.length === 0 ? (
            <div className="card p-6 text-slate-300">Topic performance will appear after a quiz is submitted.</div>
          ) : (
            <div className="card divide-y divide-slate-800 p-2">
              {topicPerformance
                .sort((first, second) => first.percentage - second.percentage)
                .map((topic) => (
                  <div key={topic.topic} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-sm text-slate-200">{topic.topic}</span>
                    <span className={topic.percentage < 70 ? 'text-sm text-amber-300' : 'text-sm text-emerald-300'}>{topic.percentage}%</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your workspaces</h2>
        </div>

        {loading ? (
          <div className="card p-8 text-slate-300">Loading workspaces...</div>
        ) : workspaces.length === 0 ? (
          <div className="card p-8 text-slate-300">No workspaces yet. Create your first one to start preparing.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workspaces.map((workspace) => (
              <Link key={workspace._id} to={`/workspaces/${workspace._id}`} className="card block p-5 transition hover:border-blue-500/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{workspace.name}</h3>
                  <span className="badge">{workspace.role}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{workspace.experienceLevel}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(workspace.skills || []).slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
