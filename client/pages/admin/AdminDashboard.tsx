import { Navigate, Route, Routes } from "react-router-dom"
import AdminInboxPage from "./inbox/AdminInboxPage"
import AdminTeamPage from "./team/AdminTeamPage"
import AdminDraftsPage from "./drafts/AdminDraftsPage"
import AdminHelpPage from "./help/AdminHelpPage"

const AdminDashboard = () => (
  <Routes>
    <Route index element={<Navigate to="inbox" replace />} />
    <Route path="inbox" element={<AdminInboxPage />} />
    <Route path="team" element={<AdminTeamPage />} />
    <Route path="drafts" element={<AdminDraftsPage />} />
    <Route path="help" element={<AdminHelpPage />} />
    {/* Legacy paths */}
    <Route path="overview" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="submissions" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="content" element={<Navigate to="/admin/drafts" replace />} />
    <Route path="resources" element={<Navigate to="/admin/help" replace />} />
    <Route path="*" element={<Navigate to="/admin/inbox" replace />} />
  </Routes>
)

export default AdminDashboard
