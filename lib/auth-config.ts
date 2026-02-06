// Authentication and Authorization Configuration

function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    throw new Error('ADMIN_EMAIL environment variable is not set');
  }
  return email;
}

export const AUTH_CONFIG = {
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
  if (!email) return false;
  return email === getAdminEmail();
}

// Helper function to check if user has specific permission
export function hasPermission(permission: string, email?: string | null): boolean {
  if (!isAdmin(email)) return false;
  return AUTH_CONFIG.ADMIN_PERMISSIONS.includes(permission as any);
}

export default AUTH_CONFIG;
