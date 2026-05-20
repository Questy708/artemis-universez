'use client';

import { useState } from "react";
import { Play } from "lucide-react";
import { SectionHeading, HeroHeader, ExploreAnotherFuture, Timeline, HeadlinesFrom2100, StatsBar } from "../Shared";
import type { TimelineEvent } from "../Shared";

/* ─── Voyage Rotation Data ─── */
const voyageLegs = [
  {
    num: 'I',
    name: 'The Atlantic Awakening',
    region: 'West Africa → Brazil → Caribbean',
    years: '2035–2042',
    desc: 'The first rotation sent learners along the routes of the Atlantic world — not as tourists, but as witnesses. They traced the arcs of forced migration, resistance, and cultural synthesis that shaped the modern Atlantic. In Lagos, they studied urban innovation in the world\'s fastest-growing cities. In Salvador, they examined how Yoruba spiritual systems survived the Middle Passage and reinvented themselves as Candomblé. In Port-au-Prince, they witnessed the unfinished revolution — the first Black republic still fighting the consequences of its liberation. The Atlantic Awakening was not comfortable. It was not meant to be.',
    anchor: 'Lagos · Salvador · Port-au-Prince',
    duration: '12–18 months',
  },
  {
    num: 'II',
    name: 'The Indian Ocean Circuit',
    region: 'East Africa → South Asia → Southeast Asia',
    years: '2043–2051',
    desc: 'The second rotation followed the monsoon routes that for millennia connected Zanzibar to Kerala, Mogadishu to Mumbai, Mombasa to Malacca. Learners studied how the ocean — not the land — was the true connective tissue of civilizations. In Zanzibar, they mapped the remains of the spice trade and the architecture of cosmopolitan coexistence. In Kerala, they investigated how ancient mathematical traditions prefigured modern computing. In Jakarta, they witnessed the collision of megacity growth and subsidence — a civilization building upward while its ground sank below sea level.',
    anchor: 'Zanzibar · Kochi · Jakarta',
    duration: '12–24 months',
  },
  {
    num: 'III',
    name: 'The Pacific Archipelago',
    region: 'Oceania → Japan → Pacific Islands',
    years: '2052–2060',
    desc: 'The Pacific was Darwin\'s crucible — the Galápagos taught him that isolation breeds adaptation. Artemis learners discovered the same principle in human systems. In Fiji, they studied how small island states became laboratories for climate adaptation, pioneering floating infrastructure and community-governed marine reserves. In Osaka, they examined how density bred innovation — a civilization that had learned to do more with less for centuries. In Samoa, they encountered the Fa\'a Samoa, a governance system that predated Western democracy by millennia and offered radical alternatives to representation and decision-making.',
    anchor: 'Suva · Osaka · Apia',
    duration: '10–18 months',
  },
  {
    num: 'IV',
    name: 'The Continental Traverse',
    region: 'Southern Africa → Andes → Mediterranean',
    years: '2061–2070',
    desc: 'The fourth rotation crossed landmasses — tracing the Great Rift Valley from Johannesburg to Addis Ababa, scaling the Andes from Patagonia to Bogotá, and navigating the Mediterranean from Tangier to Athens. Learners were transformed by the sheer verticality of human adaptation, by the ingenuity of communities building at altitude, by the coexistence of ancient agricultural wisdom and quantum computing labs in the same valley. The Continental Traverse taught that the world\'s most important knowledge is not in any one place — it is in the movement between places.',
    anchor: 'Johannesburg → Addis Ababa · Patagonia → Bogotá · Tangier → Athens',
    duration: '18–36 months',
  },
  {
    num: 'V',
    name: 'The Circumpolar Return',
    region: 'Arctic → Antarctic → Equator',
    years: '2071–2082',
    desc: 'The final rotation went to the poles. In Svalbard, learners studied the Global Seed Vault and the ethics of preserving biodiversity in frozen chambers. In Antarctica, they witnessed the only continent governed by scientific treaty rather than sovereign claim — a living experiment in collective governance. In the equatorial return, they came full circle, applying polar lessons to tropical urgency. The Circumpolar Return was the most demanding rotation — extreme conditions, extreme isolation, extreme beauty. Those who completed it carried a perspective that no classroom could ever provide: the view from above, the planet as a single system, the fragility and resilience of a world learning to sustain itself.',
    anchor: 'Svalbard · McMurdo · Quito',
    duration: '12–24 months',
  },
];

