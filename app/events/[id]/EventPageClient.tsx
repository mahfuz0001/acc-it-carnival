"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Users,
  Clock,
  Award,
  MapPin,
  DollarSign,
  Trophy,
  Star,
  Zap,
  Target,
  Gift,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Timer,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import RegisterButton from "@/components/register-button";

interface EventData {
  id: number;
  name: string;
  description: string;
  event_type: string;
  platform: string;
  event_date: string;
  registration_deadline: string;
  event_time: string | null;
  is_team_based: boolean;
  team_size_min: number;
  team_size_max: number;
  rules: string | null;
  image_url: string | null;
  is_paid: boolean;
  price: number;
  max_participants: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

export default function EventPageClient({
  eventData,
}: {
  eventData: EventData;
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(eventData.event_date).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventData.event_date]);

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "programming":
        return "💻";
      case "design":
        return "🎨";
      case "video":
        return "🎬";
      case "photography":
        return "📸";
      case "quiz":
        return "🧠";
      case "presentation":
        return "📊";
      default:
        return "⚡";
    }
  };

  const getEventGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case "programming":
        return "from-blue-500/20 via-purple-500/20 to-pink-500/20";
      case "design":
        return "from-green-500/20 via-emerald-500/20 to-teal-500/20";
      case "video":
        return "from-red-500/20 via-orange-500/20 to-yellow-500/20";
      case "photography":
        return "from-purple-500/20 via-pink-500/20 to-rose-500/20";
      case "quiz":
        return "from-indigo-500/20 via-blue-500/20 to-cyan-500/20";
      default:
        return "from-[#84C25D]/20 via-[#6ba348]/20 to-[#84C25D]/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "TBA";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRequirements = (rules: string | null): string[] => {
    if (!rules) return [];
    return rules
      .split("\n")
      .filter((line) => line.trim().startsWith("Requirement:"))
      .map((line) => line.replace("Requirement:", "").trim());
  };

  const getPrizes = (rules: string | null): string[] => {
    if (!rules) return [];
    return rules
      .split("\n")
      .filter((line) => line.trim().startsWith("Prize:"))
      .map((line) => line.replace("Prize:", "").trim());
  };

  const requirements = getRequirements(eventData.rules);
  const prizes = getPrizes(eventData.rules);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#131943] via-[#1a1f4a] to-[#0f1235] relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#84C25D]/10 to-[#6ba348]/10 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#556492]/10 to-[#7683A4]/10 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-r from-[#7683A4]/5 to-[#556492]/5 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="animate"
      />

      <div className="container px-4 py-8 md:px-6 relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-[#D4D4D6] mb-8"
        >
          <Link
            href="/events"
            className="hover:text-[#84C25D] transition-colors"
          >
            Events
          </Link>
          <ArrowRight className="h-3 w-3" />
          <span className="text-white">{eventData.name}</span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div variants={itemVariants}>
              <Card
                className={`overflow-hidden bg-gradient-to-br ${getEventGradient(eventData.event_type)} border-[#556492]/30 backdrop-blur-sm`}
              >
                <div className="relative">
                  {eventData.image_url ? (
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <Image
                        src={eventData.image_url || "/placeholder.svg"}
                        alt={eventData.name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">
                            {getEventIcon(eventData.event_type)}
                          </span>
                          <Badge className="bg-[#84C25D] text-white px-3 py-1">
                            {eventData.event_type}
                          </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {eventData.name}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#556492]/20 to-[#7683A4]/20 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl mb-4 block">
                          {getEventIcon(eventData.event_type)}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {eventData.name}
                        </h1>
                        <Badge className="bg-[#84C25D] text-white px-3 py-1">
                          {eventData.event_type}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  {/* Event Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-[#556492]/20 border border-[#556492]/30">
                      <CalendarDays className="h-5 w-5 text-[#84C25D] mx-auto mb-1" />
                      <p className="text-xs text-[#D4D4D6]">Date</p>
                      <p className="text-sm font-medium text-white">
                        {formatDate(eventData.event_date)}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[#556492]/20 border border-[#556492]/30">
                      <Clock className="h-5 w-5 text-[#84C25D] mx-auto mb-1" />
                      <p className="text-xs text-[#D4D4D6]">Time</p>
                      <p className="text-sm font-medium text-white">
                        {formatTime(eventData.event_time)}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[#556492]/20 border border-[#556492]/30">
                      <MapPin className="h-5 w-5 text-[#84C25D] mx-auto mb-1" />
                      <p className="text-xs text-[#D4D4D6]">Platform</p>
                      <p className="text-sm font-medium text-white">
                        {eventData.platform}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[#556492]/20 border border-[#556492]/30">
                      {eventData.is_team_based ? (
                        <>
                          <Users className="h-5 w-5 text-[#84C25D] mx-auto mb-1" />
                          <p className="text-xs text-[#D4D4D6]">Team Size</p>
                          <p className="text-sm font-medium text-white">
                            {eventData.team_size_min === eventData.team_size_max
                              ? eventData.team_size_min
                              : `${eventData.team_size_min}-${eventData.team_size_max}`}
                          </p>
                        </>
                      ) : (
                        <>
                          <Target className="h-5 w-5 text-[#84C25D] mx-auto mb-1" />
                          <p className="text-xs text-[#D4D4D6]">Type</p>
                          <p className="text-sm font-medium text-white">
                            Individual
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-[#D4D4D6] leading-relaxed">
                      {eventData.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-r from-[#84C25D]/20 to-[#6ba348]/20 border-[#84C25D]/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Timer className="h-5 w-5 text-[#84C25D]" />
                      <h3 className="text-xl font-bold text-white">
                        Event Countdown
                      </h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className="bg-[#131943]/50 rounded-lg p-4 border border-[#84C25D]/30">
                            <div className="text-2xl md:text-3xl font-bold text-[#84C25D]">
                              {value.toString().padStart(2, "0")}
                            </div>
                            <div className="text-xs text-[#D4D4D6] capitalize mt-1">
                              {unit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Information Tabs */}
            <motion.div variants={itemVariants}>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#556492]/20 border border-[#556492]/30">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-[#84C25D] data-[state=active]:text-white"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="requirements"
                    className="data-[state=active]:bg-[#84C25D] data-[state=active]:text-white"
                  >
                    Requirements
                  </TabsTrigger>
                  <TabsTrigger
                    value="prizes"
                    className="data-[state=active]:bg-[#84C25D] data-[state=active]:text-white"
                  >
                    Prizes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <Card className="bg-gradient-to-br from-[#556492]/10 to-[#7683A4]/10 border-[#556492]/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#84C25D]" />
                        Event Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-[#D4D4D6]">Event Type:</span>
                            <span className="text-white font-medium">
                              {eventData.event_type}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#D4D4D6]">Platform:</span>
                            <span className="text-white font-medium">
                              {eventData.platform}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#D4D4D6]">
                              Registration Fee:
                            </span>
                            <span className="text-white font-medium">
                              {eventData.is_paid
                                ? `৳${eventData.price}`
                                : "Free"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-[#D4D4D6]">Team Based:</span>
                            <span className="text-white font-medium">
                              {eventData.is_team_based ? "Yes" : "No"}
                            </span>
                          </div>
                          {eventData.max_participants && (
                            <div className="flex justify-between">
                              <span className="text-[#D4D4D6]">
                                Max Participants:
                              </span>
                              <span className="text-white font-medium">
                                {eventData.max_participants}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-[#D4D4D6]">
                              Registration Deadline:
                            </span>
                            <span className="text-white font-medium">
                              {formatDate(eventData.registration_deadline)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <Card className="bg-gradient-to-br from-[#556492]/10 to-[#7683A4]/10 border-[#556492]/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#84C25D]" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {requirements.length > 0 ? (
                        <div className="space-y-3">
                          {requirements.map((requirement, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-[#7683A4]/20"
                            >
                              <CheckCircle className="h-5 w-5 text-[#84C25D] mt-0.5 flex-shrink-0" />
                              <span className="text-[#D4D4D6]">
                                {requirement}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#D4D4D6] text-center py-8">
                          No specific requirements listed. Check back for
                          updates!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="prizes" className="mt-6">
                  <Card className="bg-gradient-to-br from-[#84C25D]/10 to-[#6ba348]/10 border-[#84C25D]/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-[#84C25D]" />
                        Prizes & Recognition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {prizes.length > 0 ? (
                        <div className="space-y-4">
                          {prizes.map((prize, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#84C25D]/20 to-[#6ba348]/20 border border-[#84C25D]/30"
                            >
                              {index === 0 && (
                                <Crown className="h-6 w-6 text-yellow-400" />
                              )}
                              {index === 1 && (
                                <Award className="h-6 w-6 text-gray-400" />
                              )}
                              {index === 2 && (
                                <Star className="h-6 w-6 text-orange-400" />
                              )}
                              {index > 2 && (
                                <Gift className="h-6 w-6 text-[#84C25D]" />
                              )}
                              <span className="text-white font-medium">
                                {prize}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Trophy className="h-12 w-12 text-[#84C25D] mx-auto mb-4" />
                          <p className="text-[#D4D4D6]">
                            Amazing prizes await! Details will be announced
                            soon.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={itemVariants}
              className="sticky top-24 space-y-6"
            >
              {/* Registration Card */}
              <Card className="bg-gradient-to-br from-[#84C25D]/20 to-[#6ba348]/20 border-[#84C25D]/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#84C25D]" />
                    Registration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#D4D4D6]">Registration Fee:</span>
                      <span className="text-white font-medium">
                        {eventData.is_paid ? (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />৳{eventData.price}
                          </span>
                        ) : (
                          "Free"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#D4D4D6]">Deadline:</span>
                      <span className="text-white font-medium">
                        {formatDate(eventData.registration_deadline)}
                      </span>
                    </div>
                    {eventData.max_participants && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#D4D4D6]">
                          Max Participants:
                        </span>
                        <span className="text-white font-medium">
                          {eventData.max_participants}
                        </span>
                      </div>
                    )}
                  </div>
                  <RegisterButton
                    eventId={eventData.id}
                    isTeamBased={eventData.is_team_based}
                    registrationDeadline={eventData.registration_deadline}
                    isActive={eventData.is_active}
                  />
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-gradient-to-br from-[#556492]/10 to-[#7683A4]/10 border-[#556492]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#84C25D]" />
                    Event Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#84C25D] rounded-full" />
                    <span className="text-[#D4D4D6] text-sm">
                      Certificates for all participants
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#84C25D] rounded-full" />
                    <span className="text-[#D4D4D6] text-sm">
                      Exciting prizes for winners
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#84C25D] rounded-full" />
                    <span className="text-[#D4D4D6] text-sm">
                      Network with tech enthusiasts
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#84C25D] rounded-full" />
                    <span className="text-[#D4D4D6] text-sm">
                      Learn from industry experts
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-gradient-to-br from-[#556492]/10 to-[#7683A4]/10 border-[#556492]/30">
                <CardHeader>
                  <CardTitle className="text-white">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#D4D4D6] text-sm mb-4">
                    Have questions about this event? Our support team is here to
                    help!
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-[#84C25D] text-[#84C25D] hover:bg-[#84C25D]/20"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
