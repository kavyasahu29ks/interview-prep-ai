import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-400">Log in to continue your prep journey.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here? <Link to="/register" className="text-blue-400 hover:text-blue-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
