export const difficultyStyles: Record<string, string> = {
  Beginner: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  Intermediate: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  Advanced: 'border-red-500/25 bg-red-500/10 text-red-300',
};

export const difficultyDots: Record<string, string> = {
  Beginner: 'bg-emerald-400',
  Intermediate: 'bg-amber-400',
  Advanced: 'bg-red-400',
};

export const difficultyText: Record<string, string> = {
  Beginner: 'text-emerald-300',
  Intermediate: 'text-amber-300',
  Advanced: 'text-red-300',
};

export const languageColors: Record<string, string> = {
  TypeScript: 'bg-sky-400',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-blue-400',
  Java: 'bg-orange-400',
  Go: 'bg-cyan-400',
  Rust: 'bg-orange-500',
  Ruby: 'bg-red-400',
  PHP: 'bg-violet-400',
  Swift: 'bg-orange-400',
  Kotlin: 'bg-violet-400',
  Dart: 'bg-sky-400',
  Shell: 'bg-emerald-400',
  Vue: 'bg-emerald-400',
  HTML: 'bg-orange-300',
  CSS: 'bg-blue-300',
  SCSS: 'bg-pink-400',
  C: 'bg-slate-400',
  'C++': 'bg-pink-400',
  'C#': 'bg-purple-400',
  'Jupyter Notebook': 'bg-orange-300',
};

export function languageColor(language: string | null | undefined): string | null {
  if (!language) return null;
  return languageColors[language] ?? 'bg-neutral-500';
}
