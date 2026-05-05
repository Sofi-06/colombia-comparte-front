export const ROLE_OPTIONS = [
  { value: 'superadmin', label: 'Superadmin', id: 1 },
  { value: 'admin_pais', label: 'Admin país', id: 2 },
  { value: 'editor', label: 'Editor', id: 3 },
]

export function getRoleIdFromValue(roleValue: string) {
  return ROLE_OPTIONS.find((role) => role.value === roleValue)?.id ?? Number(roleValue)
}

export function getRoleValueFromRecord(
  roleId?: number | string | null,
  roleName?: string,
) {
  const normalizedRoleName = roleName?.trim().toLowerCase()

  if (normalizedRoleName) {
    const byName = ROLE_OPTIONS.find((role) => role.value === normalizedRoleName)

    if (byName) {
      return byName.value
    }
  }

  const byId = ROLE_OPTIONS.find((role) => String(role.id) === String(roleId))
  return byId?.value ?? ''
}
