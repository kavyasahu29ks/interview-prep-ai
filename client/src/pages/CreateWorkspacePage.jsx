import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const roles = ['Manual Tester', 'QA Engineer', 'Software Developer', 'Data Analyst'];
const experienceLevels = ['Fresher', '1-2 years', '3-5 years'];
const difficultyLevels = ['Easy', 'Medium', 'Hard'];

const CreateWorkspacePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    role: roles[1],
    experienceLevel: experienceLevels[2],
    skills: 'API Testing, SQL, Automation',
    topics: 'REST APIs, Test Cases, Bug Reporting',
    difficulty: 'Medium',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/workspaces', {
        ...form,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        topics: form.topics.split(',').map((topic) => topic.trim()).filter(Boolean)
      });

      navigate(`/workspaces/${res.data.workspace._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create workspace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell max-w-3xl">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-white">Create workspace</h1>
        <p className="mt-2 text-slate-400">Define the interview role, experience level, and topics to focus on.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Workspace name</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="QA Engineer Prep" required />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Role</label>
              <select className="input" name="role" value={form.role} onChange={handleChange}>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Experience level</label>
              <select className="input" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Skills</label>
              <input className="input" name="skills" value={form.skills} onChange={handleChange} placeholder="API Testing, SQL, Automation" />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Difficulty</label>
              <select className="input" name="difficulty" value={form.difficulty} onChange={handleChange}>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Topics</label>
            <input className="input" name="topics" value={form.topics} onChange={handleChange} placeholder="REST APIs, Test Cases, Bug Reporting" />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Description</label>
            <textarea className="input min-h-28" name="description" value={form.description} onChange={handleChange} placeholder="What should this workspace focus on?" />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create workspace'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspacePage;
