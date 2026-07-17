export const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  SALES: "sales",
  SUPPORT: "support",
};

export const createUserRoleOptions = (roleLabels) => [
  { label: roleLabels.CUSTOMER, value: USER_ROLES.CUSTOMER },
  { label: roleLabels.SALES, value: USER_ROLES.SALES },
  { label: roleLabels.SUPPORT, value: USER_ROLES.SUPPORT },
  { label: roleLabels.ADMIN, value: USER_ROLES.ADMIN },
];

export const getUserRoleLabel = (role, roleLabels) => {
  const roleLabelMap = {
    [USER_ROLES.ADMIN]: roleLabels.ADMIN,
    [USER_ROLES.CUSTOMER]: roleLabels.CUSTOMER,
    [USER_ROLES.SALES]: roleLabels.SALES,
    [USER_ROLES.SUPPORT]: roleLabels.SUPPORT,
  };

  return roleLabelMap[role] ?? roleLabels.CUSTOMER;
};
