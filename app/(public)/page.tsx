import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Users, Lightbulb } from "lucide-react";
import { eventService } from "@/lib/services/events";
import { EventGrid, StatusBadge, EmptyState } from "@/components/events";
import { EventImage } from "@/components/event-image";
import { formatDate, formatTime } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { upcoming, past } = await eventService.home();
  const nextEvent = upcoming[0];
  return (
    <main id="main-content">
      <section className="hero">
        <Image
          src="/images/workshop.jpg"
          alt="Hands working on an electronic circuit at a workbench"
          fill
          priority
          sizes="100vw"
          className="hero-image"
          unoptimized
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <h1 aria-label="IEEE ITB Events">
            <span>IEEE ITB</span>
            <span className="hero-word">
              Events
              <span className="hero-period" aria-hidden="true">
                .
              </span>
            </span>
          </h1>
          <p className="hero-description">
            For the minds that ask <em>what if.</em>
            <br />A meeting point for people, ideas, and technology.
          </p>
          <Link href="/events" className="button button-white">
            Explore events <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      {nextEvent && (
        <Link className="next-event-band" href={`/events/${nextEvent.id}`}>
          <div className="container next-event-inner">
            <strong>{nextEvent.title}</strong>
            <span className="next-event-date">
              {formatDate(nextEvent.date)}
              <span>{formatTime(nextEvent.date)}</span>
            </span>
            <ArrowUpRight size={25} />
          </div>
        </Link>
      )}
      <section className="section container home-program">
        <div className="section-heading">
          <div>
            <h2>
              Make room
              <br />
              for <em>what&apos;s next.</em>
            </h2>
          </div>
          <Link href="/events?status=upcoming" className="text-link">
            All upcoming events <ArrowRight size={17} />
          </Link>
        </div>
        <EventGrid events={upcoming} />
      </section>
      <section className="about-band">
        <div className="container about-grid">
          <div>
            <h2>
              Different minds.
              <br />
              <em>Shared curiosity.</em>
            </h2>
            <Link href="/about" className="text-link">
              Get to know IEEE ITB <ArrowUpRight size={17} />
            </Link>
          </div>
          <div>
            <p className="about-lead">
              We are a community of students exploring what technology can do
              for people.
            </p>
            <p>
              At IEEE ITB Student Branch, we connect engineering knowledge with
              new perspectives through workshops, conversations, and
              collaborative experiences.
            </p>
            <div className="about-values">
              <span>
                <Cpu size={20} />
                Technology
              </span>
              <span>
                <Users size={20} />
                Community
              </span>
              <span>
                <Lightbulb size={20} />
                Ideas
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section container home-archive">
        <div className="section-heading">
          <div>
            <h2>
              Good things
              <br />
              <em>happened here.</em>
            </h2>
          </div>
          <Link href="/events?status=past" className="text-link">
            Past events <ArrowRight size={17} />
          </Link>
        </div>
        {past.length ? (
          <div className="archive-list">
            {past.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="archive-row"
              >
                <time dateTime={event.date.toISOString()}>
                  {formatDate(event.date, {
                    day: "2-digit",
                    month: "short",
                    year: undefined,
                  })}
                  <small>
                    {formatDate(event.date, {
                      day: undefined,
                      month: undefined,
                      year: "numeric",
                    })}
                  </small>
                </time>
                <EventImage src={event.imageUrl} alt={event.title} />
                <div>
                  <StatusBadge status={event.status} />
                  <h3>{event.title}</h3>
                  <p>{event.location}</p>
                </div>
                <ArrowUpRight size={25} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
      <section className="cta-band">
        <div className="container">
          <div>
            <h2>Your next idea starts here.</h2>
          </div>
          <Link href="/events" className="button button-primary">
            Discover all events <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
