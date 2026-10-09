import type { FileTreeItem } from '../types';

export interface TreeNode {
  name: string;
  path: string;
  type: 'tree' | 'blob';
  children: TreeNode[];
}

export interface FlatNode {
  node: TreeNode;
  depth: number;
}

export type FileKind = 'markdown' | 'config' | 'code' | 'image' | 'default';

const CONFIG_EXT = new Set([
  'yml', 'yaml', 'json', 'jsonc', 'toml', 'ini', 'cfg', 'conf', 'env',
  'properties', 'lock', 'editorconfig', 'gitignore', 'npmrc', 'babelrc',
]);

const CODE_EXT = new Set([
  'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'py', 'rb', 'go', 'rs', 'java',
  'kt', 'kts', 'swift', 'c', 'h', 'cc', 'cpp', 'hpp', 'cs', 'php', 'sh',
  'bash', 'zsh', 'fish', 'sql', 'vue', 'svelte', 'html', 'htm', 'css',
  'scss', 'sass', 'less', 'dart', 'lua', 'r', 'pl', 'ex', 'exs', 'clj',
]);

const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp', 'avif']);

const MARKDOWN_EXT = new Set(['md', 'markdown', 'mdx']);

export function fileKind(name: string): FileKind {
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf('.');
  const ext = dot > 0 ? lower.slice(dot + 1) : lower;

  if (MARKDOWN_EXT.has(ext)) return 'markdown';
  if (CONFIG_EXT.has(ext)) return 'config';
  if (IMAGE_EXT.has(ext)) return 'image';
  if (CODE_EXT.has(ext)) return 'code';
  return 'default';
}

function sortNodes(nodes: TreeNode[]): void {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'tree' ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
  for (const node of nodes) {
    if (node.children.length) sortNodes(node.children);
  }
}

export function buildFileTree(items: FileTreeItem[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', type: 'tree', children: [] };
  const dirs = new Map<string, TreeNode>([['', root]]);

  for (const item of items) {
    const segments = item.path.split('/').filter(Boolean);
    if (segments.length === 0) continue;

    let parent = root;
    let parentPath = '';

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      const currentPath = parentPath ? `${parentPath}/${segment}` : segment;
      let dir = dirs.get(currentPath);
      if (!dir) {
        dir = { name: segment, path: currentPath, type: 'tree', children: [] };
        dirs.set(currentPath, dir);
        parent.children.push(dir);
      }
      parent = dir;
      parentPath = currentPath;
    }

    const name = segments[segments.length - 1];

    if (item.type === 'tree') {
      if (!dirs.has(item.path)) {
        const dir: TreeNode = { name, path: item.path, type: 'tree', children: [] };
        dirs.set(item.path, dir);
        parent.children.push(dir);
      }
      continue;
    }

    if (!parent.children.some((child) => child.path === item.path && child.type === 'blob')) {
      parent.children.push({ name, path: item.path, type: 'blob', children: [] });
    }
  }

  sortNodes(root.children);
  return root.children;
}

export function firstLevelFolders(nodes: TreeNode[]): Set<string> {
  const paths = new Set<string>();
  for (const node of nodes) {
    if (node.type === 'tree') paths.add(node.path);
  }
  return paths;
}

export function collectFolderPaths(nodes: TreeNode[], out = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.type === 'tree') {
      out.add(node.path);
      if (node.children.length) collectFolderPaths(node.children, out);
    }
  }
  return out;
}

export function ancestorPaths(path: string): string[] {
  const parts = path.split('/');
  parts.pop();
  const result: string[] = [];
  let acc = '';
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part;
    result.push(acc);
  }
  return result;
}

export interface FilterResult {
  visible: Set<string>;
  expanded: Set<string>;
}

export function filterTree(nodes: TreeNode[], term: string): FilterResult {
  const visible = new Set<string>();
  const expanded = new Set<string>();
  const query = term.trim().toLowerCase();
  if (!query) return { visible, expanded };

  const markSubtree = (node: TreeNode): void => {
    visible.add(node.path);
    if (node.type === 'tree') {
      expanded.add(node.path);
      for (const child of node.children) markSubtree(child);
    }
  };

  const walk = (list: TreeNode[]): boolean => {
    let anyMatch = false;
    for (const node of list) {
      const nameMatch = node.name.toLowerCase().includes(query);
      const childMatch = node.children.length > 0 ? walk(node.children) : false;

      if (nameMatch && node.type === 'tree') {
        markSubtree(node);
        anyMatch = true;
        continue;
      }

      if (nameMatch || childMatch) {
        visible.add(node.path);
        if (node.type === 'tree') expanded.add(node.path);
        anyMatch = true;
      }
    }
    return anyMatch;
  };

  walk(nodes);
  return { visible, expanded };
}

export function pruneTree(nodes: TreeNode[], visible: Set<string>): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    if (!visible.has(node.path)) continue;
    const children = node.children.length > 0 ? pruneTree(node.children, visible) : node.children;
    result.push(children === node.children ? node : { ...node, children });
  }
  return result;
}

export function flattenTree(
  nodes: TreeNode[],
  expanded: Set<string>,
  depth = 0,
  out: FlatNode[] = [],
): FlatNode[] {
  for (const node of nodes) {
    out.push({ node, depth });
    if (node.type === 'tree' && expanded.has(node.path) && node.children.length > 0) {
      flattenTree(node.children, expanded, depth + 1, out);
    }
  }
  return out;
}
