import { Navigate, Route, Routes } from "react-router-dom"
import AdminContentPage from "./AdminContentPage"
import AdminNetworkProfileDetailPage from "./AdminNetworkProfileDetailPage"

const AdminContentRoutes = () => (
  <Routes>
    <Route index element={<AdminContentPage />} />
    <Route path="network/:kind/:recordId" element={<AdminNetworkProfileDetailPage />} />
    <Route path="*" element={<Navigate to="/admin/content" replace />} />
  </Routes>
)

export default AdminContentRoutes
