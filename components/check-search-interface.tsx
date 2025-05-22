"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, CreditCard, FileCheck, Search, Loader2, CheckCircle2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockChecks } from "@/lib/mock-data"
import type { Check } from "@/lib/types"
import { DatePickerInput } from "@mantine/dates"
import "dayjs/locale/en"
import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"


// Shared card styles for both search and invoice
const cardContainerClass = "w-full max-w-md min-h-[400px] h-[500px] flex items-center justify-center"
const cardClass = "shadow-lg border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col w-full h-full"

export default function CheckSearchInterface() {
  const [checkNumber, setCheckNumber] = useState("")
  const [creditCardNumber, setCreditCardNumber] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [foundChecks, setFoundChecks] = useState<Check[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeCheckIndex, setActiveCheckIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (zoomed && preRef.current) {
      const container = preRef.current.parentElement;
      if (container) {
        const pre = preRef.current;
        const scaleX = container.clientWidth / pre.scrollWidth;
        const scaleY = container.clientHeight / pre.scrollHeight;
        const newScale = Math.min(1, scaleX, scaleY);
        setScale(newScale);
      }
    }
  }, [zoomed, foundChecks, activeCheckIndex]);

  // Search for checks based on input criteria
  const handleSearch = () => {
    // Validate that at least one search field is filled
    if (!checkNumber && !creditCardNumber && !date) {
      alert("Please enter at least one search criteria")
      return
    }

    setIsLoading(true)

    // Simulate API call with a delay
    setTimeout(() => {
      let results = [...mockChecks]

      if (checkNumber) {
        results = results.filter((check) => check.checkNumber.toString() === checkNumber)
      }

      if (creditCardNumber) {
        results = results.filter((check) => check.creditCardNumber.includes(creditCardNumber))
      }

      if (date) {
        const selectedDate = format(date, "yyyy-MM-dd")
        results = results.filter((check) => check.date === selectedDate)
      }

      console.log('DEBUG handleSearch:');
      console.log('checkNumber:', checkNumber);
      console.log('creditCardNumber:', creditCardNumber);
      console.log('date:', date);
      console.log('filtered results:', results);

      setFoundChecks(results)
      setSearchPerformed(true)
      if (results.length > 0) setZoomed(true)
      setIsLoading(false)
      setActiveCheckIndex(0)
    }, 800) // Reduced delay for better responsiveness
  }

  // Reset search form
  const handleReset = () => {
    setCheckNumber("")
    setCreditCardNumber("")
    setDate(null)
    setSearchPerformed(false)
    setFoundChecks([])
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cleared":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "bounced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  // Navigate between checks
  const nextCheck = () => {
    if (activeCheckIndex < foundChecks.length - 1) {
      setActiveCheckIndex(activeCheckIndex + 1)
    }
  }

  const prevCheck = () => {
    if (activeCheckIndex > 0) {
      setActiveCheckIndex(activeCheckIndex - 1)
    }
  }

  // Placeholder for sending email
  const handleSendEmail = () => {
    alert("Send Email functionality coming soon!")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-transparent">
      {/* Header - Reduced height */}
      <div className="text-center py-3">
        <div className="inline-flex items-center justify-center mb-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-600 blur-lg opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-full">
              <FileCheck className="h-6 w-6" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Check Finder
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Search for your check by entering the details below
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex justify-center items-start px-4 pb-4 relative min-h-[500px] mt-2">
        <AnimatePresence initial={false} mode="wait">
          {!searchPerformed ? (
            <motion.div
              key="search"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -500, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute left-0 right-0 flex justify-center"
            >
              <div className={cardContainerClass}>
                <Card className={cardClass}>
                  <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b py-3">
                    <CardTitle className="text-lg">Search Checks</CardTitle>
                    <CardDescription className="text-xs">Enter one or more details to find your check</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 flex-1 overflow-auto">
                    <div className="grid gap-4">
                      <div className="grid gap-1">
                        <Label htmlFor="checkNumber" className="text-sm font-medium">
                          Check Number
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-slate-400">
                            <FileCheck className="h-4 w-4" />
                          </div>
                          <Input
                            id="checkNumber"
                            placeholder="Enter check number"
                            value={checkNumber}
                            onChange={(e) => setCheckNumber(e.target.value)}
                            className="pl-9 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="creditCardNumber" className="text-sm font-medium">
                          Credit Card Number
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-slate-400">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <Input
                            id="creditCardNumber"
                            placeholder="Enter credit card number"
                            value={creditCardNumber}
                            onChange={(e) => setCreditCardNumber(e.target.value)}
                            className="pl-9 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium">Date</Label>
                        <DatePickerInput
                          id="date"
                          placeholder="Select date"
                          value={date}
                          onChange={setDate}
                          minDate={new Date(1950, 0, 1)}
                          maxDate={new Date(2050, 11, 31)}
                          popoverProps={{
                            position: 'bottom-start',
                            withinPortal: true,
                            middlewares: { flip: false, shift: false },
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-slate-50 dark:bg-slate-900 border-t py-3">
                    <Button variant="outline" onClick={handleReset} className="border-slate-200 dark:border-slate-700">
                      Clear
                    </Button>
                    {!searchPerformed ? (
                      <Button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                          </>
                        )}
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Zoom Modal - Minimal Test Version */}
      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl p-6"
            style={{ width: "90vw", height: "80vh", overflow: "auto" }}
          >
            <div
              className="absolute left-0 top-0 flex items-center justify-center"
              style={{ width: "100%", height: "100%" }}
            >
              <pre
                ref={preRef}
                className="font-mono rounded-lg border border-dotted border-gray-300 bg-white shadow-2xl whitespace-pre-wrap break-words transition-transform p-6"
                style={{
                  lineHeight: 1.4,
                  transform: `rotate(-0.2deg) scale(${scale}) translate(-50%, -50%)`,
                  transformOrigin: "top left",
                  display: "inline-block",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  zIndex: 10,
                }}
              >
                {foundChecks[activeCheckIndex]?.check}
              </pre>
            </div>
            <button
              onClick={() => {
                setZoomed(false);
                setSearchPerformed(false);
              }}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition z-20"
              aria-label="Close"
              type="button"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
