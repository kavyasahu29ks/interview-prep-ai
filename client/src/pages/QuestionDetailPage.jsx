import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import YouTubeResources from '../components/YouTubeResources';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanding, setExpanding] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${id}`);
        setQuestion(res.data.question);
        setExplanation(res.data.explanation);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleExplain = async () => {
    setExpanding(true);

    try {
      const res = await api.post('/ai/explain', {
        questionId: id,
        role: 'QA Engineer',
        experienceLevel: '3-5 years',
        question: question.prompt
      });

      setExplanation(res.data.explanation);
    } catch (error) {
      console.error(error);
    } finally {
      setExpanding(false);
    }
  };

  const handleComplete = async () => {
    try {
      const res = await api.put(`/questions/${id}`, { isCompleted: !question.isCompleted });
      setQuestion(res.data.question);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this question?')) return;

    try {
      await api.delete(`/questions/${id}`);
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !question) {
    return <div className="page-shell text-slate-300">Loading question...</div>;
  }

  return (
    <div className="page-shell max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Question</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{question.category} • {question.difficulty}</h1>
        </div>

        <div className="flex gap-3">
          <button className="button-secondary" onClick={handleDelete}>Delete</button>
          <button className="button-secondary" onClick={handleComplete}>{question.isCompleted ? 'Mark incomplete' : 'Mark complete'}</button>
          <button className="button-primary" onClick={handleExplain} disabled={expanding}>
            {expanding ? 'Explaining...' : 'Ask Gemini'}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white">Prompt</h2>
        <p className="mt-3 text-slate-200">{question.prompt}</p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">Sample answer</h3>
          <p className="mt-3 whitespace-pre-line text-slate-200">{question.answer || 'No answer recorded yet.'}</p>
        </div>
      </div>

      <YouTubeResources topics={[question.category]} />

      {explanation && (
        <div className="mt-8 space-y-5">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">Simple explanation</h3>
            <p className="mt-3 text-slate-200">{explanation.explanation}</p>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">Real-world example</h3>
            <p className="mt-3 text-slate-200">{explanation.realWorldExample}</p>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">Interview answer</h3>
            <p className="mt-3 text-slate-200">{explanation.interviewAnswer}</p>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">Key points to remember</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-200">
              {(explanation.keyPoints || []).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;
