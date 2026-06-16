import { useLocation } from "react-router-dom"
import { getAdminPageTitle } from "@/lib/adminNav"
import { adminHeadingClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

const AdminHeaderPageTitle = () => {
  const { pathname } = useLocation()
  const title = getAdminPageTitle(pathname)

  return (
    <h1
      className={cn(
        "truncate font-host-grotesk text-lg font-medium leading-tight tracking-tight md:text-xl",
        adminHeadingClass,
      )}
    >
      {title}
    </h1>
  )
}

export default AdminHeaderPageTitle
