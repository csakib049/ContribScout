import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { FileTreeItem, Issue, Repository } from "../types";
import { fetchRepository, fetchRepositoryFiles, fetchRepositoryIssues } from "../services/api";

export default function RepositoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [files, setFiles] = useState<FileTreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const repoId = Number(id);
    Promise.all([
      fetchRepository(repoId),
      fetchRepositoryIssues(repoId),
      fetchRepositoryFiles(repoId),
    ])
      .then(([repoData, issuesData, filesData]) => {
        setRepo(repoData);
        setIssues(issuesData.data);
        setFiles(filesData.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading......</div>;
  if (error) return <div className="p-8 text-center text-red-400">Error: {error}</div>;
  if (!repo) return <div className="p-8 text-center">Repository not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">&larr; Back to Explore</Link>

      <div className="flex justify-between items-start mt-4">
        <div>
          <h1 className="text-2xl font-bold">{repo.owner}/{repo.name}</h1>
          <p className="text-gray-400 mt-1">{repo.description}</p>
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="bg-white text-gray-950 text-sm font-medium px-4 py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          View on GitHub
        </a>
      </div>

      <div className="flex gap-4 text-sm text-gray-400 mt-3">
        <span>⭐ {repo.stars}</span>
        <span>🍴 {repo.forks}</span>
        <span>{repo.language}</span>
        <span className="px-2 py-0.5 bg-gray-800 text-gray-200 rounded">{repo.difficulty_level}</span>
      </div>

      <section className="mt-8">
        <h2 className="font-semibold mb-2">Open Issues ({issues.length})</h2>
        <div className="space-y-2">
          {issues.map((issue) => (
            <a
              key={issue.id}
              href={issue.url}
              target="_blank"
              rel="noreferrer"
              className="block border border-gray-800 bg-gray-900 rounded p-3 hover:bg-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-100">#{issue.number} {issue.title}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-200 rounded">{issue.difficulty_level}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{issue.labels.join(', ')}</div>
            </a>
          ))}
          {issues.length === 0 && <p className="text-gray-400 text-sm">No open issues synced yet.</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold mb-2">Files ({files.length})</h2>
        <div className="border border-gray-800 bg-gray-900 rounded max-h-64 overflow-y-auto text-sm font-mono text-gray-300">
          {files.slice(0, 100).map((file) => (
            <div key={file.path} className="px-3 py-1 border-b border-gray-800 last:border-0">
              {file.type === 'tree' ? '📁' : '📄'} {file.path}
            </div>
          ))}
        </div>
        {files.length > 100 && (
          <p className="text-xs text-gray-400 mt-1">Showing first 100 of {files.length} files.</p>
        )}
      </section>
    </div>
  );
}