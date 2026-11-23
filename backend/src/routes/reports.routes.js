import { Router } from 'express';
import { requireCompanyUser, validateCompanyAccess } from '../middlewares/auth.middleware.js';
import reportsController from '../controllers/reports.controller.js';

const router = Router();

// Apply tenant validation to all company reports routes
router.use('/companies/:companyId/reports', requireCompanyUser, validateCompanyAccess);

router.get('/companies/:companyId/reports/analytics', reportsController.getAnalytics);

export default router;
