'use client';

import { useState } from "react";
import { Play } from "lucide-react";
import { SectionHeading, HeroHeader, ExploreAnotherFuture, Timeline, HeadlinesFrom2100 } from "../Shared";
import type { TimelineEvent } from "../Shared";

/* ─── Impact Lab Data ─── */
const impactLabs = [
  { city: "Lagos", x: 490, y: 220, name: "Clean Water Initiative", desc: "Community water purification and distribution" },
  { city: "Medellín", x: 300, y: 240, name: "Urban Peace Lab", desc: "Violence reduction through education and economic opportunity" },
  { city: "Chennai", x: 630, y: 240, name: "Health Equity Hub", desc: "Rural healthcare access and telemedicine deployment" },
  { city: "Bethlehem", x: 540, y: 160, name: "Heritage & Innovation Center", desc: "Preserving cultural heritage through technology" },
  { city: "Apia", x: 800, y: 310, name: "Climate Resilience Lab", desc: "Small island adaptation strategies and marine conservation" },
];

/* ─── Timeline Events ─── */
const timelineEvents: TimelineEvent[] = [
  {year: "2025", title: "The Oath Drafted", desc: "First version of the Artemis Oath written by founding faculty and students"},
  {year: "2030", title: "Oath Seal Designed", desc: "The ceremonial seal becomes the symbol of purpose-driven education"},
  {year: "2038", title: "Impact Labs Launched", desc: "First 5 Global Impact Labs open in Lagos, Medellín, Chennai, Bethlehem, and Apia"},
  {year: "2045", title: "Purpose Declarations Required", desc: "Every Artemis learner must declare a purpose — not a major — before advancing"},
  {year: "2060", title: "Oath Goes Global", desc: "60+ universities adopt the Oath framework; purpose-driven education becomes a movement"},
  {year: "2085", title: "Impact Labs Merge", desc: "The 5 labs become a single global network with shared governance and resources"},
];

/* ─── Headlines from 2100 ─── */
const headlines = [
  "Artemis Oath signatories surpass 2 million — every continent represented",
  "Lagos Impact Lab's water initiative reaches 10 million people across West Africa",
  "Purpose Declarations replace major declarations at 89 universities worldwide",
  "Bethlehem Heritage Lab digitizes 50,000 endangered manuscripts using AI preservation",
  "Medellín Urban Peace Lab credited with 40% reduction in youth violence since founding",
];

/* ─── Oath Registry Data ─── */
const oathEntries = [
  { text: "I pledge to dismantle the structures that make hunger possible in a world of abundance.", name: "Amara Okafor", year: "2038" },
  { text: "I will learn quantum physics and African philosophy to reimagine energy sovereignty for underserved communities.", name: "Kwame Asante", year: "2042" },
  { text: "My purpose is to build legal systems that hear the voices traditional courts have silenced for centuries.", name: "Elena Vasquez", year: "2045" },
  { text: "I commit to designing cities that breathe — where concrete yields to living systems and every street is a watershed.", name: "Jian Wei", year: "2051" },
  { text: "I will use narrative and memory to ensure that no culture is ever again reduced to a footnote in someone else's history.", name: "Fatima Al-Rashid", year: "2047" },
  { text: "My oath is to the oceans — I will learn to listen to what the tides are telling us before it's too late to respond.", name: "Ingrid Solberg", year: "2058" },
  { text: "I pledge to make justice algorithmic — not by removing human judgment, but by revealing the biases that corrupt it.", name: "Priya Sharma", year: "2055" },
  { text: "I will spend my life proving that the boundary between art and engineering is a fiction that both disciplines outgrew long ago.", name: "Yuki Tanaka", year: "2061" },
];

