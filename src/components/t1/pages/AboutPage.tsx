'use client';

import { HeroHeader } from "../Shared";

interface Props {
  goTo: (page: string) => void;
}

export default function AboutPage({ goTo }: Props) {
  return (
    <>
      <HeroHeader 
        title="About"
        description="The Artemis Project — a global collegiate university that dares to re-engineer the way humanity learns in a world of accelerating change."
        bgGradientClass="bg-gray-800"
        bgImage="https://images.pexels.com/photos/5900407/pexels-photo-5900407.jpeg?auto=compress&cs=tinysrgb&w=2000"
      />
      
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24 space-y-16">
        
        <section className="space-y-6 text-gray-700 leading-relaxed">
           <p>The Artemis Project was sparked by a fundamental question: what if the entire architecture of higher education was redesigned for the 21st century and beyond? While institutions around the world were experimenting at the margins — adding online courses, updating curricula, launching innovation labs — the Artemis Project asked whether the very foundations of the university needed reimagining.</p>
           <p>Recognizing the advent of the &apos;Homo Eruditus&apos; — the learned and adaptable human — the project sought to transition from archaic, Industrial Revolution-era educational models to dynamic, cross-disciplinary, and globally collaborative frameworks accessible to all. The project drew on insights from hundreds of students, faculty, administrators, and visionaries across multiple continents, combining design thinking, futures methodology, and rigorous academic research.</p>
           <p>The project included intensive design workshops, global research expeditions, and the development of tools to support individuals who share the goal of experimenting towards a future of education that serves all of humanity. Design work continued for over a year, creating the foundation for the Artemis 2100 exhibit, which debuted as an immersive, globally accessible experience staged as a time-travel journey — dimensions designed not as predictions, but as invitations to experiment.</p>
        </section>

        <section className="space-y-6">
           <h2 className="text-3xl font-bold max-w-2xl text-gray-900 border-b pb-2">The Dimensions</h2>
           <p className="text-gray-600 leading-relaxed max-w-3xl">The Artemis 2100 exhibit presented six dimensions — each a window into a possible future where a different dimension of the university was reimagined. Together, they formed a complete vision: rhythm (Infinite Learning Continuum), pace (Adaptive Paced Learning), identity (SkillPrints), commitment (The Artemis Oath), place (Centers of Inquiry), and movement (The World as Campus).</p>
           <div className="flex flex-wrap gap-3 mt-4">
             <button onClick={() => goTo('open-loop-learning')} className="bg-[#8A0000] hover:bg-[#6B0000] transition-colors text-white font-bold px-5 py-3 italic text-sm cursor-pointer">Infinite Learning Continuum</button>
             <button onClick={() => goTo('adaptive-paced-learning')} className="bg-[#8A0000] hover:bg-[#6B0000] transition-colors text-white font-bold px-5 py-3 italic text-sm cursor-pointer">Adaptive Paced Learning</button>
             <button onClick={() => goTo('global-skills-matrix')} className="bg-[#8A0000] hover:bg-[#6B0000] transition-colors text-white font-bold px-5 py-3 italic text-sm cursor-pointer">SkillPrints</button>
             <button onClick={() => goTo('purpose-learning')} className="bg-[#8A0000] hover:bg-[#6B0000] transition-colors text-white font-bold px-5 py-3 italic text-sm cursor-pointer">The Artemis Oath</button>
             <button onClick={() => goTo('centers-of-inquiry')} className="bg-[#8A0000] hover:bg-[#6B0000] transition-colors text-white font-bold px-5 py-3 italic text-sm cursor-pointer">Centers of Inquiry</button>
             <button onClick={() => goTo('darwin-voyage')} className="bg-[#8A0000] hover:bg-[#6B0000] transition-colors text-white font-bold px-5 py-3 italic text-sm cursor-pointer">The World as Campus</button>
           </div>
        </section>

        <section className="space-y-12">
           <h2 className="text-3xl font-bold max-w-2xl text-gray-900 border-b pb-2">Acknowledgements</h2>
           
           <div className="space-y-10 text-sm">
             <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-gray-900">The Artemis Project Core Team</h3>
                <p className="text-gray-600 leading-relaxed">Abraham Kyeyune, Founding Visionary &amp; Principal — with a global team of designers, educators, researchers, and technologists spanning multiple continents</p>
             </div>

             <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-gray-900">Our Scholars &amp; Contributors</h3>
                <p className="text-gray-500 italic">who helped uncover important insights and sparked many of the key ideas in the project</p>
                <p className="text-gray-600 leading-relaxed">Over 350 founding scholars from the inaugural cohort, alongside faculty, administrators, and community partners who contributed their perspectives and expertise</p>
             </div>

             <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-gray-900">Our Global Partners</h3>
                <p className="text-gray-500 italic">who served as inspiration and helped frame key design challenges &amp; activities</p>
                <ul className="text-gray-600 leading-relaxed list-disc pl-5">
                   <li>The African Union Commission — Education Division</li>
                   <li>UNESCO — Institute for Lifelong Learning</li>
                   <li>Oxford University — Department of Education</li>
                   <li>MIT Media Lab — Lifelong Kindergarten Group</li>
                   <li>National University of Singapore — Institute for Applied Learning</li>
                </ul>
             </div>

             <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-gray-900">Our Production Team</h3>
                <p className="text-gray-600 leading-relaxed">The Artemis Digital Studio — immersive design, technology, and storytelling</p>
             </div>

             <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-gray-900">And Special Thanks to...</h3>
                <p className="text-gray-600 leading-relaxed">Everyone who gave their time, insights, perspectives, feedback, ideas, and critique to this project — including the hundreds of students, faculty, and community members who participated in workshops, design sessions, and pilot programs around the world. And to the visionaries, experimenters, and innovators in education who inspired us along the way — those who dared to imagine that another university is possible.</p>
             </div>
           </div>
        </section>
      </div>
    </>
  );
}
