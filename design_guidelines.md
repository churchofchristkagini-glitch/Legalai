# NaijaLaw AI Chat - Design Guidelines

## Design Approach
**Hybrid System**: Material Design foundation with custom legal-focused components. Drawing inspiration from Claude AI's clean chat interface, Notion's information hierarchy, and Linear's sophisticated professionalism. The design must convey authority, trustworthiness, and cutting-edge AI capability while remaining accessible to Nigerian legal professionals.

## Core Design Principles
1. **Professional Authority**: Visual design reinforces credibility in legal context
2. **Information Clarity**: Dense legal content must remain scannable and digestible
3. **Intelligent Hierarchy**: AI responses, citations, and sources need clear visual distinction
4. **Nigerian Context**: Culturally appropriate while maintaining global design standards

## Color Palette

**Light Mode:**
- Primary: 142 71% 45% (Nigerian green - professional, trustworthy)
- Secondary: 142 45% 35% (deeper green for accents)
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white cards)
- Text Primary: 0 0% 13%
- Text Secondary: 0 0% 40%
- Border: 0 0% 90%
- Citation Card: 142 25% 95% (subtle green tint)
- Warning/Enterprise: 25 95% 53% (amber for premium features)

**Dark Mode:**
- Primary: 142 60% 55%
- Secondary: 142 50% 45%
- Background: 0 0% 7%
- Surface: 0 0% 11%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%
- Border: 0 0% 20%
- Citation Card: 142 15% 15%

## Typography
**Fonts (via Google Fonts):**
- Primary: Inter (UI, body text) - 400, 500, 600, 700
- Code/Citations: JetBrains Mono (case citations, statute references) - 400, 500

**Scale:**
- Display: text-4xl to text-6xl (landing hero, empty states)
- Heading 1: text-3xl font-semibold (page titles)
- Heading 2: text-2xl font-semibold (section headers)
- Heading 3: text-xl font-medium (card titles, chat headers)
- Body: text-base (main content)
- Small: text-sm (metadata, timestamps)
- Tiny: text-xs (labels, badges)

## Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-6
- Section spacing: space-y-8 to space-y-12
- Container margins: my-12 to my-20
- Card gaps: gap-4 to gap-6

**Grid System:**
- Main container: max-w-7xl mx-auto
- Chat interface: max-w-4xl mx-auto (centered, readable)
- Dashboard: 12-column grid with responsive breakpoints
- Sidebar: fixed 280px (desktop), slide-over (mobile)

## Component Library

### Navigation & Shell
**Top Navigation:**
- Fixed header with blur backdrop (backdrop-blur-lg bg-background/80)
- Logo left, user menu/subscription badge right
- Height: h-16
- Shadow on scroll: subtle bottom border

**Sidebar:**
- Collapsible on desktop, slide-over on mobile
- Chat history with infinite scroll
- Saved items, practice areas, recent statutes
- Subscription tier badge at bottom with upgrade CTA

### Chat Interface (Core Experience)
**Message Bubbles:**
- User messages: aligned right, primary green background, white text
- AI responses: aligned left, surface background, subtle border
- Generous padding: px-6 py-4
- Rounded corners: rounded-2xl
- Max width: prose (optimal reading)

**Citation Cards:**
- Floating cards within AI responses
- Border-l-4 with primary color accent
- Hover state: slight elevation (shadow-md)
- Clickable metadata: case name, year, court
- Icon: scale/gavel using Heroicons

**Input Box:**
- Floating design at bottom: sticky bottom-4
- Elevated shadow: shadow-2xl
- Rounded: rounded-3xl
- Multi-line textarea with auto-expand
- Send button: primary green, icon-only
- Attachment button for document upload
- Voice input button (microphone icon)

### Dashboard Components
**Stat Cards:**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- White/surface background with subtle border
- Large numeric display with trend indicators
- Icon in colored circle (primary/secondary/amber)

**Subscription Status:**
- Prominent card showing current tier
- Progress bar for usage limits (queries, storage)
- Upgrade CTA for lower tiers
- Feature comparison table on hover/click

**Document Library:**
- Card-based grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Document thumbnail/type icon
- Title, upload date, size
- Quick actions: view, share, delete
- Filter/search bar with faceted search

### Legal-Specific Components
**Case Brief Card:**
- Structured layout with clear sections
- Facts | Issues | Holding | Ratio Decidendi
- Collapsible sections with smooth transitions
- Export button (PDF/DOCX icons)
- Citation button to copy formatted reference

**Statute Navigator:**
- Tree view for sections/subsections
- Expandable/collapsible hierarchy
- Search with highlight in context
- Cross-reference links as pills/badges
- Amendment timeline with visual indicators

**Comparison View:**
- Split-pane layout: 50/50 or adjustable
- Synchronized scrolling option
- Highlighting for differences
- Side-by-side case metadata headers

### Admin Dashboard
**User Management Table:**
- Sortable columns, pagination
- Role badges with color coding
- Inline actions: edit, suspend, delete
- Bulk actions toolbar
- Advanced filters panel

**CRUD Forms:**
- Multi-step for complex entities (subscription plans)
- Clear validation feedback
- Auto-save drafts for long forms
- Preview mode before submission

### Marketing/Landing Page
**Hero Section:**
- Full-width with gradient overlay on legal imagery (Supreme Court, legal books)
- Large heading: "AI-Powered Legal Research for Nigerian Lawyers"
- Subheading emphasizing Nigerian law expertise
- Dual CTA: "Start Free" (primary) + "See Demo" (outline with blur backdrop)
- Trust indicators: "Trusted by 500+ Legal Professionals" with logos

**Features Grid:**
- 3-column on desktop: grid-cols-1 md:grid-cols-3
- Feature cards with icons (Heroicons: document-search, light-bulb, chart-bar)
- Hover elevation effect
- "Free" / "Pro" / "Enterprise" badges on tier-specific features

**Pricing Table:**
- 3-column comparison
- Highlight "Pro" as recommended
- Feature checklist with checkmarks
- Paystack integration for checkout
- Annual/monthly toggle

**Social Proof:**
- Testimonial carousel with lawyer photos
- Case study cards showcasing results
- Integration logos: OpenAI, Supabase, Paystack

**Footer:**
- Multi-column: Company | Features | Resources | Legal
- Newsletter signup with incentive
- Social links, contact info
- Nigerian legal compliance statements

## Animations (Minimal & Purposeful)
- Page transitions: fade-in (duration-200)
- Sidebar slide: transform-translate (duration-300)
- Chat messages: slide-up on appear (duration-200)
- Citation cards: subtle scale on hover (scale-102)
- No decorative animations - focus on functional feedback

## Images

**Hero Image:**
- Large background: Nigerian Supreme Court or modern law library
- Subtle gradient overlay (primary green to transparent)
- High-quality, professional photography
- Mobile: reduced height, focus on focal point

**Feature Section Images:**
- Screenshot mockups of AI chat in action
- Case comparison side-by-side view
- Document upload flow visualization
- Dashboard analytics preview

**Testimonials:**
- Professional headshots of Nigerian lawyers
- Circular crops with subtle border
- Placed left of testimonial text

**About/Team (if applicable):**
- Team photos in consistent style
- Office/workspace imagery showing Nigerian context

## Accessibility & Polish
- WCAG AA contrast ratios minimum
- Focus states: ring-2 ring-primary with offset
- Keyboard navigation throughout
- Screen reader labels on icon-only buttons
- Skip-to-content links
- Consistent dark mode across all inputs and components
- Loading states: skeleton screens for content-heavy sections
- Empty states: friendly illustrations with actionable CTAs