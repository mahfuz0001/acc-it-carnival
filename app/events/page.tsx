"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/event-card"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { debounce } from "lodash"

interface Event {
  id: number
  name: string
  event_type: string
  event_date: string
  platform: string
  is_team_based: boolean
  is_paid: boolean
  price: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("event_date", { ascending: true })

      setEvents(events || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
    }, 300),
    [],
  )

  const filteredEvents = useMemo(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.event_type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab === "online") {
      filtered = filtered.filter(
        (event) =>
          event.event_type.toLowerCase().includes("online") || event.event_type.toLowerCase().includes("drive"),
      )
    } else if (activeTab === "offline") {
      filtered = filtered.filter(
        (event) =>
          event.event_type.toLowerCase().includes("offline") || event.event_type.toLowerCase().includes("site"),
      )
    }

    return filtered
  }, [events, searchTerm, activeTab])

  const onlineEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          event.event_type.toLowerCase().includes("online") || event.event_type.toLowerCase().includes("drive"),
      ),
    [events],
  )

  const offlineEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          event.event_type.toLowerCase().includes("offline") || event.event_type.toLowerCase().includes("site"),
      ),
    [events],
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#131943] to-[#1a1f4a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-[#84C25D] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#131943] to-[#1a1f4a] relative overflow-hidden">
      {/* Optimized Background Elements */}
      <div className="absolute top-20 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-r from-[#84C25D]/10 to-[#6ba348]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-4 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-r from-[#7683A4]/5 to-[#556492]/5 rounded-full blur-2xl animate-pulse"></div>

      <div className="container px-4 py-8 sm:py-12 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12"
        >
          <div className="space-y-3 sm:space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-[#84C25D]/20 bg-[#84C25D]/10 px-3 py-1 text-xs sm:text-sm text-[#84C25D]"
            >
              <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Discover Amazing Events
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white"
            >
              Events & Competitions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mx-auto max-w-[700px] text-[#D4D4D6] text-sm sm:text-lg md:text-xl"
            >
              Discover exciting competitions across multiple categories and showcase your skills
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              <Badge className="bg-[#84C25D] text-white transition-transform duration-200">
                {events.length}+ Events
              </Badge>
              <Badge className="bg-[#7683A4] text-white transition-transform duration-200">Online & Offline</Badge>
              <Badge className="bg-[#556492] text-white transition-transform duration-200">Individual & Team</Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-6 sm:mb-8 max-w-md mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#D4D4D6]" />
            <Input
              placeholder="Search events..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-10 bg-[#556492]/20 border-[#556492]/30 text-white placeholder:text-[#D4D4D6]/50 focus:border-[#84C25D] transition-colors duration-300"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 bg-[#556492]/20 border border-[#556492]/30">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#84C25D] data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm"
              >
                All ({events.length})
              </TabsTrigger>
              <TabsTrigger
                value="online"
                className="data-[state=active]:bg-[#84C25D] data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm"
              >
                Online ({onlineEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="offline"
                className="data-[state=active]:bg-[#84C25D] data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm"
              >
                Offline ({offlineEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredEvents.map((event) => (
                  <motion.div key={event.id} variants={itemVariants}>
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
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="online">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              >
                {onlineEvents
                  .filter(
                    (event) =>
                      !searchTerm ||
                      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      event.event_type.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((event) => (
                    <motion.div key={event.id} variants={itemVariants}>
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
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="offline">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              >
                {offlineEvents
                  .filter(
                    (event) =>
                      !searchTerm ||
                      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      event.event_type.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((event) => (
                    <motion.div key={event.id} variants={itemVariants}>
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
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 sm:py-16"
          >
            <Filter className="h-12 w-12 sm:h-16 sm:w-16 text-[#84C25D] mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-[#D4D4D6] text-sm sm:text-base">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
