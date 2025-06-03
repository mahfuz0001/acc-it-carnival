import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Users,
  Sparkles,
  Zap,
} from "lucide-react";
import { EventCard } from "@/components/event-card";
import { supabase } from "@/lib/supabase";
import { CountdownTimer } from "@/components/countdown-timer";
import { Suspense } from "react";

async function getFeaturedEvents() {
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .limit(6)
    .order("event_date", { ascending: true });

  return events || [];
}

function EventsGrid({ events }: { events: any[] }) {
  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.slice(0, 6).map((event, index) => (
        <div
          key={event.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <EventCard
            id={event.id}
            title={event.name}
            type={event.event_type}
            date={event.event_date}
            platform={event.platform}
            isTeamBased={event.is_team_based}
            isPaid={event.is_paid}
            price={event.price}
          />
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#131943] via-[#556492] to-[#7683A4] py-12 sm:py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* Optimized Floating Elements */}
        <div className="absolute top-20 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-r from-[#84C25D]/10 to-[#6ba348]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-4 sm:right-20 w-12 sm:w-24 h-12 sm:h-24 bg-gradient-to-r from-[#556492]/10 to-[#7683A4]/10 rounded-full blur-xl animate-bounce"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_400px] lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center rounded-full border border-[#84C25D]/20 bg-[#84C25D]/10 px-3 py-1 text-xs sm:text-sm text-[#84C25D] animate-pulse">
                  <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  4th Edition • Bigger & Better
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-white animate-fade-in-up">
                  Adamjee Cantonment College
                </h1>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-[#84C25D] animate-fade-in-up animation-delay-200">
                  IT Carnival 4.0
                </h2>
                <p className="max-w-[600px] text-[#D4D4D6] text-sm sm:text-lg md:text-xl leading-relaxed animate-fade-in-up animation-delay-400">
                  Join us for an electrifying celebration of technology,
                  innovation, and creativity at Dhaka Cantonment. Compete,
                  learn, and connect with the brightest minds in tech.
                </p>
              </div>

              <div className="animate-fade-in-up animation-delay-600">
                <CountdownTimer targetDate="2025-08-15T00:00:00" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up animation-delay-800">
                <Link href="/events">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-[#84C25D] hover:bg-[#6ba348] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Explore Events
                  </Button>
                </Link>
                <Link href="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-[#7683A4] text-[#EBEBEB] hover:bg-[#7683A4]/20 transition-all duration-300"
                  >
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center animate-fade-in-up animation-delay-1000">
              <div className="relative h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] md:h-[300px] md:w-[300px] lg:h-[350px] lg:w-[350px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#84C25D]/30 to-[#7683A4]/30 blur-3xl animate-pulse"></div>
                <div className="relative h-full w-full rounded-full bg-gradient-to-br from-[#556492]/50 to-[#7683A4]/50 flex items-center justify-center backdrop-blur-sm border border-[#84C25D]/20">
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-[#84C25D] drop-shadow-2xl animate-pulse">
                    4.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Info Cards */}
      <section className="bg-[#1a1f4a] py-8 sm:py-16 border-t border-[#556492]/20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CalendarDays,
                title: "August 15-17, 2025",
                description:
                  "Three days of exciting tech events and competitions",
                delay: 0,
              },
              {
                icon: MapPin,
                title: "Dhaka Cantonment",
                description: "Adamjee Cantonment College, Dhaka",
                delay: 100,
              },
              {
                icon: Users,
                title: "500+ Participants",
                description: "Expected participants from across the country",
                delay: 200,
              },
              {
                icon: Trophy,
                title: "₹1,00,000+ Prizes",
                description: "Amazing prizes and recognition await",
                delay: 300,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group flex flex-col items-center space-y-3 rounded-xl bg-gradient-to-br from-[#556492]/20 to-[#7683A4]/20 p-4 sm:p-6 backdrop-blur-sm border border-[#556492]/30 hover:border-[#84C25D]/50 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${item.delay}ms` }}
              >
                <item.icon className="h-8 w-8 sm:h-12 sm:w-12 text-[#84C25D] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg sm:text-xl font-bold text-white text-center">
                  {item.title}
                </h3>
                <p className="text-center text-[#D4D4D6] text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-8 sm:py-16 bg-gradient-to-b from-[#1a1f4a] to-[#131943]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white animate-fade-in-up">
                Featured Events
              </h2>
              <p className="mx-auto max-w-[700px] text-[#D4D4D6] text-sm sm:text-lg md:text-xl animate-fade-in-up animation-delay-200">
                Explore our exciting lineup of competitions and showcase your
                skills
              </p>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-[#556492]/20 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <EventsGrid events={featuredEvents} />
          </Suspense>
          <div className="mt-8 sm:mt-12 flex justify-center animate-fade-in-up animation-delay-800">
            <Link href="/events">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#84C25D] to-[#6ba348] hover:from-[#6ba348] hover:to-[#84C25D] text-white shadow-lg transition-all duration-300"
              >
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#556492] via-[#7683A4] to-[#556492] py-8 sm:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white animate-fade-in-up">
                Ready to Showcase Your Skills?
              </h2>
              <p className="mx-auto max-w-[700px] text-[#EBEBEB] text-sm sm:text-lg md:text-xl animate-fade-in-up animation-delay-200">
                Don't miss this incredible opportunity to compete with the best
                minds, learn from experts, and win amazing prizes at ACC IT
                Carnival 4.0
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
              <Link href="/events">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#84C25D] hover:bg-[#6ba348] text-white shadow-lg transition-all duration-300"
                >
                  <Trophy className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Register Now
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#556492] transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