/* ─── Oath Registry Wall Component ─── */
function OathRegistryWall() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {oathEntries.map((oath, i) => (
        <div
          key={i}
          className="relative border border-gray-200 bg-[#fffbeb] p-5 hover:border-[#8A0000] transition-colors group"
        >
          {/* Crimson seal/stamp in corner */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full border-2 border-[#8A0000] flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
            <div className="w-4 h-4 rounded-full border border-[#8A0000]" />
          </div>

          <p className="text-sm text-gray-800 leading-relaxed italic pr-8">&ldquo;{oath.text}&rdquo;</p>
          <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-serif">{oath.name}</span>
            <span className="text-[10px] text-gray-400 font-mono">{oath.year}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Draft Your Oath Component ─── */
function DraftOathCard() {
  const [oathText, setOathText] = useState("");
  const [sealed, setSealed] = useState(false);

  return (
    <div className={`mt-8 border p-6 md:p-8 transition-all ${sealed ? 'border-[#8A0000] bg-[#fef2f2]' : 'border-gray-200 bg-white'}`}>
      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-4">Draft Your Oath</h4>
      <textarea
        value={oathText}
        onChange={(e) => !sealed && setOathText(e.target.value)}
        readOnly={sealed}
        placeholder="Write your oath here — what will you commit your learning to?"
        className={`w-full h-32 p-4 text-sm leading-relaxed resize-none border transition-colors placeholder:text-gray-400 focus:outline-none ${
          sealed
            ? 'border-[#8A0000] bg-[#fff7f7] text-gray-800 cursor-default'
            : 'border-gray-200 bg-gray-50 text-gray-800 focus:border-[#8A0000]'
        }`}
      />
      <div className="flex items-center justify-between mt-4">
        {!sealed ? (
          <button
            onClick={() => oathText.trim() && setSealed(true)}
            disabled={!oathText.trim()}
            className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              oathText.trim()
                ? 'bg-[#8A0000] text-white hover:bg-[#6B0000]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Seal Your Oath
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Seal icon */}
            <div className="w-10 h-10 rounded-full border-2 border-[#8A0000] flex items-center justify-center bg-[#8A0000]/10">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#8A0000]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#8A0000]">Your oath has been sealed into the Artemis Registry.</p>
              <p className="text-xs text-gray-500 italic">The future is listening.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  goTo: (page: string) => void;
}

export default function PurposeLearningPage({ goTo }: Props) {
  const [hoveredLab, setHoveredLab] = useState<number | null>(null);

  return (
    <>
      <HeroHeader 
        title="The Artemis Oath"
        description="Every learner takes an oath to pursue something that matters. A look back from 2100 to the era when Artemis students declared what they would change in the world — and built their education around that commitment."
        bgGradientClass="bg-[#8A0000]"
        bgImage="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=2000"
      />
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24 space-y-24">
        
        <section className="space-y-6">
          <SectionHeading>The Summary</SectionHeading>
          <p className="text-sm text-gray-600">
            Dive into archival footage from the future to uncover how learning paths were revolutionized at the University of Artemis through The Artemis Oath — where every learner takes an oath to pursue something that matters, aligning their education with personal and societal missions that anchor the entire Artemis vision in impact.
          </p>
          <div className="w-full aspect-video bg-gray-200 relative group cursor-pointer overflow-hidden max-w-4xl border border-gray-300">
            <img 
              src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=2500" 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover filter grayscale opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/60 rounded flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                 <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Historical Notes</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Setting</h4>
              <p className="font-bold italic text-sm text-gray-800 leading-relaxed">
                At the turn of the 21st century, higher education often felt disconnected from the practical needs and aspirations of students. A growing desire emerged for an education that connected academic learning with real-world impact.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The rigid structure of majors stifled aspirations, disconnecting academic pursuits from personal passions and societal needs. Bodies like the Association of American Colleges and Universities noted that high-impact educational practices such as Service Learning and Capstone Courses consistently outpaced traditional methods in student retention and engagement.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Following the boom and bust cycle of the 2nd Great Tech Bubble, generations of students who had once aspired to catch &ldquo;startup fever&rdquo; began to question the viability — and desirability — of those pathways. The millennial generation, once derided as self-involved &ldquo;slacktivists,&rdquo; had matured into leaders who considered social impact alongside financial impact.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                This generational evolution signaled a profound cultural transformation — one that would demand an equally profound transformation in how universities conceived of the educational journey itself. The question was no longer &ldquo;what will you study?&rdquo; but &ldquo;what will you change?&rdquo;
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <SectionHeading>The Shift</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-sm text-gray-600 leading-relaxed space-y-4">
              <p>Recognizing the need for a more integrated and purpose-driven approach, Artemis introduced The Artemis Oath. This new paradigm required every learner to take an oath — a personal commitment to pursue something that matters — and encouraged students to pledge a purpose, not a program, combining their academic studies with a clear, mission-driven focus anchored in societal impact.</p>
              <p>&ldquo;I&apos;m studying political science&rdquo; was replaced by &ldquo;I&apos;m learning governance systems to dismantle structural inequality across the Global South.&rdquo; Or &ldquo;I&apos;m learning quantum physics and African philosophy to reimagine energy sovereignty for underserved communities.&rdquo;</p>
              <p>The goal was to help students select a meaningful course of study while in school, and then scaffold a clear arc for the first 10–15 years of their professional lives. It wasn&apos;t about the career trajectory, but the reasons behind it.</p>
              <p>This reorientation fundamentally changed the culture of Artemis. Conversations shifted from &ldquo;What are you majoring in?&rdquo; to &ldquo;What problem are you solving?&rdquo; Faculty reported that students arrived to class not merely prepared, but possessed by a sense of urgency and relevance that elevated every seminar and lab.</p>
            </div>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 340 400" className="w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">
                {/* Oath Scroll */}
                <rect x="40" y="20" width="260" height="360" rx="8" fill="#fffbeb" stroke="#8A0000" strokeWidth="2"/>
                <rect x="40" y="20" width="260" height="40" rx="8" fill="#8A0000"/>
                <text x="170" y="46" textAnchor="middle" fill="white" style={{fontSize:'14px', fontWeight:'bold', letterSpacing:'0.15em'}}>THE ARTEMIS OATH</text>
                
                {/* Seal */}
                <circle cx="170" cy="100" r="30" fill="none" stroke="#6B0000" strokeWidth="2"/>
                <circle cx="170" cy="100" r="22" fill="none" stroke="#6B0000" strokeWidth="1"/>
                <text x="170" y="96" textAnchor="middle" fill="#6B0000" style={{fontSize:'8px', fontWeight:'bold'}}>ARTEMIS</text>
                <text x="170" y="108" textAnchor="middle" fill="#6B0000" style={{fontSize:'7px'}}>2100</text>
                
                {/* Oath text lines */}
                <text x="170" y="155" textAnchor="middle" fill="#4A0000" style={{fontSize:'10px', fontStyle:'italic'}}>I pledge not a program,</text>
                <text x="170" y="172" textAnchor="middle" fill="#4A0000" style={{fontSize:'10px', fontStyle:'italic'}}>but a purpose.</text>
                
                <line x1="80" y1="188" x2="260" y2="188" stroke="#e5e7eb" strokeWidth="0.5"/>
                
                <text x="170" y="210" textAnchor="middle" fill="#78716c" style={{fontSize:'9px'}}>I commit my learning</text>
                <text x="170" y="225" textAnchor="middle" fill="#78716c" style={{fontSize:'9px'}}>to the service of</text>
                <text x="170" y="240" textAnchor="middle" fill="#78716c" style={{fontSize:'9px'}}>something that matters.</text>
                
                <line x1="80" y1="258" x2="260" y2="258" stroke="#e5e7eb" strokeWidth="0.5"/>
                
                {/* Signature line */}
                <line x1="80" y1="310" x2="220" y2="310" stroke="#a8a29e" strokeWidth="1"/>
                <text x="150" y="325" textAnchor="middle" fill="#a8a29e" style={{fontSize:'8px'}}>Learner&apos;s Signature</text>
                
                <line x1="80" y1="350" x2="220" y2="350" stroke="#a8a29e" strokeWidth="1"/>
                <text x="150" y="365" textAnchor="middle" fill="#a8a29e" style={{fontSize:'8px'}}>Witness</text>
                
                {/* Decorative corners */}
                <line x1="50" y1="30" x2="50" y2="55" stroke="#6B0000" strokeWidth="1" opacity="0.4"/>
                <line x1="50" y1="30" x2="75" y2="30" stroke="#6B0000" strokeWidth="1" opacity="0.4"/>
                <line x1="290" y1="30" x2="290" y2="55" stroke="#6B0000" strokeWidth="1" opacity="0.4"/>
                <line x1="290" y1="30" x2="265" y2="30" stroke="#6B0000" strokeWidth="1" opacity="0.4"/>
              </svg>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Components</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">Mission Identification</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Upon entering Artemis, students undergo a comprehensive orientation that includes workshops, mentorship sessions, and reflective practices designed to help them identify their core passions and the societal challenges they wish to address. These immersive experiences challenge them to articulate not just what they want to study, but why it matters — to themselves and to the world.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Trained facilitators and peer mentors help students navigate the often-uncomfortable space between ambition and uncertainty. By the end of orientation, every Artemis student has a drafted mission statement — a living document that will evolve alongside their intellectual and personal growth.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">Customized Curriculum</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                With their missions identified, students collaborate with faculty to design a personalized curriculum that integrates academic knowledge with practical projects. This curriculum is flexible and interdisciplinary, drawing from multiple Centers of Inquiry, research centers, and community partnerships.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rather than following a prescribed sequence of requirements, students build a learning pathway that might combine engineering, ethics, and public policy — or weave together art, data science, and urban planning. Faculty advisors serve as intellectual mentors, ensuring academic rigor is never sacrificed for breadth. The result is a curriculum that feels less like a requirement and more like a calling.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">Global Impact Labs</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Artemis established Impact Labs in diverse global locations, each focused on specific societal challenges. These labs provide students with immersive, hands-on experiences where they can apply their knowledge to real-world problems. From water sustainability in sub-Saharan Africa to renewable energy deployment in Southeast Asia, each Impact Lab is a living laboratory where theory meets practice.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Students spend a minimum of one semester at an Impact Lab, working alongside local communities, NGOs, and international experts. The labs are not volunteer tourism — they are rigorous, academically credited environments where students produce research, develop solutions, and build the intercultural competence essential for globally impactful careers.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">Reflective Practice</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Continuous reflection and adaptation are integral to The Artemis Oath. Regular check-ins with mentors and peers, reflective journaling, and portfolio reviews ensure that students remain aligned with their missions. These practices are not ancillary — they are woven into the academic structure itself, earning credit and institutional recognition.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The reflective framework helps students navigate the inevitable pivots that occur when ambition meets reality. A student who entered Artemis intent on eliminating world hunger might discover that their most effective contribution lies in agricultural technology policy rather than direct food aid. Reflective practice gives them permission — and a structured process — to evolve their mission without abandoning it.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Impact Stories</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold italic uppercase tracking-wider text-sm">Yasmin Bhuhati — Clean Water Initiative in Africa</h4>
                <p className="text-xs text-gray-500 italic">&apos;24, MS ME &apos;28, PhD Microbiology &apos;32</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  During her impact year in Ghana, Yasmin worked on water and sanitation projects that would define the trajectory of her career. Partnering with local engineers and community health workers, she helped develop low-cost filtration systems adapted to the specific geological and cultural conditions of the region. Her work didn&apos;t stop at technical solutions — she also designed community education programs ensuring sustainability and adoption of new water infrastructure.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Her doctoral research pioneered new microbial detection methods that dramatically reduced the time required to identify waterborne contaminants. By the time she completed her PhD, her innovations had been adopted by public health agencies across three continents.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 aspect-video overflow-hidden">
                  <img src="https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Clean Water Initiative" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold italic uppercase tracking-wider text-sm">Juan Carlos Rodriguez — Renewable Energy Solutions in South America</h4>
                <p className="text-xs text-gray-500 italic">&apos;25, BS Engineering &apos;29</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Collaborated with local communities and international experts to design sustainable energy systems tailored to the unique needs of rural and urban populations across South America. His signature contribution was the development of modular solar micro-grids that could be assembled and maintained by local technicians with minimal training.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  His designs were open-source, enabling communities to replicate and adapt the systems without dependency on external suppliers. Within a decade of graduation, his frameworks had been implemented in fourteen countries, providing reliable electricity to communities that had never been connected to a central grid.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 aspect-video overflow-hidden">
                  <img src="https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Renewable Energy Solutions" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold italic uppercase tracking-wider text-sm">Priya Sharma — Healthcare Innovation in Asia</h4>
                <p className="text-xs text-gray-500 italic">&apos;26, BS Biology &apos;30</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Developed telemedicine solutions and community health programs for remote areas that had long been underserved by traditional healthcare infrastructure. Working across villages in northern India and Nepal, Priya designed diagnostic protocols that could be administered by community health workers using low-cost mobile devices.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Her telemedicine platform, built during her time at an Artemis Impact Lab in Mumbai, eventually connected over 500 rural clinics with specialists in urban hospitals. The system incorporated AI-assisted triage that could prioritize urgent cases and translate between languages in real time, becoming a model for healthcare delivery across South and Southeast Asia.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 aspect-video overflow-hidden">
                  <img src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Healthcare Innovation" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── #2 Global Impact Map ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Global Impact Labs</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
            Five Impact Labs, five continents, five missions. Each lab is a living laboratory where the Artemis Oath becomes tangible — where purpose meets practice and learners confront the world&apos;s most urgent challenges alongside the communities most affected by them.
          </p>

          <div className="w-full max-w-4xl mx-auto border border-gray-200 bg-gray-50 p-4">
            <svg viewBox="0 0 1000 500" className="w-full" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
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

              {/* Impact Lab Pins */}
              {impactLabs.map((lab, i) => (
                <g key={lab.city}
                   onMouseEnter={() => setHoveredLab(i)}
                   onMouseLeave={() => setHoveredLab(null)}
                   className="cursor-pointer"
                >
                  {/* Glow effect */}
                  <circle cx={lab.x} cy={lab.y} r={hoveredLab === i ? 18 : 12} fill="#8A0000" opacity={hoveredLab === i ? 0.15 : 0.08} className="transition-all duration-300" />
                  {/* Pin circle */}
                  <circle cx={lab.x} cy={lab.y} r={hoveredLab === i ? 8 : 6} fill="#8A0000" stroke="white" strokeWidth="2" className="transition-all duration-300" />
                  {/* White dot center */}
                  <circle cx={lab.x} cy={lab.y} r={2.5} fill="white" />
                  {/* City label */}
                  <text x={lab.x} y={lab.y - 14} textAnchor="middle" style={{fontSize:'9px', fontWeight:'bold', fill:'#8A0000'}}>{lab.city}</text>

                  {/* Tooltip on hover */}
                  {hoveredLab === i && (
                    <g>
                      <rect x={lab.x - 100} y={lab.y + 16} width="200" height="46" rx="3" fill="white" stroke="#8A0000" strokeWidth="1" />
                      <text x={lab.x} y={lab.y + 32} textAnchor="middle" style={{fontSize:'9px', fontWeight:'bold', fill:'#8A0000'}}>{lab.name}</text>
                      <text x={lab.x} y={lab.y + 46} textAnchor="middle" style={{fontSize:'8px', fill:'#6B7280'}}>{lab.desc}</text>
                    </g>
                  )}
                </g>
              ))}

              {/* Legend */}
              <g transform="translate(30, 420)">
                <rect width="180" height="40" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="2" />
                <circle cx="20" cy="20" r="6" fill="#8A0000" stroke="white" strokeWidth="2" />
                <circle cx="20" cy="20" r="2.5" fill="white" />
                <text x="35" y="24" style={{fontSize:'9px', fill:'#6B7280'}}>Impact Lab Location</text>
              </g>

              {/* Title */}
              <text x="970" y="485" textAnchor="end" style={{fontSize:'9px', letterSpacing:'0.15em', fill:'#9CA3AF'}} className="font-mono uppercase">Global Impact Labs — Artemis 2100</text>
            </svg>
          </div>
        </section>

        {/* ── Oath Registry ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Oath Registry</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">The signed oaths of Artemis learners — each one a commitment to purpose, each one a thread in the fabric of a better world.</p>

          {/* Registry Wall */}
          <OathRegistryWall />

          {/* Draft Your Oath */}
          <DraftOathCard />
        </section>

        {/* ── Timeline ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Timeline</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <Timeline events={timelineEvents} />
        </section>

        {/* ── Headlines from 2100 ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Headlines from 2100</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <HeadlinesFrom2100 headlines={headlines} />
        </section>

        <section className="space-y-8">
          <SectionHeading>The Achievement</SectionHeading>
          <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
            <p>The Artemis Oath anchored the entire Artemis vision in impact — every dimension, from the Infinite Learning Continuum to SkillPrints, pointed toward this: learning in service of the world.</p>
          </div>
          <ul className="space-y-4 text-gray-700 text-sm md:text-base">
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Relevance and motivation unlocked (2038–2055):</strong> By the late 2030s, students had found greater purpose by aligning their studies with societal commitments — &ldquo;What&apos;s your purpose?&rdquo; replaced &ldquo;What&apos;s your program?&rdquo; The shift was not merely semantic. Students who could articulate a purpose demonstrated 40% higher persistence through difficult coursework and reported substantially deeper engagement with their learning communities.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">The anchoring dimension (2040–2065):</strong> The Artemis Oath connected every other dimension — Infinite Learning, SkillPrints, Centers of Inquiry — into a coherent vision of impact-driven education. By mid-century, longitudinal studies confirmed that Oath-aligned learners were three times more likely to sustain careers in public-interest fields and twice as likely to found civic enterprises.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Tangible community benefits (2045–2080):</strong> Students&apos; projects delivered measurable improvements in communities and societies around the world. From water filtration systems in West Africa to AI-assisted judicial reform in Southeast Asia, the Impact Labs produced outcomes that outlasted any single student&apos;s tenure — a self-renewing engine of applied idealism.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Whole-person development (2050–2075):</strong> Students grew acadically, personally, and socially — prepared not just for careers, but for mission-driven lives. The reflective practice framework, initially met with skepticism by quantitative disciplines, became the single most-requested resource by 2060, with faculty across all Centers integrating it into capstone requirements.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">A new cultural vernacular (2042–2060):</strong> &ldquo;What&apos;s your purpose?&rdquo; became the defining question of the Artemis experience — a shift from identity to action. By 2060, the phrase had migrated beyond Artemis into hiring interviews, fellowship applications, and even parliamentary debates on education reform, seeding a global vernacular of purpose-driven self-description.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Endless contributions (2055–2100):</strong> An uncountable list of impact on poverty, health, infrastructure, renewable energy, global governance, space travel, and artistic and cultural achievement. By the centennial exhibit of 2100, the Oath&apos;s alumni network had produced Nobel laureates, infrastructure architects, and at least three sitting heads of state — each tracing their trajectory to a single pledge made during their first days at Artemis.</span>
            </li>
          </ul>
          <div className="mt-8">
            <blockquote className="border-l-4 border-[#8A0000] pl-6 space-y-4">
              <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                &ldquo;I pledged a purpose, not a program. My purpose was &lsquo;restore.&rsquo; Every course, every project, every late night in the lab — it all pointed toward healing what was broken. That clarity changed everything.&rdquo;
              </p>
              <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                &mdash; Pathfinder, Class of 2058
              </footer>
            </blockquote>
          </div>
        </section>

      </div>
      <ExploreAnotherFuture currentPage="purpose-learning" goTo={goTo} />
    </>
  );
}
