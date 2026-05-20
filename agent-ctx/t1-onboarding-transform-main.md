# Task: Transform t1 site into Sana AI-style onboarding micro-app

## Agent: Main Developer
## Task ID: t1-onboarding-transform

## Summary

Successfully transformed the t1 micro-site from a static scroll-site into a Sana AI-style onboarding micro-app with a multi-step flow and dashboard.

## Files Created

1. **`src/components/t1/onboarding/WelcomeGate.tsx`** — Full-screen immersive landing page
   - Split layout: 55% white content (left) / 45% dark visual (right)
   - "Artemis" logo (A box + text, no "2100")
   - Headline: "Imagine the future of learning"
   - CTA: "Begin the Journey" button with crimson background
   - Skip link: "Already explored? Go to dashboard →"
   - Right side: constellation of 6 dimension nodes with floating animation and crimson accents
   - Responsive: stacks vertically on mobile

2. **`src/components/t1/onboarding/IdentityStep.tsx`** — Identity selection step
   - Split layout: 50/50 content/visual
   - Back arrow, step indicator (Step 1 of 3), progress dots
   - 4 archetype cards: Explorer, Architect, Guardian, Voyager
   - Selectable cards with crimson border on hover/select
   - Continue button (disabled until selection)
   - Right side: dynamic visualization of selected archetype with glow effect

3. **`src/components/t1/onboarding/DimensionWalk.tsx`** — Dimension walkthrough step
   - Full screen, centered content, minimal UI
   - Step indicator "Step 2 of 3" + 6-segment progress bar
   - One dimension at a time: large faded number, name, description, icon
   - "Mark as explored" checkbox button
   - Previous/Next navigation
   - "Complete Onboarding" or "Skip to Dashboard" button on last dimension
   - Exports `dimensions` array for reuse

4. **`src/components/t1/dashboard/Dashboard.tsx`** — Dashboard after onboarding
   - Left sidebar (w-64, dark bg #0a0a0a):
     - Artemis logo, navigation items with icons
     - Dimensions section (expandable) with 6 sub-items
     - Badges, Build, About navigation
     - Progress indicator with crimson progress bar
     - "Upgrade your journey" link
     - Exit link
   - Main content area:
     - Top bar: search input, archetype badge, avatar
     - Renders based on sidebar selection
   - DashboardHome: welcome message, 3x2 dimension cards grid, progress stats, recent activity
   - BadgesPage: badge collection and certificates
   - Reuses existing page components (OpenLoopPage, PacedEducationPage, etc.)
   - Mobile responsive with sidebar overlay

5. **`src/components/t1/T1Site.tsx`** — Updated main router
   - Uses `useSyncExternalStore` for persisted state (no setState in effects)
   - State: phase (onboarding/dashboard), onboardingStep, selectedArchetype, exploredDimensions
   - localStorage persistence via external store pattern
   - Loading spinner during hydration
   - All handlers write to the external store
   - Clean flow: Welcome → Identity → Dimensions → Dashboard

6. **`src/app/globals.css`** — Added custom keyframe animations
   - `@keyframes float` — for constellation nodes
   - `@keyframes fadeIn` — for archetype visualization

## Design Rules Applied
- Crimson palette: #8A0000 primary, #0a0a0a dark bg, #ffffff white bg
- No "2100" anywhere — just "Artemis"
- Split-screen layouts for onboarding steps
- Clean typography with bold headlines
- Responsive design (stacks vertically on mobile)
- Uses `cn` utility from Shared.tsx
- Uses lucide-react for icons

## Build Status
- ✅ `npx next build` passes successfully
- ✅ No t1-specific lint errors
- ✅ Dev server compiles successfully
- ✅ Existing page files preserved (OpenLoopPage, etc.)

## Notes
- The `Blueprint` icon from lucide-react was replaced with `PencilRuler` (Blueprint doesn't exist in this version)
- The lint rule `react-hooks/set-state-in-effect` was strict, so a `useSyncExternalStore` pattern was used for localStorage persistence
- All existing page components are reused inside the dashboard's main content area