/* ─── Two Lineages, One Framework ─── */
const dualLineage = [
  {
    source: 'Minerva\'s Global Rotation',
    icon: 'M',
    principles: [
      { name: 'No Campus, Only Cities', desc: 'Minerva University proved that a university could exist without a campus — its students rotated through seven cities over four years, each location becoming both classroom and laboratory. The city was not a backdrop; it was the curriculum. Artemis adopted this principle and scaled it: not seven cities, but entire oceanic and continental circuits, each rotation leg lasting up to three years rather than a semester.' },
      { name: 'Sequential Immersion', desc: 'Minerva\'s rotation was not random — each city was chosen to build on the previous one, creating a cumulative learning arc. Artemis refined this into the Voyage Rotation: the Atlantic Awakening preceded the Indian Ocean Circuit because the history of forced migration demanded understanding before the study of voluntary trade routes. The Pacific followed because isolation could only be understood after connection. The sequence was pedagogy.' },
      { name: 'Location as Pedagogy', desc: 'At Minerva, the city was not supplementary to the curriculum — it was integral. Students in Berlin studied the architecture of memory; students in Buenos Aires examined the economics of recovery. Artemis made this principle absolute: each anchor city was selected because the problems it contained could not be understood anywhere else. Lagos could not teach what Kyoto taught. Svalbard could not teach what Salvador taught. The location was the lesson.' },
    ],
  },
  {
    source: 'Darwin\'s Voyages',
    icon: 'D',
    principles: [
      { name: 'Observation Before Theory', desc: 'Darwin spent five years observing before publishing a single word. The Voyage Rotation demanded the same: learners must spend a minimum of three months in immersive observation at each anchor before proposing any hypothesis or intervention. At Artemis, this became the "Slow Knowing" doctrine — the radical insistence that understanding must precede action, that the urgency to solve must never outpace the commitment to comprehend.' },
      { name: 'Variation as Insight', desc: 'Darwin\'s breakthrough came not from finding what was the same, but from cataloguing what was different — the finches, the tortoises, the mockingbirds. Variation was not noise; it was signal. The Voyage Rotation trained learners to seek variation across cultures, ecosystems, and knowledge systems. A solution that works in Quito may fail in Lagos — and that failure is data, not defeat.' },
      { name: 'The Voyage as Method', desc: 'Darwin did not understand natural selection in a laboratory. He understood it on a ship, in a storm, on a volcanic island, in conversation with a gaúcho. The method was the journey itself. The Voyage Rotation was not preparation for the real world — it was the real world. Every rotation leg produced publishable research, deployable solutions, and irrevocably changed perspectives.' },
    ],
  },
];

/* ─── The Rotation Protocol ─── */
const rotationProtocol = [
  {
    phase: 'A',
    name: 'Docking',
    duration: '3–6 months',
    desc: 'Learners arrive at an anchor city and spend a minimum of three months in immersive observation. No interventions, no proposals, no solutions. The Docking phase demands humility: listen, watch, map, question. Live in the community. Eat the food. Learn the language — not Duolingo proficiency, but the language of the streets, the markets, the council chambers. The Docking phase produces a Field Notebook — a detailed ethnographic and ecological record that becomes the foundation for all subsequent work.',
    output: 'Field Notebook',
  },
  {
    phase: 'B',
    name: 'Surveying',
    duration: '3–9 months',
    desc: 'With the Field Notebook as guide, learners begin systematic inquiry — partnering with local institutions, conducting research, testing hypotheses against the reality they have now come to understand. Surveying teams are always mixed: at least one local collaborator for every visiting learner. The power dynamic is explicit: local partners hold veto authority over any project. Surveying produces Working Papers — draft analyses that must be reviewed by both academic and community panels before proceeding.',
    output: 'Working Papers',
  },
  {
    phase: 'C',
    name: 'Specimen',
    duration: '3–9 months',
    desc: 'The final phase produces a Specimen — a concrete, deployable contribution. It might be a technology, a policy framework, a work of art, a community infrastructure project, or a published research paper. Every Specimen must meet dual criteria: epistemic rigour (it must be true) and civic impact (it must matter). Specimens are presented at the annual Voyage Convocation — a gathering of all rotating learners, faculty, and community partners that became one of the most important knowledge events in the world.',
    output: 'Voyage Convocation',
  },
];

/* ─── Stats Data ─── */
const rotationStats = [
  { value: '2,400+', label: 'Active Learners' },
  { value: '48', label: 'Anchor Cities' },
  { value: '340+', label: 'Specimens Produced' },
  { value: '12', label: 'Community Vetoes Exercised' },
];

/* ─── Field Notebook Data ─── */
const fieldNotebooks = [
  {
    location: 'Lagos, 2037',
    author: 'Amara Okafor',
    text: 'Day 47. Makoko teaches what no classroom can: that the most sophisticated infrastructure is not steel and concrete but trust and adaptability. The floating school moves with the tide — and so does its curriculum. I have stopped taking notes on what they lack and started recording what they have. The gap between my training and their reality has never been wider.',
  },
  {
    location: 'Zanzibar, 2046',
    author: 'Rafiq Hamza',
    text: 'The dhow builders do not use blueprints. They use embodied knowledge passed from father to son for 800 years. When I asked about the keel angle, they looked at me as if I had asked a bird to explain the physics of flight. Some knowledge refuses to be written. It must be lived.',
  },
  {
    location: 'Svalbard, 2074',
    author: 'Ingrid Solberg',
    text: 'Minus 34 degrees. The seed vault hums behind its steel door — 1.1 million samples of the world\'s agricultural memory, preserved against the possibility that we might forget how to grow things. I am here to study governance but I cannot stop thinking about memory. What is the seed vault if not the world\'s most hopeful archive?',
  },
];

/* ─── Specimen Gallery Data ─── */
const specimens = [
  { category: 'INFRASTRUCTURE', title: 'Floating School 2.0', city: 'Lagos, 2039', result: 'Deployed in 4 West African coastal communities' },
  { category: 'GOVERNANCE', title: 'Seeds of Governance', city: 'Svalbard, 2074', result: 'Adopted by 14 climate-vulnerable regions' },
  { category: 'TECHNOLOGY', title: 'Swahili NLP Engine', city: 'Zanzibar, 2048', result: 'First natural language processor for 12 Bantu languages' },
  { category: 'ECOLOGY', title: 'Atoll Regeneration Protocol', city: 'Suva, 2057', result: 'Restored 23 hectares of coral reef across 3 Pacific nations' },
  { category: 'ECONOMICS', title: 'Altitude Market Model', city: 'Bogotá, 2065', result: 'New economic framework for high-altitude communities' },
  { category: 'EDUCATION', title: 'The Slow Knowing Curriculum', city: 'Global, 2052', result: 'Adopted by 200+ universities on 6 continents' },
];

