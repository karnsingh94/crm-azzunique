import reportsService from '../services/reports.service.js';

export const reportsController = {
  /**
   * Get aggregated CRM, Sales, and Products analytics
   */
  async getAnalytics(req, res, next) {
    try {
      const { companyId } = req.params;
      const result = await reportsService.getCompanyAnalytics(companyId, req.query);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },
};

export default reportsController;
