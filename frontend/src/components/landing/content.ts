export const API_URL = import.meta.env.VITE_API_URL;

export const SIGN_IN_URL = `${API_URL}/auth/github`;
export const GITHUB_REPO_URL = 'https://github.com/csakib049/contribscout';

export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Author', href: '#author' },
] as const;

export const hero = {
  pill: 'Find your next open-source contribution',
  titleLead: 'Find open-source projects you can ',
  titleHighlight: 'actually contribute to',
  subtitle:
    'ContribScout lists GitHub repositories with open issues and tags each with a difficulty level, so you spend your time contributing instead of searching.',
  helper: 'Free and open source. Sign in with GitHub to bookmark repositories.',
} as const;

export const features = [
  {
    key: 'browse',
    title: 'Browse and search',
    description: 'Browse GitHub repositories and search to narrow them down.',
  },
  {
    key: 'difficulty',
    title: 'Difficulty at a glance',
    description:
      'Every repository and issue carries a difficulty badge, so you can pick work that fits your level.',
  },
  {
    key: 'inspect',
    title: 'Look before you leap',
    description:
      'Read open issues, filter them by title or label, and explore the file tree without leaving the page.',
  },
  {
    key: 'save',
    title: 'Save for later',
    description: 'Bookmark repositories and come back to them from My Bookmarks.',
  },
] as const;

export const steps = [
  {
    number: '1',
    title: 'Explore',
    description: 'Browse or search repositories.',
  },
  {
    number: '2',
    title: 'Choose',
    description: 'Pick one that matches your level using the difficulty badge.',
  },
  {
    number: '3',
    title: 'Contribute',
    description:
      'Read the open issues, check the code structure, then open the repository on GitHub and start.',
  },
] as const;

export const preview = {
  heading: 'See it in action',
  subtitle:
    'Search repositories, filter by difficulty, and open any project to inspect its issues and files.',
} as const;

export const author = {
  name: 'Md. Sakib Chowdhury',
  blurb: 'ContribScout is a personal open-source project. Feedback is welcome.',
  avatarUrl: 'https://github.com/csakib049.png',
  initials: 'SC',
  links: [
    { label: 'GitHub', href: 'https://github.com/csakib049', icon: 'github' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/md-sakib-chowdhury-3990791a8/',
      icon: 'linkedin',
    },
    { label: 'Email', href: 'mailto:csakib049@gmail.com', icon: 'mail' },
    {
      label: 'Discord',
      href: 'https://discordapp.com/users/1081408248197939363',
      icon: 'discord',
    },
    { label: 'Instagram', href: 'https://www.instagram.com/s_a_a_k_i_b/', icon: 'instagram' },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/muntasir.sakib.376/',
      icon: 'facebook',
    },
  ],
  sourceLabel: 'View source on GitHub',
  sourceHref: GITHUB_REPO_URL,
} as const;

export type AuthorIcon = (typeof author.links)[number]['icon'];

export const finalCta = {
  heading: 'Ready to find your first contribution?',
  subtitle:
    'Browse repositories with open issues, pick a difficulty that fits, and start contributing.',
} as const;

export const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Author', href: '#author' },
  { label: 'Source code', href: GITHUB_REPO_URL, external: true },
] as const;
