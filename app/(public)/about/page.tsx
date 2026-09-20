import type { Metadata } from "next";
import { Cpu, Users, Lightbulb } from "lucide-react";
import { EventImage } from "@/components/event-image";

export const metadata: Metadata = { title: "About IEEE ITB" };
export default function AboutPage() {
  return (
    <main id="main-content" className="container page-content">
      <div className="page-heading">
        <h1>IEEE ITB Student Branch</h1>
      </div>
      <EventImage
        src="/images/collaboration.jpg"
        alt="A group exchanging ideas and working together"
        className="about-cover"
        priority
      />
      <section className="about-grid section">
        <div>
          <h2>
            Learn by building.
            <br />
            Grow by sharing.
          </h2>
        </div>
        <div>
          <p className="about-lead">
            IEEE ITB Student Branch is a student community for exploring
            technology through practical events, shared curiosity, and
            cross-discipline collaboration.
          </p>
          <p>
            We create spaces where students can meet people with similar
            interests, learn from technical sessions, and turn ideas into
            projects that are easier to understand, discuss, and improve
            together.
          </p>
          <p>
            From workshops and forums to community gatherings, each program is
            designed to help members connect engineering knowledge with real
            student experiences.
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
        </div>
      </section>
    </main>
  );
}
