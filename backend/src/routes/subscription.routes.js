import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller.js';
import { requireSuperAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// ─── Subscription Plans (Super Admin only) ───────────────────────────────
router.get('/subscriptions/plans', subscriptionController.listPlans);
router.post('/subscriptions/plans', requireSuperAdmin, subscriptionController.createPlan);
router.get('/subscriptions/plans/:id', subscriptionController.getPlan);
router.put('/subscriptions/plans/:id', requireSuperAdmin, subscriptionController.updatePlan);
router.delete('/subscriptions/plans/:id', requireSuperAdmin, subscriptionController.deletePlan);

// ─── Company Subscriptions ────────────────────────────────────────────────
router.get('/subscriptions/companies', subscriptionController.listCompanySubscriptions);
router.get('/subscriptions/companies/:companyId', subscriptionController.getCompanySubscription);
router.patch('/subscriptions/companies/:companyId/assign', requireSuperAdmin, subscriptionController.assignPlan);

export default router;

