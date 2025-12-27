import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { CheckCircle2, Plus, Trash2, Users, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"

const teamSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
})

interface TeamDrawerProps {
    initialData?: {
        _id: Id<"teams">
        name: string
        description?: string
    }
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function TeamDrawer({ initialData, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: TeamDrawerProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    const createTeam = useMutation(api.teams.create)
    const updateTeam = useMutation(api.teams.update)
    const addMember = useMutation(api.teams.addMember)
    const removeMember = useMutation(api.teams.removeMember)

    // Fetch members if editing
    const members = useQuery(api.teams.getMembers, initialData ? { teamId: initialData._id } : "skip")
    // Fetch available users who can be promoted to technicians
    const technicians = useQuery(api.users.getPromotableUsers)
    console.log("Promotable Users:", technicians)

    const form = useForm<z.infer<typeof teamSchema>>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
        },
    })

    // Reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description || "",
            })
        } else {
            form.reset({
                name: "",
                description: "",
            })
        }
    }, [initialData, form])

    const onSubmit = async (data: z.infer<typeof teamSchema>) => {
        try {
            if (initialData) {
                await updateTeam({
                    id: initialData._id,
                    name: data.name,
                    description: data.description,
                })
            } else {
                await createTeam({
                    name: data.name,
                    description: data.description,
                })
            }
            setOpen?.(false)
            if (!initialData) form.reset()
            toast.success(initialData ? "Team updated" : "Team created", {
                description: `${data.name} has been saved.`,
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
            })
        } catch (error) {
            console.error("Failed to save team:", error)
            toast.error("Failed to save team", {
                description: "Please try again later.",
            })
        }
    }

    const handleAddMember = async (userId: string) => {
        if (!initialData) return
        try {
            await addMember({
                teamId: initialData._id,
                userId: userId as Id<"users">,
            })
            toast.success("Member added")
        } catch (error) {
            toast.error("Failed to add member")
        }
    }

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeMember({
                userId: userId as Id<"users">,
            })
            toast.success("Member removed")
        } catch (error) {
            toast.error("Failed to remove member")
        }
    }

    // Filter technicians who are not already in the team
    const availableTechnicians = technicians?.filter(tech =>
        !members?.some(member => member._id === tech._id)
    )

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent className="bg-[#0B0B0D] border-l border-white/10 text-white w-full sm:max-w-md p-0 flex flex-col shadow-2xl shadow-black">
                <SheetHeader className="px-6 py-6 border-b border-white/10 bg-white/5">
                    <SheetTitle className="text-xl font-bold tracking-tight text-white">{initialData ? "Edit Team" : "Create Team"}</SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        {initialData ? "Manage team details and members." : "Add a new maintenance team."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-400 font-medium">Team Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. IT Support" className="bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-400 font-medium">Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Team responsibilities..." className="bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors min-h-[100px] resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white h-11 font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                {initialData ? "Update Team" : "Create Team"}
                            </Button>
                        </form>
                    </Form>

                    {initialData && (
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-zinc-200">Team Members</h3>
                                <div className="w-48 relative">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="h-9 w-full justify-between bg-white/5 border-white/10 text-xs text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                                    >
                                        Add Member
                                        <Plus className="ml-2 h-3 w-3 opacity-50" />
                                    </Button>

                                    {dropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setDropdownOpen(false)}
                                            />
                                            <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a1c] border border-white/10 rounded-lg shadow-xl shadow-black/50 z-99999 overflow-hidden ring-1 ring-white/5">
                                                <div className="p-2 border-b border-white/5">
                                                    <div className="flex items-center px-3 py-1.5 bg-white/5 rounded-md border border-white/5 focus-within:border-white/10 transition-colors">
                                                        <Search className="w-3.5 h-3.5 text-zinc-500 mr-2" />
                                                        <input
                                                            placeholder="Search technicians..."
                                                            className="bg-transparent border-none text-xs text-white placeholder:text-zinc-600 focus:outline-none w-full"
                                                            onClick={(e) => e.stopPropagation()}
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                                <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
                                                    {availableTechnicians?.map((tech) => (
                                                        <div
                                                            key={tech._id}
                                                            onClick={() => {
                                                                handleAddMember(tech._id)
                                                                setDropdownOpen(false)
                                                            }}
                                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer transition-colors group"
                                                        >
                                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 font-medium group-hover:bg-indigo-500/30 transition-colors">
                                                                {tech.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{tech.name}</span>
                                                                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500">{tech.email}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {availableTechnicians?.length === 0 && (
                                                        <div className="px-3 py-6 text-center">
                                                            <p className="text-xs text-zinc-500">No technicians found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {members?.map((member) => (
                                    <div key={member._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group hover:border-white/10 hover:bg-white/[0.07] transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-medium ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-zinc-200 font-medium group-hover:text-white transition-colors">{member.name}</span>
                                                <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{member.email}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                                            onClick={() => handleRemoveMember(member._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {members?.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-lg bg-white/2">
                                        <Users className="w-8 h-8 text-zinc-700 mb-2" />
                                        <p className="text-sm text-zinc-500 font-medium">No members assigned</p>
                                        <p className="text-xs text-zinc-600">Add technicians to this team</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <SheetFooter className="flex justify-end p-6 border-t border-white/10 bg-white/5">
                    <SheetClose asChild>
                        <Button variant="outline" className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20 transition-colors">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
