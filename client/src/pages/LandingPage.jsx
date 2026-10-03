import { Link } from 'react-router-dom';

const features = [
  'Role-based interview workspaces',
  'AI-generated tailored questions',
  'Structured answer explanations',
  'Track your progress and dashboard stats'
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="page-shell">
        <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="badge">Interview prep, smarter.</span>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
              Practice interviews with AI-powered guidance.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Build workspaces for different roles, generate tailored questions, and review polished explanations before the big interview.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="button-primary">
                Get started
              </Link>
              <Link to="/login" className="button-secondary">
                Login
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Interview Score</span>
                <span className="badge">87%</span>
              </div>
              <div className="mt-6 grid gap-4">
                {features.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-300">✓</div>
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
