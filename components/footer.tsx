import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-[#556492]/20 bg-gradient-to-b from-[#131943] to-[#0f1235]">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#84C25D] to-[#6ba348]">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">ACC IT Carnival</span>
                <span className="text-xs text-[#84C25D] font-medium">4.0</span>
              </div>
            </Link>
            <p className="text-sm text-[#D4D4D6] max-w-xs">
              The premier technology event at Adamjee Cantonment College, bringing together the brightest minds in tech.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-[#D4D4D6] hover:text-[#84C25D] transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-[#D4D4D6] hover:text-[#84C25D] transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-[#D4D4D6] hover:text-[#84C25D] transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#D4D4D6]">
              <li>
                <Link href="/events" className="hover:text-[#84C25D] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-[#84C25D] transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#84C25D] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#84C25D] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-[#84C25D] transition-colors">
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Contact Info</h3>
            <ul className="space-y-3 text-sm text-[#D4D4D6]">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#84C25D]" />
                itcarnival@acc.edu.bd
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#84C25D]" />
                +880 1234 567890
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#84C25D] mt-0.5" />
                <span>
                  Adamjee Cantonment College
                  <br />
                  Dhaka Cantonment, Dhaka
                </span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Event Info</h3>
            <ul className="space-y-2 text-sm text-[#D4D4D6]">
              <li>📅 August 15-17, 2025</li>
              <li>🏆 12+ Competitions</li>
              <li>💰 ₹1,00,000+ Prizes</li>
              <li>👥 500+ Participants</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[#556492]/20 pt-6 text-center text-sm text-[#D4D4D6]">
          <p>© {new Date().getFullYear()} Adamjee Cantonment College IT Carnival 4.0. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
