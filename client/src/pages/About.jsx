// export default function About() {
//   return (
//     <div className="max-w-3xl">
//       <h1 className="text-2xl font-bold">About</h1>
//       <p className="mt-2 text-gray-600">Visionary Count uses YOLOv4 to analyze videos for object detection and analytics.</p>
//     </div>
//   );
// }
import React from 'react';

export default function About() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              About <span className="text-indigo-600">Visionary Count</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Making video intelligence simple and accessible. Upload videos, detect and count
              objects, and visualize insights in just a few clicks.
            </p>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-indigo-50 to-transparent sm:block" />
      </section>

      {/* What is VC */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold">What is Visionary Count?</h2>
            <p className="mt-3 text-gray-600">
              Visionary Count is a web platform that uses computer vision and AI to analyze videos.
              With a clean workflow and cloud storage, you can upload videos and automatically
              detect, count, and visualize objects across frames. It’s great for research,
              security, audits, and data-driven insights.
            </p>
          </div>
          <div className="rounded-2xl border bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Built For</dt>
                <dd className="mt-1 font-semibold">Students, Researchers, Teams</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Focus</dt>
                <dd className="mt-1 font-semibold">Object Detection & Analytics</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Storage</dt>
                <dd className="mt-1 font-semibold">Secure Cloud (CDN)</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Approach</dt>
                <dd className="mt-1 font-semibold">Simple, Fast, Transparent</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="mt-3 max-w-3xl text-gray-600">
            Empower anyone—regardless of technical background—to extract insights from video data.
            Visionary Count turns heavy computer vision workflows into a friendly experience with
            clear outputs you can use and share.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Upload Videos"
            desc="Store safely in the cloud with de-duplication and fast delivery."
          />
          <FeatureCard
            title="Unique Object Count"
            desc="Per-class counts across frames to understand activity and trends."
          />
          <FeatureCard
            title="Graphs & Insights"
            desc="Generate charts of detections over time to visualize patterns."
          />
          <FeatureCard
            title="BBox Overlay Video"
            desc="Export videos with bounding boxes drawn by the detector."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            <Step number={1} title="Upload" desc="Choose a video from your device or library." />
            <Step number={2} title="Pick a Feature" desc="Counts, graphs, or bbox overlay." />
            <Step number={3} title="View Results" desc="See outputs instantly and revisit in History." />
          </ol>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold">Technology Stack</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ul className="space-y-2 rounded-2xl border p-6 shadow-sm">
            <li className="font-semibold">Backend</li>
            <li className="text-gray-600">Node.js, Express, MongoDB</li>
            <li className="text-gray-600">Python (YOLO for detection)</li>
          </ul>
          <ul className="space-y-2 rounded-2xl border p-6 shadow-sm">
            <li className="font-semibold">Frontend</li>
            <li className="text-gray-600">React (Vite), Tailwind CSS</li>
            <li className="text-gray-600">Clean, responsive UI components</li>
          </ul>
          <ul className="space-y-2 rounded-2xl border p-6 shadow-sm">
            <li className="font-semibold">Cloud</li>
            <li className="text-gray-600">Cloudinary for media storage & delivery</li>
            <li className="text-gray-600">CDN-backed, secure URLs</li>
          </ul>
          <ul className="space-y-2 rounded-2xl border p-6 shadow-sm">
            <li className="font-semibold">Principles</li>
            <li className="text-gray-600">Reliability, transparency, and speed</li>
            <li className="text-gray-600">Keep the UX simple and helpful</li>
          </ul>
        </div>
      </section>

      {/* Team / Credits */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <h2 className="text-2xl font-bold">Team & Credits</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TeamCard name="Your Name" role="Developer" bio="Built with passion and a focus on clarity." />
            {/* Add more TeamCard entries as needed */}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold">Ready to explore Visionary Count?</h3>
          <p className="mt-2 text-gray-600">Create an account or jump into your library to start analyzing videos.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="/register" className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700">Get Started</a>
            <a href="/upload" className="rounded-xl border px-5 py-3 font-medium hover:bg-gray-50">Upload a Video</a>
          </div>
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Visionary Count. All rights reserved.
      </footer>
    </main>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700">★</span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <li className="relative rounded-2xl border p-6 shadow-sm">
      <span className="absolute -top-3 left-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
        {number}
      </span>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </li>
  );
}

function TeamCard({ name, role, bio }) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-400" />
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600">{bio}</p>
    </div>
  );
}
