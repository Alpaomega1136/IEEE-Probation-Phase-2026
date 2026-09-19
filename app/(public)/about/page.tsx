import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Cpu, Users, Lightbulb } from "lucide-react";
import { EventImage } from "@/components/event-image";

export const metadata: Metadata = { title: "About IEEE ITB" };
export default function AboutPage() {
  return (
    <main id="main-content" className="container page-content">
      <div className="page-heading">
        <p className="eyebrow">Our community</p>
        <h1>IEEE ITB Student Branch</h1>
        <p>Bringing people and technology closer together.</p>
      </div>
      <EventImage
        src="/images/collaboration.jpg"
        alt="A group exchanging ideas and working together"
        className="about-cover"
        priority
      />
      <section className="about-grid section">
        <div>
          <p className="eyebrow">Advancing Technology for Humanity</p>
          <h2>Curiosity connects us.</h2>
        </div>
        <div>
          <p className="about-lead">
            A space for students to learn, exchange perspectives, and explore
            engineering beyond the classroom.
          </p>
          <p>
            IEEE ITB Student Branch brings the spirit of the IEEE community to
            Institut Teknologi Bandung. Our events create opportunities to
            engage with technology, meet fellow students, and turn questions
            into practical experiences.
          </p>
          <p>
            From focused technical workshops to broader conversations, there is
            always something to discover.
          </p>
          <div className="about-values">
            <span>
              <Cpu size={20} />
              Learn
            </span>
            <span>
              <Users size={20} />
              Connect
            </span>
            <span>
              <Lightbulb size={20} />
              Create
            </span>
          </div>
          <Link href="/events" className="button button-primary">
            Explore our events <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
