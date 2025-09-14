"use client"

import { useCallback, useEffect, useState } from "react"
import { updateEmailSubscribe, getMemberProfile } from "@/lib/services/member"

interface UseEmailSubscribeResult {
  emailSubscribe: boolean
  setEmailSubscribe: (next: boolean) => Promise<void>
}

// No localStorage coupling for emailSubscribe anymore

export function useEmailSubscribe(defaultValue: boolean = true): UseEmailSubscribeResult {
  const [emailSubscribe, setEmailSubscribeState] = useState<boolean>(defaultValue)

  // hydrate from API on mount
  useEffect(() => {
    const run = async () => {
      try {
        const profile = await getMemberProfile()
        if (typeof profile.emailSubscribe === "boolean") {
          setEmailSubscribeState(profile.emailSubscribe)
          console.log("[emailSubscribe] init", profile.emailSubscribe)
        }
      } catch {}
    }
    run()
  }, [])

  const setEmailSubscribe = useCallback(async (next: boolean) => {
    const prev = emailSubscribe
    setEmailSubscribeState(next)
    try {
      console.log("[emailSubscribe] request", next)
      await updateEmailSubscribe(next)
      console.log("[emailSubscribe] success", next)
    } catch (e) {
      setEmailSubscribeState(prev)
      // Optionally rethrow or log
      console.error("[emailSubscribe] failed", { requested: next, error: e })
    }
  }, [emailSubscribe])

  return { emailSubscribe, setEmailSubscribe }
}


