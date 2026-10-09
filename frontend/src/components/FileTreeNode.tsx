import type { ReactNode } from 'react';
import type { TreeNode } from '../utils/fileTree';
import { fileKind } from '../utils/fileTree';
import {
  ChevronRightIcon,
  FileCodeIcon,
  FileCogIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
} from './icons';

interface Props {
  node: TreeNode;
  depth: number;
  expanded: boolean;
  active: boolean;
  tabIndex: number;
  highlight?: string;
  onToggle: (node: TreeNode) => void;
  onOpen: (node: TreeNode) => void;
  onFocusPath: (path: string) => void;
  registerRef: (path: string, el: HTMLDivElement | null) => void;
}

const kindStyles: Record<ReturnType<typeof fileKind>, { icon: typeof FileIcon; className: string }> = {
  markdown: { icon: FileTextIcon, className: 'text-sky-300' },
  config: { icon: FileCogIcon, className: 'text-violet-300' },
  code: { icon: FileCodeIcon, className: 'text-amber-300' },
  image: { icon: FileImageIcon, className: 'text-emerald-300' },
  default: { icon: FileIcon, className: 'text-muted' },
};

function highlightName(name: string, term?: string): ReactNode {
  const query = term?.trim().toLowerCase();
  if (!query) return name;
  const index = name.toLowerCase().indexOf(query);
  if (index === -1) return name;
  return (
    <>
      {name.slice(0, index)}
      <mark className="rounded bg-cyan-500/25 px-0.5 text-primary">
        {name.slice(index, index + query.length)}
      </mark>
      {name.slice(index + query.length)}
    </>
  );
}

export default function FileTreeNode({
  node,
  depth,
  expanded,
  active,
  tabIndex,
  highlight,
  onToggle,
  onOpen,
  onFocusPath,
  registerRef,
}: Props) {
  const isFolder = node.type === 'tree';
  const { icon: Icon, className: iconClass } = isFolder
    ? { icon: expanded ? FolderOpenIcon : FolderIcon, className: 'text-cyan-300/80' }
    : kindStyles[fileKind(node.name)];

  function handleActivate() {
    if (isFolder) onToggle(node);
    else onOpen(node);
  }

  return (
    <div
      ref={(el) => registerRef(node.path, el)}
      role="treeitem"
      aria-level={depth + 1}
      aria-expanded={isFolder ? expanded : undefined}
      aria-selected={active || undefined}
      tabIndex={tabIndex}
      data-path={node.path}
      onClick={handleActivate}
      onFocus={() => onFocusPath(node.path)}
      title={node.name}
      className={`relative flex h-7 cursor-pointer select-none items-center gap-1.5 rounded-md pr-2 text-[13px] transition-colors duration-100 ${
        active
          ? 'bg-elevated text-primary ring-1 ring-inset ring-line-strong'
          : 'text-secondary hover:bg-elevated/70 hover:text-primary'
      }`}
      style={{ paddingLeft: depth * 16 + 8 }}
    >
      {Array.from({ length: depth }).map((_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-0 w-px bg-line/80"
          style={{ left: index * 16 + 16 }}
        />
      ))}

      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {isFolder ? (
          <ChevronRightIcon
            className={`h-3.5 w-3.5 text-muted transition-transform duration-150 ${
              expanded ? 'rotate-90' : ''
            }`}
          />
        ) : (
          <span className="h-3.5 w-3.5" />
        )}
      </span>

      <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />

      <span className="min-w-0 flex-1 truncate font-mono">{highlightName(node.name, highlight)}</span>
    </div>
  );
}
