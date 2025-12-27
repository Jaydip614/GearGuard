"use client"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Clock, User, Package, Users, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const stageStyles = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    repaired: "bg-green-500/10 text-green-400 border-green-500/20",
    scrap: "bg-red-500/10 text-red-400 border-red-500/20",
}

const stageLabels = {
    new: "New",
    in_progress: "In Progress",
    repaired: "Repaired",
    scrap: "Scrapped",
}

interface RequestDetailsDrawerProps {
    requestId: Id<"maintenanceRequests">
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function RequestDetailsDrawer({ requestId, open, onOpenChange }: RequestDetailsDrawerProps) {
    const request = useQuery(api.maintenanceRequests.getRequestDetails, { requestId })

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (!request) {
        return null
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-[#0B0B0D] border-l border-white/10 text-white w-full sm:max-w-md p-0 flex flex-col shadow-2xl shadow-black">
                <SheetHeader className="px-6 py-6 border-b border-white/10 bg-white/5">
                    <SheetTitle className="text-xl font-bold tracking-tight text-white">
                        Request Details
                    </SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        View your maintenance request information
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Current Status</span>
                        <span
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium border",
                                stageStyles[request.status as keyof typeof stageStyles]
                            )}
                        >
                            {stageLabels[request.status as keyof typeof stageLabels]}
                        </span>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-500">Subject</label>
                        <p className="text-base text-white font-medium">{request.subject}</p>
                    </div>

                    {/* Equipment */}
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-500 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Equipment
                        </label>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white font-medium">{request.equipment?.name}</p>
                            {request.equipment?.serialNumber && (
                                <p className="text-xs text-zinc-500 mt-1">
                                    Serial: {request.equipment.serialNumber}
                                </p>
                            )}
                            {request.equipment?.department && (
                                <p className="text-xs text-zinc-500">
                                    Department: {request.equipment.department}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Team */}
                    {request.team && (
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-500 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Maintenance Team
                            </label>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-white font-medium">{request.team.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Assigned Technician */}
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-500 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Assigned Technician
                        </label>
                        {request.assignedTechnician ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm text-indigo-400 font-medium">
                                    {request.assignedTechnician.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-medium">
                                        {request.assignedTechnician.name}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {request.assignedTechnician.email}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                <p className="text-sm text-zinc-500">Not yet assigned</p>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <label className="text-sm text-zinc-500 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Timeline
                        </label>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-400">Created</span>
                                <span className="text-white">{formatDate(request.createdAt)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-400">Last Updated</span>
                                <span className="text-white">{formatDate(request.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-300">
                            <strong>Note:</strong> You will be notified when the status of your request changes. If you have any questions, please contact the assigned technician.
                        </p>
                    </div>
                </div>

                <SheetFooter className="flex justify-end p-6 border-t border-white/10 bg-white/5">
                    <SheetClose asChild>
                        <Button
                            variant="outline"
                            className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20 transition-colors"
                        >
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
