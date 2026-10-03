import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-white">Create your account</h2>
        <p className="mt-2 text-sm text-slate-400">Start preparing for interview success.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Full name</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </div>

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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
