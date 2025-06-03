"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { updateStatsForEventRegistration } from "@/lib/achievements";
import { motion } from "framer-motion";

interface RegisterButtonProps {
  eventId: number;
  isTeamBased: boolean;
  registrationDeadline: string;
  isActive: boolean;
}

export default function RegisterButton({
  eventId,
  isTeamBased,
  registrationDeadline,
  isActive,
}: RegisterButtonProps) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null
  );

  // Check if the user is already registered
  const checkRegistration = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("status")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking registration:", error);
        return;
      }

      if (data) {
        setIsRegistered(true);
        setRegistrationStatus(data.status);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  // Check registration on component mount
  useState(() => {
    if (isSignedIn) {
      checkRegistration();
    }
  });

  const handleRegister = async () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to register for this event",
        variant: "destructive",
      });
      return;
    }

    if (!isActive) {
      toast({
        title: "Registration closed",
        description: "This event is no longer accepting registrations",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const deadline = new Date(registrationDeadline);
    if (now > deadline) {
      toast({
        title: "Registration deadline passed",
        description: "The registration deadline for this event has passed",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);

    try {
      if (isTeamBased) {
        router.push(`/register/${eventId}`);
      } else {
        // For individual events, register directly
        const { error } = await supabase.from("registrations").insert({
          user_id: user?.id,
          event_id: eventId,
          registration_date: new Date().toISOString(),
          status: "confirmed",
        });

        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation - already registered
            toast({
              title: "Already registered",
              description: "You are already registered for this event",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          // Update achievements and stats
          await updateStatsForEventRegistration(user!.id, eventId);

          toast({
            title: "Registration successful",
            description: "You have successfully registered for this event",
          });
          setIsRegistered(true);
          setRegistrationStatus("confirmed");
        }
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "Registration failed",
        description:
          "There was an error registering for this event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="space-y-2">
        <Button
          disabled
          className={`w-full ${
            registrationStatus === "confirmed"
              ? "bg-green-600 hover:bg-green-700"
              : registrationStatus === "pending"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {registrationStatus === "confirmed"
            ? "Registered ✓"
            : registrationStatus === "pending"
              ? "Registration Pending"
              : "Registration " + registrationStatus}
        </Button>
        <p className="text-xs text-center text-[#D4D4D6]">
          {registrationStatus === "confirmed"
            ? "You're all set! Check your email for details."
            : registrationStatus === "pending"
              ? "Your registration is being processed."
              : "Registration status: " + registrationStatus}
        </p>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleRegister}
        disabled={isRegistering || !isActive}
        className="w-full bg-[#84C25D] hover:bg-[#6ba348] text-white"
      >
        {isRegistering ? "Registering..." : "Register Now"}
      </Button>
    </motion.div>
  );
}
