
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import dynamic from 'next/dynamic'

const Features = dynamic(() => import("@/components/features").then(mod => mod.Features))
const Workflow = dynamic(() => import("@/components/workflow").then(mod => mod.Workflow))
const AIDemo = dynamic(() => import("@/components/ai-demo").then(mod => mod.AIDemo))
const Testimonials = dynamic(() => import("@/components/testimonials").then(mod => mod.Testimonials))
const FAQ = dynamic(() => import("@/components/faq").then(mod => mod.FAQ))
const Security = dynamic(() => import("@/components/security").then(mod => mod.Security))

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Hero />
      <Features />
      <Workflow />
      <AIDemo />
      <Testimonials />
      <FAQ />
      <Security />
      <Footer />
    </main>
  );
}
