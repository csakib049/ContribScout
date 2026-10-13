# Hyperframes Composition Brief: ContribScout

## Objective
Create a concise, polished product-launch brag video that demonstrates how ContribScout takes someone from an open-source search to an issue they can inspect and pursue.

## Output
- Composition directory: `brag-output-2026-10-13-152808/composition/`
- Rendered video: `brag-output-2026-10-13-152808/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20.2 seconds

## Source Material
- Project root: `D:/ContribScout`
- Primary files read: `README.md`, `frontend/index.html`, `frontend/src/components/landing/content.ts`, `frontend/src/components/landing/Hero.tsx`, `frontend/src/pages/ExplorePage.tsx`, `frontend/src/pages/RepositoryDetailsPage.tsx`, `frontend/src/pages/BookmarksPage.tsx`, `frontend/src/components/RepoCard.tsx`, `frontend/src/index.css`
- Product name: ContribScout
- Tagline / strongest claim: “Find open-source projects you can actually contribute to”
- Key UI to recreate: searchable repository cards and difficulty filters; then repository details with open issues and a file tree.
- Copy that must appear verbatim:
  - “Find open-source projects you can actually contribute to.”
  - “Your next contribution starts here.”
  - “Start exploring.”
- Use fictional signed-out chrome and plausible repository examples. Do not show personal usernames, account avatars, email addresses, or private data.

## Creative Direction
- Tone preset: polished
- Creative direction: a considered, modern product film that makes open-source discovery feel approachable and concrete
- Interpretation: restrained, deliberate movement, generous type scale, crisp interface detail, and one clear action per scene.
- Angle: replace the noisy hunt for a first issue with one clear path through the real ContribScout flow: browse, choose by difficulty, inspect the issue and code structure, and continue on GitHub.
- Hook: repository fragments and tab slivers collapse into a single search field as the viewer reads, “You want to contribute. Where do you start?”
- Outro: “Your next contribution starts here.” followed by ContribScout and “Start exploring.”
- Avoid: generic SaaS language; unsupported guarantees about difficulty tags; abstract filler; personal account data; redesigning the brand.

## Visual Identity
- Background: `#0a0a0a`
- Text: `#fafafa`
- Accent: cyan `#06b6d4`; existing CTA blue `#2563eb`; difficulty accents green `#34d399`, amber `#fbbf24`, red `#f87171`
- Display font: Quicksand (prefer a local copy if available; otherwise use a safe rounded sans fallback and report the limitation)
- Body font: Quicksand with a system sans fallback
- Visual references: the ContribScout logo mark, dark repo cards, cyan search/action color, colored difficulty badges, split issues/file-tree detail screen.

## Storyboard
Use `brag-plan.md` as the creative contract.

1. The search — 3.2s — messy repo fragments resolve into a typed search field; readable opening question.
2. A clearer starting point — 3.0s — logo/wordmark and exact hero promise.
3. Choose your level — 4.5s — framed Explore UI, card stagger, Beginner filter interaction.
4. Inspect before you jump in — 5.5s — repository header, open issue list, filtered issue, expanding file tree.
5. Take the next step — 4.0s — amber bookmark click, brand resolution, final CTA.

## Audio
- Audio role: polished warm bed with sparse, motion-matched interface accents.
- Audio arc: steady and inviting; soft introduction, tactile product interactions, controlled fade beneath the final logo.
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: about 0.30 gain, subtle fade-in and one-second fade-out.
- Music cue guidance: bundled preset `C:/Users/Shakib/.codex/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.md`; target 8.74s for the catalog arrival and 17.47s for the final brand beat, only if readability and pacing remain natural.
- Audio-reactive treatment: subtle breathing of the existing cyan ambient glow only; no waveform or generic particle visuals.
- Audio-coupled moments: short search typing, difficulty selection, bookmark click, mark reveal.
- SFX selection guidance: a few soft keyboard/UI/folder cues and a restrained reveal accent; no continuous or per-card sound spam.
- SFX analysis guidance: `C:/Users/Shakib/.codex/skills/brag/assets/sfx/sfx-analysis.md`
- Exact SFX choice: choose after the visuals exist; keep the track indices unique where cues overlap.
- Audio files: copy the chosen track and SFX to `composition/assets/` and reference them with composition-relative paths.
- Voiceover: disabled; do not create narration or voice audio.

## Hyperframes Instructions
Use native Hyperframes conventions and a single deterministic, paused timeline. Build scene changes and interaction choreography entirely from seekable timeline state; no wall-clock timers, network dependencies, or randomness. Show the actual product flow (represented with plausible sample content) in at least two scenes. Maintain legible large type at 1920×1080 and preserve the dark/cyan brand. Run `npx hyperframes check` and fix all errors before opening the preview. Do not render until the user approves the final preview.

## Review Notes
- 2026-10-13: Keep the opening “Open source is full of possibility.” line stationary; Studio keyframes had moved it up and sideways into the headline. Set it to a single 38px eyebrow at y=260, moved the headline to y=355, kept supporting copy at y=670, and sent the decorative search fragments rightward so they cannot cover the eyebrow.
