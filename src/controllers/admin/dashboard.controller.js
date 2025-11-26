import { getDashboardInfo } from "../../services/admin/dashboard.services.js";

export const getAllDashboard = async (req, res) => {
    try {
        const data = await getDashboardInfo();
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching dashboard info:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin dashboard'
        });
    }
}
