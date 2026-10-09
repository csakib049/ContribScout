import { useCallback, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { FileTreeItem } from '../types';
import {
  ancestorPaths,
  buildFileTree,
  collectFolderPaths,
  firstLevelFolders,
  flattenTree,
  pruneTree,
  filterTree,
  type TreeNode,
} from '../utils/fileTree';
import FileTreeNode from './FileTreeNode';
import { CollapseIcon, ExpandIcon, InboxIcon, SearchIcon, XIcon } from './icons';

interface Props {
  files: FileTreeItem[];
  repoUrl?: string;
}

export default function FileTree({ files, repoUrl }: Props) {
  const tree = useMemo(() => buildFileTree(files), [files]);
  const [userExpanded, setUserExpanded] = useState<Set<string>>(() => firstLevelFolders(tree));
  const [activePath, setActivePath] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const refs = useRef(new Map<string, HTMLDivElement | null>());

  const filter = useMemo(() => filterTree(tree, query), [tree, query]);
  const isFiltering = query.trim().length > 0;
  const displayTree = useMemo(
    () => (isFiltering ? pruneTree(tree, filter.visible) : tree),
    [isFiltering, tree, filter],
  );

  const expanded = useMemo(() => {
    if (!isFiltering) return userExpanded;
    const next = new Set(userExpanded);
    for (const path of filter.expanded) next.add(path);
    return next;
  }, [isFiltering, userExpanded, filter]);

  const flat = useMemo(() => flattenTree(displayTree, expanded), [displayTree, expanded]);

  const registerRef = useCallback((path: string, el: HTMLDivElement | null) => {
    if (el) refs.current.set(path, el);
    else refs.current.delete(path);
  }, []);

  const focusPath = useCallback((path: string) => {
    setActivePath(path);
    refs.current.get(path)?.focus();
  }, []);

  const toggle = useCallback((node: TreeNode) => {
    setUserExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.path)) next.delete(node.path);
      else next.add(node.path);
      return next;
    });
  }, []);

  const openFile = useCallback(
    (node: TreeNode) => {
      if (!repoUrl) return;
      const base = repoUrl.replace(/\/$/, '');
      window.open(`${base}/blob/HEAD/${node.path}`, '_blank', 'noopener,noreferrer');
    },
    [repoUrl],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (flat.length === 0) return;
    const index = flat.findIndex((entry) => entry.node.path === activePath);
    const current = index >= 0 ? flat[index].node : null;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (index === -1) focusPath(flat[0].node.path);
        else if (index < flat.length - 1) focusPath(flat[index + 1].node.path);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index === -1) focusPath(flat[flat.length - 1].node.path);
        else if (index > 0) focusPath(flat[index - 1].node.path);
        break;
      case 'ArrowRight':
        if (!current) break;
        event.preventDefault();
        if (current.type === 'tree') {
          if (!expanded.has(current.path)) toggle(current);
          else if (current.children.length > 0) focusPath(current.children[0].path);
        }
        break;
      case 'ArrowLeft': {
        if (!current) break;
        event.preventDefault();
        if (current.type === 'tree' && expanded.has(current.path)) {
          toggle(current);
        } else {
          const ancestors = ancestorPaths(current.path);
          const parent = ancestors[ancestors.length - 1];
          if (parent && refs.current.has(parent)) focusPath(parent);
        }
        break;
      }
      case 'Enter':
        if (!current) break;
        event.preventDefault();
        if (current.type === 'tree') toggle(current);
        else openFile(current);
        break;
      default:
        break;
    }
  }

  const total = files.length;

  return (
    <section className="flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-line bg-surface lg:max-h-[calc(100vh-7rem)]">
      <div className="border-b border-line p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
            Files
            <span className="rounded-full border border-line bg-elevated px-2 py-0.5 text-[11px] font-medium text-muted">
              {total}
            </span>
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setUserExpanded(collectFolderPaths(tree))}
              title="Expand all"
              aria-label="Expand all folders"
              className="rounded-md p-1.5 text-muted transition-colors duration-150 hover:bg-elevated hover:text-primary"
            >
              <ExpandIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setUserExpanded(new Set())}
              title="Collapse all"
              aria-label="Collapse all folders"
              className="rounded-md p-1.5 text-muted transition-colors duration-150 hover:bg-elevated hover:text-primary"
            >
              <CollapseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative mt-2">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter files..."
            aria-label="Filter files by name"
            autoComplete="off"
            spellCheck={false}
            className="h-8 w-full rounded-lg border border-line bg-canvas pl-8 pr-8 text-xs text-primary transition-colors placeholder:text-muted hover:border-line-strong focus:border-accent/60"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear filter"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted transition-colors hover:text-primary"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div
        role="tree"
        aria-label="Repository files"
        onKeyDown={handleKeyDown}
        className="tree-scroll min-h-0 flex-1 overflow-y-auto p-2"
      >
        {flat.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-10 text-center text-xs text-muted">
            <InboxIcon className="h-6 w-6" />
            <p className="mt-2">{isFiltering ? `No files match "${query.trim()}".` : 'No files available.'}</p>
          </div>
        ) : (
          flat.map((entry) => (
            <FileTreeNode
              key={entry.node.path}
              node={entry.node}
              depth={entry.depth}
              expanded={expanded.has(entry.node.path)}
              active={activePath === entry.node.path}
              tabIndex={entry.node.path === (activePath ?? flat[0].node.path) ? 0 : -1}
              highlight={query}
              onToggle={toggle}
              onOpen={openFile}
              onFocusPath={setActivePath}
              registerRef={registerRef}
            />
          ))
        )}
      </div>

      <div className="border-t border-line px-3 py-1.5 text-[11px] text-muted" aria-live="polite">
        {flat.length} of {total} shown
      </div>
    </section>
  );
}
