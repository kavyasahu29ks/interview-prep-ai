const YouTubeResources = ({ topics = [] }) => {
  const uniqueTopics = [...new Map(
    topics
      .filter((topic) => typeof topic === 'string' && topic.trim())
      .map((topic) => [topic.trim().toLocaleLowerCase(), topic.trim()])
  ).values()];

  return (
    <section className="mt-8" aria-labelledby="youtube-resources-heading">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Keep learning</p>
        <h2 id="youtube-resources-heading" className="mt-1 text-2xl font-bold text-white">YouTube Resources</h2>
      </div>

      {uniqueTopics.length === 0 ? (
        <div className="card p-5 text-sm text-slate-300">Add workspace topics to see related interview-preparation searches.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {uniqueTopics.map((topic) => {
            const query = `${topic} interview preparation`;
            const searchUrl = `https://www.youtube.com/results?${new URLSearchParams({ search_query: query })}`;

            return (
              <article key={topic} className="card rounded-xl p-4 shadow-none">
                <h3 className="font-semibold text-white">{topic}</h3>
                <p className="mt-2 text-xs text-slate-400">Search query</p>
                <p className="break-words text-sm text-slate-300">{query}</p>
                <a
                  className="button-secondary mt-4 w-full sm:w-auto"
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                </a>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default YouTubeResources;