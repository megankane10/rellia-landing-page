export type CareersOpenRole = {
  id: string
  title: string
  location: string
  employmentType: string
  description: string
  responsibilities: string[]
  linkedInApplyUrl: string
}

/** Source of truth for open roles on /careers#open-roles when `CAREERS_OPEN_ROLES_PUBLISHED` is true — see `shared/careersPageConfig.ts` */
export const CAREERS_OPEN_ROLES: CareersOpenRole[] = []
