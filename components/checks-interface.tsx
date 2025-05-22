"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, CreditCard, FileCheck, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockChecks } from "@/lib/mock-data"
import type { Check } from "@/lib/types"

export default function ChecksInterface() {
  const [checks, setChecks] = useState<Check[]>(mockChecks)
  const [filteredChecks, setFilteredChecks] = useState<Check[]>(mockChecks)
  const [checkNumber, setCheckNumber] = useState("")
  const [creditCardNumber, setCreditCardNumber] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isMobile, setIsMobile] = useState(false)

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Filter checks based on selected criteria
  useEffect(() => {
    let filtered = [...checks]

    if (checkNumber) {
      filtered = filtered.filter((check) => check.checkNumber.toString().includes(checkNumber))
    }

    if (creditCardNumber) {
      filtered = filtered.filter((check) => check.creditCardNumber.includes(creditCardNumber))
    }

    if (date) {
      const selectedDate = format(date, "yyyy-MM-dd")
      filtered = filtered.filter((check) => format(new Date(check.date), "yyyy-MM-dd") === selectedDate)
    }

    setFilteredChecks(filtered)
  }, [checks, checkNumber, creditCardNumber, date])

  // Reset all filters
  const resetFilters = () => {
    setCheckNumber("")
    setCreditCardNumber("")
    setDate(undefined)
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Check Management</h1>
          <p className="text-muted-foreground">View and filter your check transactions</p>
        </div>

        {/* Desktop Filter */}
        <div className="hidden md:flex items-end gap-4 p-6 bg-white dark:bg-slate-950 rounded-lg shadow-sm border">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="checkNumber">Check Number</Label>
            <div className="relative">
              <FileCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="checkNumber"
                placeholder="Enter check number"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2 flex-1">
            <Label htmlFor="creditCardNumber">Credit Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="creditCardNumber"
                placeholder="Enter credit card number"
                value={creditCardNumber}
                onChange={(e) => setCreditCardNumber(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {(checkNumber || creditCardNumber || date) && (
                  <Badge variant="secondary" className="ml-2">
                    {[checkNumber ? 1 : 0, creditCardNumber ? 1 : 0, date ? 1 : 0].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Checks</SheetTitle>
                <SheetDescription>Apply filters to find specific checks</SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="mobileCheckNumber">Check Number</Label>
                  <div className="relative">
                    <FileCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobileCheckNumber"
                      placeholder="Enter check number"
                      value={checkNumber}
                      onChange={(e) => setCheckNumber(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mobileCreditCardNumber">Credit Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobileCreditCardNumber"
                      placeholder="Enter credit card number"
                      value={creditCardNumber}
                      onChange={(e) => setCreditCardNumber(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredChecks.length} of {checks.length} checks
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-hidden rounded-lg border bg-white dark:bg-slate-950 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Check #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Credit Card</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChecks.length > 0 ? (
                filteredChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium">{check.checkNumber}</TableCell>
                    <TableCell>{format(new Date(check.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>•••• {check.creditCardNumber.slice(-4)}</TableCell>
                    <TableCell>{check.payee}</TableCell>
                    <TableCell className="text-right">{formatCurrency(check.amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(check.status)} variant="outline">
                        {check.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No checks found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredChecks.length > 0 ? (
            filteredChecks.map((check) => (
              <Card key={check.id}>
                <CardContent className="p-4 grid gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Check #{check.checkNumber}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(check.date), "MMM d, yyyy")}</p>
                    </div>
                    <Badge className={getStatusColor(check.status)} variant="outline">
                      {check.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payee</p>
                      <p>{check.payee}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">{formatCurrency(check.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Card</p>
                      <p>•••• {check.creditCardNumber.slice(-4)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No checks found matching your filters.</p>
              <Button variant="link" onClick={resetFilters} className="mt-2">
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
