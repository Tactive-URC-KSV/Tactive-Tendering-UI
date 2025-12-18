import { MENU_ACCESS } from "./Access";

export const canAccessMenu = (role, menuKey) => {
  if (!role || !menuKey) return false;
  const allowedRoles = MENU_ACCESS[menuKey];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
};