/* ─── Timeline Data ─── */
const voyageTimeline: TimelineEvent[] = [
  { year: '2014', title: 'Minerva Founded', desc: 'The first university built entirely around global city rotation' },
  { year: '2035', title: 'Voyage Rotation Launched', desc: 'First cohort of 120 learners departs for the Atlantic Awakening' },
  { year: '2042', title: 'First Voyage Convocation', desc: 'Annual gathering becomes the world\'s premier interdisciplinary event' },
  { year: '2050', title: 'Protocol Exported', desc: '200+ universities on six continents adopt the Rotation Protocol' },
  { year: '2065', title: 'Campus Dissolved', desc: 'The last traditional Artemis campus repurposed as a global node' },
  { year: '2082', title: 'Circumpolar Return Completed', desc: 'The most demanding rotation leg becomes a rite of passage' },
  { year: '2100', title: '48 Anchor Cities', desc: 'The Voyage Rotation spans every continent, every ocean, every challenge' },
];

/* ─── Headlines Data ─── */
const voyageHeadlines = [
  'Voyage Convocation draws record 12,000 attendees to Lagos — largest interdisciplinary gathering in history',
  'Artemis learner\'s floating school design adopted by 3 Pacific island nations',
  'Community veto exercised 12 times in 2079 — the most in any single year',
  'Svalbard Specimen credited with influencing governance frameworks across 14 regions',
  'Rotation Protocol now standard at 200+ universities worldwide; traditional study abroad programs discontinued',
];

/* ─── Anchor City Tooltip Data ─── */
interface AnchorCity {
  cx: number;
  cy: number;
  name: string;
  leg: string;
  legName: string;
  duration: string;
  detail: string;
}

const anchorCities: AnchorCity[] = [
  { cx: 490, cy: 220, name: 'Lagos', leg: 'I', legName: 'The Atlantic Awakening', duration: '12–18 months', detail: 'Urban innovation in the world\'s fastest-growing coastal city' },
  { cx: 340, cy: 220, name: 'Salvador', leg: 'I', legName: 'The Atlantic Awakening', duration: '12–18 months', detail: 'Yoruba spiritual systems survived as Candomblé' },
  { cx: 300, cy: 180, name: 'Port-au-Prince', leg: 'I', legName: 'The Atlantic Awakening', duration: '12–18 months', detail: 'The unfinished revolution of the first Black republic' },
  { cx: 530, cy: 280, name: 'Zanzibar', leg: 'II', legName: 'The Indian Ocean Circuit', duration: '12–24 months', detail: 'Spice trade architecture and cosmopolitan coexistence' },
  { cx: 620, cy: 260, name: 'Kochi', leg: 'II', legName: 'The Indian Ocean Circuit', duration: '12–24 months', detail: 'Ancient mathematical traditions prefiguring modern computing' },
  { cx: 720, cy: 300, name: 'Jakarta', leg: 'II', legName: 'The Indian Ocean Circuit', duration: '12–24 months', detail: 'Megacity growth colliding with subsidence below sea level' },
  { cx: 780, cy: 300, name: 'Suva', leg: 'III', legName: 'The Pacific Archipelago', duration: '10–18 months', detail: 'Laboratory for climate adaptation and floating infrastructure' },
  { cx: 820, cy: 220, name: 'Osaka', leg: 'III', legName: 'The Pacific Archipelago', duration: '10–18 months', detail: 'Density breeding innovation — doing more with less for centuries' },
  { cx: 500, cy: 320, name: 'Johannesburg', leg: 'IV', legName: 'The Continental Traverse', duration: '18–36 months', detail: 'Tracing the Great Rift Valley and vertical human adaptation' },
  { cx: 300, cy: 260, name: 'Bogotá', leg: 'IV', legName: 'The Continental Traverse', duration: '18–36 months', detail: 'Communities building at altitude with ancient agricultural wisdom' },
  { cx: 150, cy: 20, name: 'Svalbard', leg: 'V', legName: 'The Circumpolar Return', duration: '12–24 months', detail: 'The Global Seed Vault and the ethics of frozen preservation' },
];

interface Props {
  goTo: (page: string) => void;
}

