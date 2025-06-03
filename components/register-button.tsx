"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/lib/supabase";
import { motion } from "framer-motion";

interface RegisterButtonProps {
  event: Event;
}

export function RegisterButton({ event }: RegisterButtonProps) {
  const { user, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null
  );
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [formData, setFormData] = useState({
    institution: "",
    phone: "",
    tShirtSize: "",
    teamName: "",
    teamMembers: [""],
  });

  useEffect(() => {
    if (isSignedIn && user) {
      checkExistingRegistration();
    } else {
      setCheckingRegistration(false);
    }
  }, [isSignedIn, user, event.id]);

  const checkExistingRegistration = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("status")
        .eq("user_id", user.id)
        .eq("event_id", event.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setIsRegistered(true);
        setRegistrationStatus(data.status);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < event.team_size_max) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, ""],
      }));
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const updateTeamMember = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? value : member
      ),
    }));
  };

  const handleRegister = async () => {
    if (!isSignedIn || !user) {
      toast.error("Please sign in to register");
      return;
    }

    if (isRegistered) {
      toast.error("You are already registered for this event");
      return;
    }

    setIsLoading(true);

    try {
      // First, create or update user profile
      const { error: userError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        full_name: user.fullName || "",
        institution: formData.institution,
        phone: formData.phone,
        t_shirt_size: formData.tShirtSize,
      });

      if (userError) throw userError;

      if (event.is_team_based) {
        // Create team
        const { data: team, error: teamError } = await supabase
          .from("teams")
          .insert({
            name: formData.teamName,
            leader_id: user.id,
            event_id: event.id,
          })
          .select()
          .single();

        if (teamError) throw teamError;

        // Add team members
        const teamMemberPromises = formData.teamMembers
          .filter((member) => member.trim())
          .map((member) =>
            supabase.from("team_members").insert({
              team_id: team.id,
              user_id: user.id, // This would need to be the actual user ID of the member
              role: "member",
            })
          );

        await Promise.all(teamMemberPromises);

        // Register team for event
        const { error: regError } = await supabase
          .from("registrations")
          .insert({
            user_id: user.id,
            event_id: event.id,
            status: "pending",
          });

        if (regError) throw regError;
      } else {
        // Individual registration
        const { error: regError } = await supabase
          .from("registrations")
          .insert({
            user_id: user.id,
            event_id: event.id,
            status: "pending",
          });

        if (regError) throw regError;
      }

      // Send email notification
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "registration_confirmation",
          to: user.emailAddresses[0]?.emailAddress,
          data: {
            userName: user.fullName,
            eventName: event.name,
            eventDate: event.event_date,
          },
        }),
      });

      // Create notification
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title: "Registration Confirmed!",
          message: `Your registration for ${event.name} has been confirmed.`,
          type: "registration_confirmed",
          data: { event_id: event.id },
        }),
      });

      setIsRegistered(true);
      setRegistrationStatus("pending");
      toast.success("Registration successful!");
      setIsOpen(false);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingRegistration) {
    return (
      <Button disabled className="w-full bg-[#556492]/50 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
        Checking...
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          className="w-full bg-[#84C25D] hover:bg-[#6ba348] text-white"
          asChild
        >
          <a href="/sign-in">Sign In to Register</a>
        </Button>
      </motion.div>
    );
  }

  if (isRegistered) {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "confirmed":
          return "bg-green-500";
        case "pending":
          return "bg-yellow-500";
        case "submitted":
          return "bg-blue-500";
        default:
          return "bg-gray-500";
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "confirmed":
          return <CheckCircle className="h-4 w-4" />;
        case "pending":
          return <Clock className="h-4 w-4" />;
        case "submitted":
          return <CheckCircle className="h-4 w-4" />;
        default:
          return <Clock className="h-4 w-4" />;
      }
    };

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          disabled
          className={`w-full ${getStatusColor(registrationStatus || "")} text-white cursor-not-allowed`}
        >
          {getStatusIcon(registrationStatus || "")}
          <span className="ml-2">
            {registrationStatus === "confirmed" && "Registered ✓"}
            {registrationStatus === "pending" && "Registration Pending"}
            {registrationStatus === "submitted" && "Submitted ✓"}
            {!registrationStatus && "Registered"}
          </span>
        </Button>
      </motion.div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full bg-[#84C25D] hover:bg-[#6ba348] text-white">
            {event.is_team_based ? (
              <>
                <Users className="mr-2 h-4 w-4" />
                Register Team
              </>
            ) : (
              "Register Now"
            )}
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#131943] border-[#556492]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">
              Register for {event.name}
            </DialogTitle>
            <DialogDescription className="text-[#D4D4D6]">
              Fill out the form below to register for this event.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-[#556492]/20 border-[#556492]/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-[#D4D4D6]">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={user?.fullName || ""}
                        disabled
                        className="bg-[#7683A4]/20 border-[#7683A4]/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[#D4D4D6]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={user?.emailAddresses[0]?.emailAddress || ""}
                        disabled
                        className="bg-[#7683A4]/20 border-[#7683A4]/30 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="institution" className="text-[#D4D4D6]">
                        Institution
                      </Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) =>
                          handleInputChange("institution", e.target.value)
                        }
                        placeholder="Your college/university"
                        className="bg-[#7683A4]/20 border-[#7683A4]/30 text-white placeholder:text-[#D4D4D6]/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#D4D4D6]">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+880 1234 567890"
                        className="bg-[#7683A4]/20 border-[#7683A4]/30 text-white placeholder:text-[#D4D4D6]/50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tshirt" className="text-[#D4D4D6]">
                      T-Shirt Size
                    </Label>
                    <Select
                      value={formData.tShirtSize}
                      onValueChange={(value) =>
                        handleInputChange("tShirtSize", value)
                      }
                    >
                      <SelectTrigger className="bg-[#7683A4]/20 border-[#7683A4]/30 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#556492] border-[#7683A4]">
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Information */}
            {event.is_team_based && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-[#84C25D]/20 border-[#84C25D]/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Information
                    </CardTitle>
                    <CardDescription className="text-[#D4D4D6]">
                      Team size: {event.team_size_min}-{event.team_size_max}{" "}
                      members
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="teamName" className="text-[#D4D4D6]">
                        Team Name
                      </Label>
                      <Input
                        id="teamName"
                        value={formData.teamName}
                        onChange={(e) =>
                          handleInputChange("teamName", e.target.value)
                        }
                        placeholder="Enter your team name"
                        className="bg-[#7683A4]/20 border-[#7683A4]/30 text-white placeholder:text-[#D4D4D6]/50"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-[#D4D4D6]">Team Members</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTeamMember}
                          disabled={
                            formData.teamMembers.length >= event.team_size_max
                          }
                          className="border-[#84C25D] text-[#84C25D] hover:bg-[#84C25D]/20"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Member
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.teamMembers.map((member, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-2"
                          >
                            <Input
                              value={member}
                              onChange={(e) =>
                                updateTeamMember(index, e.target.value)
                              }
                              placeholder={`Team member ${index + 1} name`}
                              className="bg-[#7683A4]/20 border-[#7683A4]/30 text-white placeholder:text-[#D4D4D6]/50"
                            />
                            {formData.teamMembers.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeTeamMember(index)}
                                className="border-red-500 text-red-500 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Event Details */}
            {/* <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-[#556492]/20 border-[#556492]/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Event Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#D4D4D6]">Event:</span>
                    <span className="text-white font-medium">{event.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#D4D4D6]">Date:</span>
                    <span className="text-white font-medium">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#D4D4D6]">Registration Fee:</span>
                    <span className="text-white font-medium">
                      {event.is_paid ? `৳${event.price}` : "Free"}
                    </span>
                  </div>
                  {event.is_paid && (
                    <Badge className="bg-yellow-600 text-white">
                      Payment will be processed after registration
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div> */}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 pt-4"
          >
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-[#7683A4] text-[#7683A4] hover:bg-[#7683A4]/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              disabled={isLoading}
              className="flex-1 bg-[#84C25D] hover:bg-[#6ba348] text-white"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
