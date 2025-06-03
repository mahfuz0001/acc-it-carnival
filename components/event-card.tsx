"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, Users, DollarSign, Zap } from "lucide-react"
import { memo } from "react"

interface EventCardProps {
  id: number
  title: string
  type: string
  date: string
  platform: string
  isTeamBased: boolean
  isPaid: boolean
  price: number
}

const getEventIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "programming":
      return "🖥"
    case "design":
      return "🎨"
    case "video":
      return "🎥"
    case "photography":
      return "📷"
    case "quiz":
      return "❓"
    case "presentation":
      return "📊"
    default:
      return "💻"
  }
}

const getEventColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "programming":
      return "#556492"
    case "design":
      return "#84C25D"
    case "video":
      return "#7683A4"
    case "photography":
      return "#84C25D"
    case "quiz":
      return "#556492"
    case "presentation":
      return "#7683A4"
    default:
      return "#556492"
  }
}

const getEventGradient = (type: string) => {
  switch (type.toLowerCase()) {
    case "programming":
      return "from-blue-500/20 via-purple-500/20 to-pink-500/20"
    case "design":
      return "from-green-500/20 via-emerald-500/20 to-teal-500/20"
    case "video":
      return "from-red-500/20 via-orange-500/20 to-yellow-500/20"
    case "photography":
      return "from-purple-500/20 via-pink-500/20 to-rose-500/20"
    case "quiz":
      return "from-indigo-500/20 via-blue-500/20 to-cyan-500/20"
    default:
      return "from-[#84C25D]/20 via-[#6ba348]/20 to-[#84C25D]/20"
  }
}

export const EventCard = memo(function EventCard({
  id,
  title,
  type,
  date,
  platform,
  isTeamBased,
  isPaid,
  price,
}: EventCardProps) {
  const eventColor = getEventColor(type)
  const eventIcon = getEventIcon(type)
  const eventGradient = getEventGradient(type)

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#84C25D]/20 bg-gradient-to-br ${eventGradient} border-[#556492]/30 hover:border-[#84C25D]/50 backdrop-blur-sm hover:-translate-y-2`}
    >
      <CardHeader className="p-0">
        <div
          className="flex items-center justify-center h-24 sm:h-32 relative overflow-hidden"
          style={{ backgroundColor: eventColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
          <span className="text-2xl sm:text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300">
            {eventIcon}
          </span>
          <div className="absolute top-2 right-2">
            {isPaid && (
              <Badge className="bg-[#84C25D] text-white text-xs">
                <DollarSign className="h-3 w-3 mr-1" />৳{price}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#84C25D] transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <Badge variant="outline" className="border-[#84C25D] text-[#84C25D] text-xs ml-2 flex-shrink-0">
            {type}
          </Badge>
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-[#D4D4D6]">
          <div className="flex items-center">
            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#84C25D] flex-shrink-0" />
            <span className="truncate">{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#84C25D] flex-shrink-0" />
            <span className="truncate">{platform}</span>
          </div>
          {isTeamBased && (
            <div className="flex items-center">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#84C25D] flex-shrink-0" />
              <span>Team Event</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Link href={`/events/${id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-[#84C25D] to-[#6ba348] hover:from-[#6ba348] hover:to-[#84C25D] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
})
