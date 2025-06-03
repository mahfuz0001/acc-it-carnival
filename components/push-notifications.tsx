"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Bell, BellOff } from "lucide-react"

export function PushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if push notifications are supported
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      checkSubscriptionStatus()
    }
  }, [])

  async function checkSubscriptionStatus() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error("Error checking subscription status:", error)
    }
  }

  async function subscribeToPush() {
    setIsLoading(true)

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        })
        return
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      // Send subscription to server
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      setIsSubscribed(true)
      toast({
        title: "Notifications enabled",
        description: "You'll now receive push notifications for team invitations and updates.",
      })
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      toast({
        title: "Subscription failed",
        description: "Failed to enable push notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
      }

      // Remove subscription from server
      await fetch("/api/push/unsubscribe", {
        method: "POST",
      })

      setIsSubscribed(false)
      toast({
        title: "Notifications disabled",
        description: "You'll no longer receive push notifications.",
      })
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
      toast({
        title: "Unsubscribe failed",
        description: "Failed to disable push notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Push notifications are not supported in your browser.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>Get notified about team invitations and important updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">Enable push notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications for team invitations, event updates, and more.
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={isSubscribed}
            onCheckedChange={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}
