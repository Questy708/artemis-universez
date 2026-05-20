# Task s3: Add 6 New Artifacts to DarwinVoyagePage

## Work Log

- Read worklog.md to understand project context (previous tasks: Artemis 2100 rebuild, t1 clone, Achievement section conversions)
- Read existing DarwinVoyagePage.tsx (509 lines) fully
- Read Shared.tsx to understand available components (SectionHeading, HeroHeader, ExploreAnotherFuture, Timeline, HeadlinesFrom2100, StatsBar)
- Added `useState` import from React for interactive map hover state
- Added shared component imports: `Timeline`, `HeadlinesFrom2100`, `StatsBar` and `TimelineEvent` type
- Added data constants for new sections: `rotationStats`, `fieldNotebooks`, `specimens`, `voyageTimeline`, `voyageHeadlines`, `anchorCities`
- Implemented all 6 new artifacts:

### 1. Live Rotation Tracker (#1)
- Replaced static SVG map circles with interactive anchor city dots (r=8)
- Added `hoveredCity` state via `useState<string | null>(null)`
- Each anchor city circle has `onMouseEnter`/`onMouseLeave` handlers
- Hover effect: scale(1.35), glow drop-shadow, color change, stroke highlight
- Tooltip rendered via SVG `foreignObject` with city name (bold), leg number/name, duration, and key detail
- Tooltip auto-positions left when near right edge, up when near bottom
- Legend updated to say "Anchor City (hover for details)"

### 2. Rotation Stats Dashboard (#8)
- Added StatsBar section after Summary, before "Two Lineages"
- Section heading: "By the Numbers"
- Stats: 2,400+ Active Learners, 48 Anchor Cities, 340+ Specimens Produced, 12 Community Vetoes Exercised

### 3. Field Notebook Excerpts (#13)
- Added after "The Five Legs", before "The Rotation Protocol"
- 3 styled notebook page cards in a 3-column grid
- Styling: `bg-[#faf8f5]`, dashed border, serif italic text, mono date stamp, alternating `rotate(-0.5deg)`, notebook line background pattern via repeating-linear-gradient

### 4. Specimen Gallery (#15)
- Added after "The Rotation Protocol", before "The Achievement"
- 2x3 grid (responsive: 1→2→3 columns)
- Each card: category tag in monospace crimson, bold title, anchor city + year in mono, italic result line
- Hover effect: border changes to crimson

### 5. Timeline (#7)
- Added between "The Achievement" and "Dispatches from 2100"
- Uses shared `Timeline` component with 7 events (2014-2100)
- Section heading: "Voyage Timeline"

### 6. Headlines from 2100 (#16)
- Added after Timeline, before "Exhibit Article Archive"
- Section heading: "Dispatches from 2100"
- Uses shared `HeadlinesFrom2100` component with 5 headlines

## Verification
- No lint errors in DarwinVoyagePage.tsx
- All existing content preserved unchanged
- Dev server compiles successfully
