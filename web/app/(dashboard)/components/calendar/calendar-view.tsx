"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { PreventiveMaintenanceDrawer } from "@/app/(dashboard)/components/drawers/maintenance/preventive-maintenance-drawer"
import { ManagerRequestDrawer } from "@/app/(dashboard)/components/drawers/maintenance/manager-request-drawer"
import { Id } from "@/convex/_generated/dataModel"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const priorityColors = {
    critical: "bg-red-500/20 border-red-500/40 text-red-300",
    high: "bg-orange-500/20 border-orange-500/40 text-orange-300",
    medium: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
    low: "bg-zinc-500/20 border-zinc-500/40 text-zinc-300",
}

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedRequestId, setSelectedRequestId] = useState<Id<"maintenanceRequests"> | null>(null)
    const [showCreateDrawer, setShowCreateDrawer] = useState(false)

    // Get start and end of month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    // Get start and end of calendar view (including padding days)
    const startDay = startOfMonth.getDay()
    const calendarStart = new Date(startOfMonth)
    calendarStart.setDate(calendarStart.getDate() - startDay)

    const calendarEnd = new Date(endOfMonth)
    const endDay = endOfMonth.getDay()
    calendarEnd.setDate(calendarEnd.getDate() + (6 - endDay))

    // Fetch scheduled maintenance for the month
    const scheduledMaintenance = useQuery(api.calendar.getScheduledMaintenance, {
        startDate: calendarStart.getTime(),
        endDate: calendarEnd.getTime(),
    })

    // Generate calendar days
    const calendarDays: Date[] = []
    const current = new Date(calendarStart)
    while (current <= calendarEnd) {
        calendarDays.push(new Date(current))
        current.setDate(current.getDate() + 1)
    }

    // Group maintenance by date
    const maintenanceByDate = new Map<string, typeof scheduledMaintenance>()
    scheduledMaintenance?.forEach((request) => {
        if (request.scheduledDate) {
            const dateKey = new Date(request.scheduledDate).toDateString()
            if (!maintenanceByDate.has(dateKey)) {
                maintenanceByDate.set(dateKey, [])
            }
            maintenanceByDate.get(dateKey)?.push(request)
        }
    })

    const handleDateClick = (date: Date) => {
        // Only allow creating on future dates or today
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (date >= today) {
            setSelectedDate(date)
            setShowCreateDrawer(true)
        }
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const handleToday = () => {
        setCurrentDate(new Date())
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth()
    }

    return (
        <div className="flex flex-col h-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrevMonth}
                            className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white hover:border-white/20"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleToday}
                            className="h-9 px-4 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white hover:border-white/20 font-medium"
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextMonth}
                            className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white hover:border-white/20"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Button
                    onClick={() => {
                        setSelectedDate(new Date())
                        setShowCreateDrawer(true)
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2 shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Schedule Maintenance
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-[#0B0B0D]/50 rounded-xl border border-white/5 p-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-zinc-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, index) => {
                        const dateKey = date.toDateString()
                        const dayMaintenance = maintenanceByDate.get(dateKey) || []
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

                        return (
                            <div
                                key={index}
                                onClick={() => !isPast && handleDateClick(date)}
                                className={cn(
                                    "min-h-[120px] p-2 rounded-lg border transition-all",
                                    isCurrentMonth(date)
                                        ? "bg-[#121214] border-white/10"
                                        : "bg-[#0B0B0D] border-white/5",
                                    !isPast && "cursor-pointer hover:border-white/20 hover:bg-[#1a1a1c]",
                                    isPast && "opacity-50 cursor-not-allowed",
                                    isToday(date) && "ring-2 ring-indigo-500/50"
                                )}
                            >
                                {/* Date Number */}
                                <div className={cn(
                                    "text-sm font-medium mb-2",
                                    isCurrentMonth(date) ? "text-white" : "text-zinc-600",
                                    isToday(date) && "text-indigo-400"
                                )}>
                                    {date.getDate()}
                                </div>

                                {/* Maintenance Events */}
                                <div className="space-y-1">
                                    {dayMaintenance.slice(0, 3).map((request) => (
                                        <div
                                            key={request._id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedRequestId(request._id)
                                            }}
                                            className={cn(
                                                "text-[10px] px-2 py-1 rounded border cursor-pointer hover:scale-105 transition-transform truncate",
                                                priorityColors[request.priority as keyof typeof priorityColors] || priorityColors.medium
                                            )}
                                        >
                                            {request.equipment?.name || request.subject}
                                        </div>
                                    ))}
                                    {dayMaintenance.length > 3 && (
                                        <div className="text-[10px] text-zinc-500 px-2">
                                            +{dayMaintenance.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Create Preventive Maintenance Drawer */}
            <PreventiveMaintenanceDrawer
                open={showCreateDrawer}
                onOpenChange={setShowCreateDrawer}
                prefilledDate={selectedDate || undefined}
            />

            {/* View/Edit Request Drawer */}
            {selectedRequestId && (
                <ManagerRequestDrawer
                    requestId={selectedRequestId}
                    open={!!selectedRequestId}
                    onOpenChange={(open) => !open && setSelectedRequestId(null)}
                />
            )}
        </div>
    )
}
