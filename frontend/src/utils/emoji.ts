import { nameToEmoji } from 'gemoji';

const SHORTCODE_PATTERN = /:([+\-\w]+):/g;

export function toEmoji(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(
    SHORTCODE_PATTERN,
    (match, name: string) => nameToEmoji[name] ?? nameToEmoji[name.toLowerCase()] ?? match,
  );
}