/* ─── Voyage Log Data ─── */
const voyageLogEntries = [
  {
    leg: "I",
    name: "The Atlantic Awakening",
    dateRange: "2035–2042",
    image: "https://images.pexels.com/photos/31792594/pexels-photo-31792594.jpeg?auto=compress&cs=tinysrgb&w=800",
    entry: "Day 142. Salvador. The Candomblé ceremony lasted until dawn. I watched as traditions that survived the Middle Passage reinvented themselves for a new century. My Field Notebook is full of questions I never thought to ask in a classroom. The Atlantic is not a barrier — it is a bridge built by the people who were forced to cross it. I am beginning to understand why the Continuum begins here.",
  },
  {
    leg: "II",
    name: "The Indian Ocean Circuit",
    dateRange: "2043–2051",
    image: "https://images.pexels.com/photos/29889182/pexels-photo-29889182.jpeg?auto=compress&cs=tinysrgb&w=800",
    entry: "Day 89. Zanzibar. The dhow builders do not use blueprints. They use embodied knowledge passed from father to son for 800 years. When I asked about the keel angle, they looked at me as if I had asked a bird to explain the physics of flight. Some knowledge refuses to be written. It must be lived. The Indian Ocean teaches what the Atlantic cannot: that trade routes carried ideas as readily as spices, and that the monsoon was the world's first educational calendar.",
  },
  {
    leg: "III",
    name: "The Pacific Archipelago",
    dateRange: "2052–2060",
    image: "https://images.pexels.com/photos/33715477/pexels-photo-33715477.jpeg?auto=compress&cs=tinysrgb&w=800",
    entry: "Day 203. Suva. The Pacific Islanders have been adapting to rising seas for 3,000 years. They did not wait for permission or funding. They built floating infrastructure, community-governed marine reserves, and decision-making systems that make Western democracy look slow and unresponsive. The Fa'a Samoa — the Samoan way — is a governance system older than any European parliament. I came here to study adaptation. I am learning revolution.",
  },
  {
    leg: "IV",
    name: "The Continental Traverse",
    dateRange: "2061–2070",
    image: "https://images.pexels.com/photos/35762336/pexels-photo-35762336.jpeg?auto=compress&cs=tinysrgb&w=800",
    entry: "Day 312. Bogotá. The Andes teach verticality — not just in terrain, but in thinking. At 2,640 meters, the air is thin and every thought must be efficient. Indigenous agricultural wisdom — terracing, microclimate management, seed banking — coexists with quantum computing labs in the same valley. The traverse taught me that the world's most important knowledge is not in any one place. It is in the movement between places.",
  },
  {
    leg: "V",
    name: "The Circumpolar Return",
    dateRange: "2071–2082",
    image: "https://images.pexels.com/photos/35228123/pexels-photo-35228123.jpeg?auto=compress&cs=tinysrgb&w=800",
    entry: "Day 47. Svalbard. Minus 34 degrees. The seed vault hums behind its steel door — 1.1 million samples of the world's agricultural memory, preserved against the possibility that we might forget how to grow things. Antarctica was governed by treaty, not territory — the only continent on Earth that belongs to science rather than sovereigns. The Circumpolar Return gave me a perspective no classroom could: the planet as a single system, fragile and resilient, worth every effort to sustain.",
  },
];

/* ─── Voyage Specimen Drawer Data ─── */
const voyageSpecimens = [
  { name: "Dhow Schematic", location: "Zanzibar, 2046", desc: "Hand-drawn keel diagram from an 800-year-old boat-building tradition" },
  { name: "Atoll Core Sample", location: "Suva, 2057", desc: "Coral growth record spanning 400 years of Pacific climate history" },
  { name: "Seed Vault Access Key", location: "Svalbard, 2074", desc: "Biometric credential granting entry to the world's agricultural memory" },
  { name: "Continental Traverse Map", location: "Bogotá, 2065", desc: "Hand-annotated topographic map marking 47 indigenous knowledge sites" },
];

