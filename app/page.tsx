import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 rounded-lg border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            IEEE ITB Student Branch
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Event Management
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Foundation project for browsing IEEE ITB events publicly and managing
            event records from a protected admin area.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Explore Events
            </Link>
            <Link
              href="/admin/login"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Admin Login
            </Link>
          </div>
        </div>
        <div className="rounded-md border border-blue-100 bg-blue-50 p-6 text-sm text-blue-950">
          <p className="font-semibold">Foundation ready</p>
          <p className="mt-2 text-blue-900">
            Next.js, TypeScript, Tailwind, Prisma, PostgreSQL, Zod, and auth
            dependencies are prepared.
          </p>
        </div>
      </section>
    </main>
  );
}

