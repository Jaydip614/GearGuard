/**
 * Role-based permission helpers
 * Centralized logic for determining user capabilities
 */

export type UserRole = "user" | "technician" | "manager";

/**
 * Check if user can manage equipment (create, edit, delete)
 */
export function canManageEquipment(role: UserRole | undefined): boolean {
    return role === "manager";
}

/**
 * Check if user can manage teams (create, edit, assign members)
 */
export function canManageTeams(role: UserRole | undefined): boolean {
    return role === "manager";
}

/**
 * Check if user can assign maintenance requests to technicians
 */
export function canAssignRequests(role: UserRole | undefined): boolean {
    return role === "manager" || role === "technician";
}

/**
 * Check if user can view all maintenance requests (not just their own)
 */
export function canViewAllRequests(role: UserRole | undefined): boolean {
    return role === "manager" || role === "technician";
}

/**
 * Check if user can view Kanban board
 */
export function canViewKanban(role: UserRole | undefined): boolean {
    return role === "manager" || role === "technician";
}

/**
 * Check if user can update request status
 */
export function canUpdateRequestStatus(role: UserRole | undefined): boolean {
    return role === "manager" || role === "technician";
}

/**
 * Check if user can create preventive maintenance requests
 */
export function canCreatePreventiveMaintenance(role: UserRole | undefined): boolean {
    return role === "manager" || role === "technician";
}

/**
 * Get visible tabs for a user based on their role
 */
export function getVisibleTabs(role: UserRole | undefined): string[] {
    if (role === "manager") {
        return ["Maintenance", "Calendar", "Equipment", "Teams", "Reports"];
    }

    if (role === "technician") {
        return ["Maintenance", "Calendar", "Equipment"];
    }

    // Normal users only see Maintenance
    return ["Maintenance"];
}

/**
 * Check if user has admin-level access
 */
export function isAdmin(role: UserRole | undefined): boolean {
    return role === "manager";
}

/**
 * Check if user is a technician or higher
 */
export function isTechnicianOrHigher(role: UserRole | undefined): boolean {
    return role === "technician" || role === "manager";
}
