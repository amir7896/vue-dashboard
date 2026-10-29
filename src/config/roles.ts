export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HOME_ROUTES: Record<Role, string> = {
  [ROLES.ADMIN]: "users",
  [ROLES.USER]: "dashboard",
};

export const getRoleHomeRoute = (role: Role) => {
  return ROLE_HOME_ROUTES[role];
};
