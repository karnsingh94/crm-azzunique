import subscriptionService from '../services/subscription.service.js';

const subscriptionController = {
  // ─── Plans ───────────────────────────────────────────────────────────────
  async listPlans(req, res, next) {
    try {
      const plans = await subscriptionService.listPlans();
      res.json({ success: true, data: plans });
    } catch (err) { next(err); }
  },

  async getPlan(req, res, next) {
    try {
      const plan = await subscriptionService.getPlanById(req.params.id);
      res.json({ success: true, data: plan });
    } catch (err) { next(err); }
  },

  async createPlan(req, res, next) {
    try {
      const plan = await subscriptionService.createPlan(req.body);
      res.status(201).json({ success: true, data: plan, message: 'Subscription plan created.' });
    } catch (err) { next(err); }
  },

  async updatePlan(req, res, next) {
    try {
      const plan = await subscriptionService.updatePlan(req.params.id, req.body);
      res.json({ success: true, data: plan, message: 'Plan updated successfully.' });
    } catch (err) { next(err); }
  },

  async deletePlan(req, res, next) {
    try {
      await subscriptionService.deletePlan(req.params.id);
      res.json({ success: true, message: 'Plan deleted.' });
    } catch (err) { next(err); }
  },

  // ─── Company Subscriptions ───────────────────────────────────────────────
  async listCompanySubscriptions(req, res, next) {
    try {
      const data = await subscriptionService.listCompanySubscriptions();
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getCompanySubscription(req, res, next) {
    try {
      const data = await subscriptionService.getCompanySubscription(req.params.companyId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async assignPlan(req, res, next) {
    try {
      const data = await subscriptionService.assignPlanToCompany(req.params.companyId, req.body);
      res.json({ success: true, data, message: 'Subscription assigned successfully.' });
    } catch (err) { next(err); }
  },
};

export default subscriptionController;

