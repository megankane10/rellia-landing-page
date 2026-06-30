import { Navigate, Route, Routes } from "react-router-dom"
import AdminOverviewPage from "./overview/AdminOverviewPage"
import AdminInboxPage from "./inbox/AdminInboxPage"
import AdminTeamPage from "./team/AdminTeamPage"
import AdminContentRoutes from "./content/AdminContentRoutes"
import AdminHelpPage from "./help/AdminHelpPage"

const AdminDashboard = () => (
  <Routes>
    <Route index element={<Navigate to="overview" replace />} />
    <Route path="overview" element={<AdminOverviewPage />} />
    <Route path="inbox" element={<AdminInboxPage />} />
    <Route path="team" element={<AdminTeamPage />} />
    <Route path="content/*" element={<AdminContentRoutes />} />
    <Route path="help" element={<AdminHelpPage />} />
    {/* Legacy paths */}
    <Route path="submissions" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="drafts" element={<Navigate to="/admin/content" replace />} />
    <Route path="resources" element={<Navigate to="/admin/help" replace />} />
    <Route path="*" element={<Navigate to="/admin/overview" replace />} />
  </Routes>
)

export default AdminDashboard
