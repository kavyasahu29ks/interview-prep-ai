import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="page-shell max-w-2xl">
      <div className="card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Profile</p>
        <h1 className="mt-3 text-3xl font-bold text-white">{user?.name}</h1>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-2 text-lg text-white">{user?.email}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-2 text-lg text-emerald-300">Active learner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
