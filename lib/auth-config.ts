// Authentication and Authorization Configuration
export const AUTH_CONFIG = {
  // Admin user email - only this user can access admin features
  ADMIN_EMAIL: 'arkshelter64@gmail.com',
  
  // Admin route path - hidden from public navigation
  ADMIN_ROUTE: '/arcadiaedenAdmin',
  
  // Roles and permissions
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
  },
  
  // Admin permissions
  ADMIN_PERMISSIONS: [
    'create_post',
    'edit_post',
    'delete_post',
    'publish_post',
    'manage_users',
    'view_analytics',
  ],
} as const;

// Helper function to check if a user is admin
export function isAdmin(email?: string | null): boolean {
  return email === AUTH_CONFIG.ADMIN_EMAIL;
}

// Helper function to check if user has specific permission
export function hasPermission(permission: string, email?: string | null): boolean {
  if (!isAdmin(email)) return false;
  return AUTH_CONFIG.ADMIN_PERMISSIONS.includes(permission as any);
}

export default AUTH_CONFIG; 