export default function DarwinVoyagePage({ goTo }: Props) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <>
      <HeroHeader
        title="The World as Campus"
        description="In 2100, we look back at how two radical ideas — Minerva's global rotation that dissolved the campus into cities, and Darwin's five-year voyage that dissolved the classroom into the planet — merged to create Artemis's most transformative dimension: the Voyage Rotation."
        bgImage="https://images.pexels.com/photos/36622095/pexels-photo-36622095.jpeg?auto=compress&cs=tinysrgb&w=2000"
      />
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24 space-y-24">

        {/* ── Summary ── */}
        <section className="space-y-6">
          <SectionHeading>A Summary</SectionHeading>
          <p className="text-sm text-gray-600 leading-relaxed">
            Step into a virtual time capsule to discover how Artemis replaced the campus with the planet itself. The Voyage Rotation — a five-leg global circumnavigation born from the merger of two lineages — transformed every Artemis learner into a witness, a participant, and a contributor to the world&rsquo;s most urgent challenges. From Minerva, it inherited the structural logic of sequential rotation: the city as curriculum, the absence of a campus, the insistence that place shapes understanding. From Darwin, it inherited the methodological logic of observational voyage: slow knowing before swift action, variation as insight, the journey itself as epistemology.
          </p>
          <div className="w-full aspect-video bg-gray-200 relative group cursor-pointer overflow-hidden max-w-4xl border border-gray-300">
            <img
              src="https://images.pexels.com/photos/36622095/pexels-photo-36622095.jpeg?auto=compress&cs=tinysrgb&w=2500"
              alt="The World as Campus"
              className="w-full h-full object-cover filter grayscale opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/60 rounded flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
            <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 text-xs font-mono border border-black/10">
              BOX_ID: WAC_2100.006<br/>
              CONTENTS:_VOYAGE_ROTATION
            </div>
          </div>
        </section>

        {/* ── By the Numbers (#8) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>By the Numbers</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <StatsBar stats={rotationStats} />
        </section>

        {/* ── Two Lineages ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Two Lineages, One Framework</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
            The World as Campus was not the invention of a single mind. It was the convergence of two radical educational traditions — one that reimagined where learning happens, and one that reimagined how learning happens. Minerva University proved that the campus could be dissolved into cities; Darwin proved that the classroom could be dissolved into the voyage. Artemis merged both into a single, unified framework: the Voyage Rotation.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {dualLineage.map((lineage) => (
              <div key={lineage.source} className="border border-gray-200 p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#8A0000] flex items-center justify-center text-white text-sm font-bold italic">
                    {lineage.icon}
                  </div>
                  <h4 className="font-bold italic uppercase tracking-wider text-sm text-[#8A0000]">{lineage.source}</h4>
                </div>
                <div className="space-y-6">
                  {lineage.principles.map((p) => (
                    <div key={p.name} className="space-y-2">
                      <h5 className="font-bold text-sm text-gray-900">{p.name}</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Historical Notes ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Historical Notes</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Minerva Provocation</h4>
              <p className="font-bold italic text-sm text-gray-800 leading-relaxed">
                In 2014, Minerva University launched with a provocation: what if a university had no campus at all? Its students rotated through seven cities — San Francisco, Berlin, Buenos Aires, Seoul, Hyderabad, London, Taipei — living and learning in each for a semester. There were no lecture halls, no quad, no library building. The city was the campus. The world was the infrastructure.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Minerva proved that the campus was not a necessity but an inheritance — a legacy of medieval monasticism that had calcified into architectural assumption. Students who rotated through cities developed a kind of cultural fluency that no residential campus could provide. They learned to navigate difference, to adapt to unfamiliar systems, to see their own assumptions reflected in the mirror of other cultures. But Minerva&rsquo;s rotations were brief — a semester per city — and its students remained, in a sense, visitors. The Artemis Project asked: what would happen if the rotation were not a semester but years? What if learners were not visitors but witnesses?
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Darwin Provocation</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                In 1831, a 22-year-old naturalist boarded HMS Beagle and spent five years circumnavigating the globe. Charles Darwin did not discover evolution in a laboratory at Cambridge. He discovered it in the volcanic soils of the Galápagos, in the fossils of Patagonia, in the coral atolls of the Pacific. The voyage was not supplementary to his education — it was his education. The method of knowing was the journey itself.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                But Darwin&rsquo;s voyage was solitary, unstructured, and privileged — the observations of a single man from a single empire. The Artemis Project asked another provocation: what if the voyage were collective, structured, and equitable? What if every learner&rsquo;s education included a voyage of comparable scope, but designed with the methodological rigour and ethical framework that Darwin&rsquo;s era lacked? What if the Beagle carried not one observer but hundreds, from every continent, and the voyage produced not just theory but tangible contributions to the communities it touched?
              </p>
            </div>
          </div>
        </section>

        {/* ── The Voyage Rotation Map (#1 - Interactive) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Voyage Rotation</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">Five legs. Five years. Every learner completes at least two. Each leg combines Minerva&rsquo;s sequential immersion — the city as curriculum — with Darwin&rsquo;s observational methodology — the voyage as method. The routes follow the arcs of history and the circuits of contemporary challenge: the Atlantic world, the Indian Ocean, the Pacific, the continental interiors, the poles.</p>

          {/* Interactive SVG Route Map */}
          <div className="w-full max-w-4xl mx-auto border border-gray-200 bg-gray-50 p-4 relative">
            <svg viewBox="0 0 1000 500" className="w-full" xmlns="http://www.w3.org/2000/svg">
              {/* World outline - simplified */}
              <rect width="1000" height="500" fill="#f9fafb" />
              
              {/* Grid lines */}
              {[100, 200, 300, 400].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
              ))}
              {[200, 400, 600, 800].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#e5e7eb" strokeWidth="0.5" />
              ))}

              {/* Simplified continent shapes */}
              {/* Africa */}
              <path d="M 470,120 L 500,100 L 520,120 L 540,160 L 550,200 L 540,260 L 520,320 L 500,350 L 480,340 L 470,300 L 460,240 L 460,180 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* South America */}
              <path d="M 280,180 L 320,160 L 340,200 L 350,260 L 340,320 L 320,380 L 300,400 L 280,380 L 270,320 L 260,260 L 270,200 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* Europe */}
              <path d="M 460,60 L 500,50 L 540,60 L 550,80 L 530,100 L 500,110 L 470,100 L 460,80 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* Asia */}
              <path d="M 560,50 L 700,40 L 780,60 L 800,100 L 780,140 L 720,160 L 660,170 L 600,150 L 560,120 L 550,80 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* Australia */}
              <path d="M 760,280 L 820,270 L 860,290 L 870,330 L 840,360 L 800,360 L 770,340 L 750,310 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* North America */}
              <path d="M 120,60 L 220,40 L 280,60 L 300,100 L 280,140 L 240,160 L 200,170 L 160,160 L 130,130 L 110,100 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />

              {/* Voyage route lines */}
              {/* Leg I: Atlantic - West Africa to Brazil to Caribbean */}
              <path d="M 490,220 L 340,220 L 300,180" fill="none" stroke="#8A0000" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.7" />
              {/* Leg II: Indian Ocean */}
              <path d="M 530,280 L 620,260 L 720,300" fill="none" stroke="#8A0000" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.7" />
              {/* Leg III: Pacific */}
              <path d="M 780,300 L 820,220 L 780,200" fill="none" stroke="#8A0000" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.7" />
              {/* Leg IV: Continental Traverse */}
              <path d="M 500,320 L 380,300 L 300,260 L 500,80" fill="none" stroke="#8A0000" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.7" />
              {/* Leg V: Circumpolar */}
              <path d="M 150,20 L 500,10 L 800,30" fill="none" stroke="#8A0000" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.7" />

              {/* Anchor city dots - interactive with hover */}
              {anchorCities.map((city) => (
                <g key={city.name}>
                  <circle
                    cx={city.cx}
                    cy={city.cy}
                    r={8}
                    fill={hoveredCity === city.name ? '#b91c1c' : '#8A0000'}
                    stroke={hoveredCity === city.name ? '#fecaca' : 'none'}
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      transformOrigin: `${city.cx}px ${city.cy}px`,
                      transform: hoveredCity === city.name ? 'scale(1.35)' : 'scale(1)',
                      filter: hoveredCity === city.name ? 'drop-shadow(0 0 6px rgba(138,0,0,0.5))' : 'none',
                    }}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                  />
                  {/* City label */}
                  <text
                    x={city.cx + 12}
                    y={city.cy + 4}
                    style={{
                      fontSize: hoveredCity === city.name ? '10px' : '8px',
                      fontWeight: hoveredCity === city.name ? 'bold' : 'normal',
                      fill: hoveredCity === city.name ? '#8A0000' : '#6B7280',
                      transition: 'all 0.2s',
                    }}
                  >
                    {city.name}
                  </text>
                </g>
              ))}

              {/* Tooltip for hovered city - rendered as foreignObject */}
              {hoveredCity && (() => {
                const city = anchorCities.find(c => c.name === hoveredCity);
                if (!city) return null;
                const tooltipX = city.cx > 700 ? city.cx - 220 : city.cx + 20;
                const tooltipY = city.cy > 350 ? city.cy - 100 : city.cy + 10;
                return (
                  <foreignObject x={tooltipX} y={tooltipY} width="220" height="90">
                    <div className="bg-white border border-[#8A0000]/30 shadow-lg p-3 text-left" style={{ fontSize: '11px' }}>
                      <div className="font-bold text-[#8A0000] text-xs mb-1">{city.name}</div>
                      <div className="text-[10px] text-gray-500 mb-0.5">Leg {city.leg}: {city.legName}</div>
                      <div className="text-[10px] text-gray-500 mb-1">Duration: {city.duration}</div>
                      <div className="text-[10px] text-gray-700 italic leading-snug">{city.detail}</div>
                    </div>
                  </foreignObject>
                );
              })()}

              {/* Legend */}
              <g transform="translate(30, 420)">
                <rect width="200" height="60" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="2" />
                <line x1="15" y1="20" x2="45" y2="20" stroke="#8A0000" strokeWidth="2.5" strokeDasharray="8,4" />
                <text x="55" y="24" style={{fontSize:'9px', fill:'#6B7280'}}>Voyage Rotation Legs I–V</text>
                <circle cx="22" cy="42" r="5" fill="#8A0000" />
                <text x="55" y="46" style={{fontSize:'9px', fill:'#6B7280'}}>Anchor City (hover for details)</text>
              </g>

              {/* Title */}
              <text x="970" y="485" textAnchor="end" style={{fontSize:'9px', letterSpacing:'0.15em', fill:'#9CA3AF'}} className="font-mono uppercase">Voyage Rotation Map — Artemis 2100</text>
            </svg>
          </div>
        </section>

        {/* ── The Five Legs ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Five Legs</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="space-y-16">
            {voyageLegs.map((leg, idx) => (
              <div key={leg.num} className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#8A0000] flex items-center justify-center text-white text-sm font-bold italic">
                      {leg.num}
                    </div>
                    <div>
                      <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">{leg.name}</h4>
                      <p className="text-xs text-gray-400 font-mono">{leg.years} · {leg.duration}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{leg.desc}</p>
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Anchors: {leg.anchor}</span>
                  </div>
                </div>
                <div className="bg-gray-100 aspect-video overflow-hidden border border-gray-200">
                  <img 
                    src={
                      idx === 0 ? "https://images.pexels.com/photos/31792594/pexels-photo-31792594.jpeg?auto=compress&cs=tinysrgb&w=800" :
                      idx === 1 ? "https://images.pexels.com/photos/29889182/pexels-photo-29889182.jpeg?auto=compress&cs=tinysrgb&w=800" :
                      idx === 2 ? "https://images.pexels.com/photos/33715477/pexels-photo-33715477.jpeg?auto=compress&cs=tinysrgb&w=800" :
                      idx === 3 ? "https://images.pexels.com/photos/35762336/pexels-photo-35762336.jpeg?auto=compress&cs=tinysrgb&w=800" :
                      "https://images.pexels.com/photos/35228123/pexels-photo-35228123.jpeg?auto=compress&cs=tinysrgb&w=800"
                    }
                    alt={leg.name}
                    className="w-full h-full object-cover grayscale opacity-60" 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Field Notebook Excerpts (#13) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Field Notebook Excerpts</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {fieldNotebooks.map((nb, idx) => (
              <div
                key={nb.author}
                className={`bg-[#faf8f5] border-2 border-dashed border-gray-300 p-6 relative overflow-hidden ${
                  idx % 2 === 1 ? 'rotate-[-0.5deg]' : ''
                }`}
              >
                {/* Notebook lines background pattern */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e0d8 27px, #e5e0d8 28px)',
                  backgroundSize: '100% 28px',
                  backgroundPosition: '0 60px',
                  opacity: 0.5,
                }} />
                <div className="relative z-10">
                  <div className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-3">
                    {nb.location}
                  </div>
                  <h4 className="font-serif italic text-sm font-bold text-gray-800 mb-4">
                    — {nb.author}
                  </h4>
                  <p className="font-serif italic text-sm text-gray-700 leading-relaxed">
                    &ldquo;{nb.text}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Rotation Protocol ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Rotation Protocol</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">Every Voyage Rotation follows the Rotation Protocol — a structured methodology that merges Minerva&rsquo;s location-based pedagogy with Darwin&rsquo;s observational discipline. The protocol ensures that the voyage produces rigorous knowledge, not mere travel, and that every city becomes a true classroom, not a postcard.</p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {rotationProtocol.map((phase) => (
              <div key={phase.phase} className="border border-gray-200 p-6 space-y-4">
                <div className="text-xs font-mono text-[#8A0000] font-bold">PHASE {phase.phase} · {phase.duration.toUpperCase()}</div>
                <h4 className="font-bold text-lg text-gray-900 italic">{phase.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{phase.desc}</p>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-mono text-[#8A0000] uppercase tracking-wider">Output: {phase.output}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual: The Rotation Protocol Cycle */}
          <div className="w-full max-w-3xl mx-auto mt-12">
            <svg viewBox="0 0 600 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrowWAC" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af"/>
                </marker>
              </defs>
              
              {/* Docking */}
              <g transform="translate(30,30)">
                <rect width="150" height="120" rx="4" fill="white" stroke="#8A0000" strokeWidth="2"/>
                <rect width="150" height="36" rx="4" fill="#8A0000"/>
                <text x="75" y="23" textAnchor="middle" fill="white" style={{fontSize:'12px', fontWeight:'bold', letterSpacing:'0.1em'}}>DOCKING</text>
                <text x="75" y="60" textAnchor="middle" fill="#6B7280" style={{fontSize:'9px'}}>Observe · Listen · Map</text>
                <text x="75" y="78" textAnchor="middle" fill="#8A0000" style={{fontSize:'10px', fontWeight:'bold'}}>Field Notebook</text>
                <text x="75" y="100" textAnchor="middle" fill="#9CA3AF" style={{fontSize:'8px'}}>3–6 months</text>
              </g>
              
              <line x1="190" y1="90" x2="220" y2="90" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowWAC)"/>
              
              {/* Surveying */}
              <g transform="translate(225,30)">
                <rect width="150" height="120" rx="4" fill="white" stroke="#8A0000" strokeWidth="2"/>
                <rect width="150" height="36" rx="4" fill="#6B0000"/>
                <text x="75" y="23" textAnchor="middle" fill="white" style={{fontSize:'12px', fontWeight:'bold', letterSpacing:'0.1em'}}>SURVEYING</text>
                <text x="75" y="60" textAnchor="middle" fill="#6B7280" style={{fontSize:'9px'}}>Inquire · Partner · Test</text>
                <text x="75" y="78" textAnchor="middle" fill="#8A0000" style={{fontSize:'10px', fontWeight:'bold'}}>Working Papers</text>
                <text x="75" y="100" textAnchor="middle" fill="#9CA3AF" style={{fontSize:'8px'}}>3–9 months</text>
              </g>
              
              <line x1="385" y1="90" x2="415" y2="90" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowWAC)"/>
              
              {/* Specimen */}
              <g transform="translate(420,30)">
                <rect width="150" height="120" rx="4" fill="white" stroke="#8A0000" strokeWidth="2"/>
                <rect width="150" height="36" rx="4" fill="#4A0000"/>
                <text x="75" y="23" textAnchor="middle" fill="white" style={{fontSize:'12px', fontWeight:'bold', letterSpacing:'0.1em'}}>SPECIMEN</text>
                <text x="75" y="60" textAnchor="middle" fill="#6B7280" style={{fontSize:'9px'}}>Create · Deploy · Present</text>
                <text x="75" y="78" textAnchor="middle" fill="#8A0000" style={{fontSize:'10px', fontWeight:'bold'}}>Voyage Convocation</text>
                <text x="75" y="100" textAnchor="middle" fill="#9CA3AF" style={{fontSize:'8px'}}>3–9 months</text>
              </g>

              {/* Return loop */}
              <path d="M 495,160 Q 350,195 105,160" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arrowWAC)"/>
              <text x="300" y="185" textAnchor="middle" fill="#9ca3af" style={{fontSize:'8px', fontStyle:'italic'}}>Return to Docking at the next anchor — the rotation continues</text>
            </svg>
          </div>
        </section>

        {/* ── Specimen Gallery (#15) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Specimen Gallery</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specimens.map((sp) => (
              <div
                key={sp.title}
                className="border border-gray-200 p-6 space-y-3 hover:border-[#8A0000] transition-colors cursor-default"
              >
                <div className="text-[10px] font-mono text-[#8A0000] font-bold tracking-wider">
                  [{sp.category}]
                </div>
                <h4 className="font-bold text-sm text-gray-900">{sp.title}</h4>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{sp.city}</p>
                <p className="text-xs text-gray-600 leading-relaxed italic">&rarr; {sp.result}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Achievement ── */}
        <section className="space-y-8">
          <SectionHeading>The Achievement</SectionHeading>
          <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
            <p>The World as Campus did not merely send students abroad — it dismantled the very concept of &ldquo;abroad,&rdquo; replacing it with a planet understood as a single, interconnected system of knowledge and challenge. By merging Minerva&rsquo;s structural insight — that the campus could be dissolved into cities — with Darwin&rsquo;s methodological insight — that the voyage could be a form of knowing — Artemis created something that neither lineage could have produced alone.</p>
          </div>
          <ul className="space-y-4 text-gray-700 text-sm md:text-base">
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">The campus dissolved (2040–2055):</strong> By the 2040s, the notion that learning happened inside buildings had come to seem as quaint as the notion that the Earth was flat. The Voyage Rotation proved that the most transformative learning occurred at the intersection of difference — cultural, ecological, linguistic, economic. Campuses did not disappear; they became nodes in a global network rather than the centre of the educational universe, exactly as Minerva had first demonstrated at a smaller scale.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Sequential immersion institutionalised (2035–2065):</strong> Minerva&rsquo;s insight that each rotation city must build on the previous one became the governing logic of the Voyage Rotation. The Atlantic Awakening preceded the Indian Ocean Circuit because the history of forced migration demanded understanding before the study of voluntary trade routes. The sequence was not arbitrary — it was pedagogy, each leg a chapter in a cumulative education that no single location could provide.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">The Rotation Protocol exported (2050–2080):</strong> Docking, Surveying, Specimen became the global standard for immersive learning. Over 200 universities on six continents adopted the protocol, adapting it to their own contexts while preserving its essential structure: observe before you act, partner before you lead, contribute before you leave. The protocol proved that Minerva&rsquo;s rotation logic and Darwin&rsquo;s observational discipline were not competitors but complements — structure without method was tourism, method without structure was wandering.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Community veto power (2035–present):</strong> The insistence that local partners hold veto authority over visiting projects was initially controversial — some faculty saw it as an infringement on academic freedom. Within a decade, it was universally recognised as the protocol&rsquo;s most important safeguard. It prevented the extractive research that had characterised Western academia&rsquo;s relationship with the Global South for centuries and ensured that the rotation was a partnership, not a passage.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">The Voyage Convocation (2042–present):</strong> What began as an annual gathering of rotating learners became the world&rsquo;s most important interdisciplinary knowledge event — a place where a climate scientist from Svalbard, a governance scholar from Lagos, and a marine ecologist from Suva presented their Specimens side by side. The Convocation demonstrated that the most powerful ideas emerge not from silos but from the collision of perspectives that only a voyage can produce.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">A new kind of graduate (2055–present):</strong> Artemis learners who completed the Voyage Rotation carried something no traditional graduate possessed: a planetary perspective grounded in both structure and method. They had seen the world&rsquo;s problems from multiple vantage points, understood that every solution is local before it is global, and possessed the humility that only sustained encounter with difference can teach. Employers, governments, and communities recognised them immediately — not by their credentials, but by their questions.</span>
            </li>
          </ul>
          <div className="mt-8">
            <blockquote className="border-l-4 border-[#8A0000] pl-6 space-y-4">
              <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                &ldquo;Minerva proved that the campus could be anywhere. Darwin proved that the journey could be the method. We proved that both were true — and that together, they were unstoppable. The world is not our campus. The world is our curriculum.&rdquo;
              </p>
              <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                &mdash; Navigator, Voyage Convocation 2089
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ── Timeline (#7) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Voyage Timeline</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <Timeline events={voyageTimeline} />
        </section>

        {/* ── Dispatches from 2100 (#16) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Dispatches from 2100</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <HeadlinesFrom2100 headlines={voyageHeadlines} />
        </section>

        {/* ── Voyage Log ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Voyage Log</SectionHeading>
            <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
              Captain&rsquo;s logs, crew dispatches, and observations from the five legs of the Voyage Rotation — preserved exactly as they were transmitted.
            </p>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="space-y-8">
            {voyageLogEntries.map((log) => (
              <div key={log.leg} className="bg-[#faf8f5] border border-gray-200 overflow-hidden">
                <div className="flex items-stretch">
                  {/* Image column */}
                  <div className="hidden md:block w-56 shrink-0">
                    <img
                      src={log.image}
                      alt={log.name}
                      className="w-full h-full object-cover grayscale opacity-50"
                    />
                  </div>

                  {/* Log content */}
                  <div className="flex-1 p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-[#8A0000] flex items-center justify-center text-white text-xs font-bold italic shrink-0">
                        {log.leg}
                      </div>
                      <div>
                        <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">
                          Leg {log.leg} — {log.name}
                        </h4>
                        <p className="text-[10px] font-mono text-gray-400">{log.dateRange}</p>
                      </div>
                    </div>

                    {/* Log entry — styled like handwritten captain's log */}
                    <div className="bg-white/60 border border-gray-100 p-4 relative">
                      <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e0d8 27px, #e5e0d8 28px)',
                        backgroundSize: '100% 28px',
                        backgroundPosition: '0 20px',
                        opacity: 0.3,
                      }} />
                      <p className="font-serif italic text-sm text-gray-700 leading-relaxed relative z-10">
                        &ldquo;{log.entry}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voyage Specimen Drawer */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Voyage Specimen Drawer</p>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {voyageSpecimens.map((spec) => (
                <div
                  key={spec.name}
                  className="bg-[#faf8f5] border border-gray-200 p-4 space-y-2 hover:border-[#8A0000]/30 transition-colors"
                >
                  {/* Small crimson accent at top */}
                  <div className="h-0.5 w-6 bg-[#8A0000] mb-1" />
                  <h5 className="font-bold text-xs text-gray-900 leading-snug">{spec.name}</h5>
                  <p className="text-[9px] font-mono text-gray-400">{spec.location}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{spec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <ExploreAnotherFuture currentPage="darwin-voyage" goTo={goTo} />
    </>
  );
}
