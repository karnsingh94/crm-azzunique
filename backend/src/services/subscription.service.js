import prisma from '../config/prisma.js';

// ─── helpers ───────────────────────────────────────────────────────────────
function planError(msg, code = 400) {
  const e = new Error(msg);
  e.statusCode = code;
  return e;
}

function formatPlan(p) {
  return {
    id: p.id,
    name: p.name,
    description: p.description || '',
    billingCycle: p.billingCycle,          // MONTHLY | HALF_YEARLY | ANNUAL
    price: p.price?.toString() || '0',
    currency: p.currency || 'INR',
    // Limits
    maxLeads: p.maxLeads ?? null,          // null = unlimited
    maxEmployees: p.maxEmployees ?? null,
    maxLeadSources: p.maxLeadSources ?? null,
    maxCustomers: p.maxCustomers ?? null,
    maxSalesOrders: p.maxSalesOrders ?? null,
    maxProducts: p.maxProducts ?? null,
    // Feature flags
    canUseWebhook: p.canUseWebhook,
    canUseIndiamart: p.canUseIndiamart,
    canUseMeta: p.canUseMeta,
    canUseEmail: p.canUseEmail,
    canUseJustdial: p.canUseJustdial,
    canUseSalesFlow: p.canUseSalesFlow,
    canUseInventory: p.canUseInventory,
    canUseReports: p.canUseReports,
    canUseAuditLog: p.canUseAuditLog,
    isActive: p.isActive,
    isPopular: p.isPopular,
    companiesCount: p._count?.companies ?? 0,
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  };
}

function formatCompanySubscription(c) {
  const hasPlan = Boolean(c.subscriptionPlanId && c.subscriptionPlan);
  const isExpired = Boolean(c.subscriptionEndDate && new Date() > new Date(c.subscriptionEndDate));
  let subStatus = c.subscriptionStatus || (hasPlan ? 'ACTIVE' : 'TRIAL');
  if (!hasPlan) {
    subStatus = 'TRIAL';
  } else if (isExpired) {
    subStatus = 'EXPIRED';
  }

  return {
    companyId: c.id,
    companyName: c.organizationName,
    email: c.email,
    status: c.status,
    subscriptionPlanId: c.subscriptionPlanId || null,
    subscriptionStatus: subStatus,
    subscriptionStartDate: c.subscriptionStartDate?.toISOString() || null,
    subscriptionEndDate: c.subscriptionEndDate?.toISOString() || null,
    plan: c.subscriptionPlan ? formatPlan({ ...c.subscriptionPlan, _count: {} }) : null,
    isExpired,
  };
}

// ─── SUBSCRIPTION PLAN CRUD ────────────────────────────────────────────────
const DEFAULT_SEEDED_PLANS = [
  // ─── STARTER TIER ───
  {
    name: 'Starter CRM',
    description: 'Ideal for small sales teams starting their lead pipeline.',
    billingCycle: 'MONTHLY',
    price: 1999,
    currency: 'INR',
    maxLeads: 500,
    maxEmployees: 5,
    maxLeadSources: 2,
    maxCustomers: 100,
    maxSalesOrders: 50,
    maxProducts: 50,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: false,
    canUseMeta: false,
    canUseJustdial: false,
    canUseSalesFlow: true,
    canUseInventory: false,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: false,
  },
  {
    name: 'Starter CRM',
    description: 'Ideal for small sales teams. Save ~16% with 6-month billing.',
    billingCycle: 'HALF_YEARLY',
    price: 9999,
    currency: 'INR',
    maxLeads: 500,
    maxEmployees: 5,
    maxLeadSources: 2,
    maxCustomers: 100,
    maxSalesOrders: 50,
    maxProducts: 50,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: false,
    canUseMeta: false,
    canUseJustdial: false,
    canUseSalesFlow: true,
    canUseInventory: false,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: false,
  },
  {
    name: 'Starter CRM',
    description: 'Ideal for small sales teams. Save ~25% with annual billing.',
    billingCycle: 'ANNUAL',
    price: 17999,
    currency: 'INR',
    maxLeads: 500,
    maxEmployees: 5,
    maxLeadSources: 2,
    maxCustomers: 100,
    maxSalesOrders: 50,
    maxProducts: 50,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: false,
    canUseMeta: false,
    canUseJustdial: false,
    canUseSalesFlow: true,
    canUseInventory: false,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: false,
  },

  // ─── GROWTH / PROFESSIONAL TIER ───
  {
    name: 'Growth Professional',
    description: 'Complete CRM for growing businesses with IndiaMART and multi-channel lead ingestion.',
    billingCycle: 'MONTHLY',
    price: 4999,
    currency: 'INR',
    maxLeads: 2500,
    maxEmployees: 15,
    maxLeadSources: 4,
    maxCustomers: 500,
    maxSalesOrders: 250,
    maxProducts: 200,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: true,
    canUseJustdial: true,
    canUseMeta: false,
    canUseSalesFlow: true,
    canUseInventory: true,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: true,
  },
  {
    name: 'Growth Professional',
    description: 'Complete CRM with IndiaMART & Justdial. Save ~16% with 6-month commitment.',
    billingCycle: 'HALF_YEARLY',
    price: 24999,
    currency: 'INR',
    maxLeads: 2500,
    maxEmployees: 15,
    maxLeadSources: 4,
    maxCustomers: 500,
    maxSalesOrders: 250,
    maxProducts: 200,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: true,
    canUseJustdial: true,
    canUseMeta: false,
    canUseSalesFlow: true,
    canUseInventory: true,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: true,
  },
  {
    name: 'Growth Professional',
    description: 'Best Value! Complete CRM with IndiaMART & Justdial. Save ~25% annually.',
    billingCycle: 'ANNUAL',
    price: 44999,
    currency: 'INR',
    maxLeads: 2500,
    maxEmployees: 15,
    maxLeadSources: 4,
    maxCustomers: 500,
    maxSalesOrders: 250,
    maxProducts: 200,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: true,
    canUseJustdial: true,
    canUseMeta: false,
    canUseSalesFlow: true,
    canUseInventory: true,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: true,
  },

  // ─── ENTERPRISE TIER ───
  {
    name: 'Enterprise Unlimited',
    description: 'Unlimited leads, Meta Facebook/Instagram Ads, and full enterprise sales automation.',
    billingCycle: 'MONTHLY',
    price: 9999,
    currency: 'INR',
    maxLeads: null,
    maxEmployees: 50,
    maxLeadSources: null,
    maxCustomers: null,
    maxSalesOrders: null,
    maxProducts: null,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: true,
    canUseJustdial: true,
    canUseMeta: true,
    canUseSalesFlow: true,
    canUseInventory: true,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: false,
  },
  {
    name: 'Enterprise Unlimited',
    description: 'Unlimited leads & all integrations. Save ~16% with 6-month billing.',
    billingCycle: 'HALF_YEARLY',
    price: 49999,
    currency: 'INR',
    maxLeads: null,
    maxEmployees: 50,
    maxLeadSources: null,
    maxCustomers: null,
    maxSalesOrders: null,
    maxProducts: null,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: true,
    canUseJustdial: true,
    canUseMeta: true,
    canUseSalesFlow: true,
    canUseInventory: true,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: false,
  },
  {
    name: 'Enterprise Unlimited',
    description: 'VIP Enterprise: Unlimited leads, unlimited employees, all lead channels. Save ~25% annually.',
    billingCycle: 'ANNUAL',
    price: 89999,
    currency: 'INR',
    maxLeads: null,
    maxEmployees: null,
    maxLeadSources: null,
    maxCustomers: null,
    maxSalesOrders: null,
    maxProducts: null,
    canUseWebhook: true,
    canUseEmail: true,
    canUseIndiamart: true,
    canUseJustdial: true,
    canUseMeta: true,
    canUseSalesFlow: true,
    canUseInventory: true,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: false,
  },
];

export const subscriptionService = {

  async listPlans() {
    let plans = await prisma.subscriptionPlan.findMany({
      orderBy: [{ billingCycle: 'asc' }, { price: 'asc' }],
      include: { _count: { select: { companies: true } } },
    });

    if (plans.length === 0) {
      for (const p of DEFAULT_SEEDED_PLANS) {
        await prisma.subscriptionPlan.create({ data: p });
      }
      plans = await prisma.subscriptionPlan.findMany({
        orderBy: [{ billingCycle: 'asc' }, { price: 'asc' }],
        include: { _count: { select: { companies: true } } },
      });
    }

    return plans.map(formatPlan);
  },

  async getPlanById(id) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: { _count: { select: { companies: true } } },
    });
    if (!plan) throw planError('Subscription plan not found.', 404);
    return formatPlan(plan);
  },

  async createPlan(data) {
    const {
      name, description, billingCycle, price, currency,
      maxLeads, maxEmployees, maxLeadSources, maxCustomers, maxSalesOrders, maxProducts,
      canUseWebhook, canUseIndiamart, canUseMeta, canUseEmail, canUseJustdial,
      canUseSalesFlow, canUseInventory, canUseReports, canUseAuditLog,
      isActive, isPopular,
    } = data;

    if (!name?.trim()) throw planError('Plan name is required.');
    if (!['MONTHLY', 'HALF_YEARLY', 'ANNUAL'].includes(billingCycle)) {
      throw planError('billingCycle must be MONTHLY, HALF_YEARLY, or ANNUAL.');
    }

    const existing = await prisma.subscriptionPlan.findFirst({ where: { name: name.trim(), billingCycle } });
    if (existing) throw planError(`A ${billingCycle} plan named "${name.trim()}" already exists.`);

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        billingCycle,
        price: parseFloat(price) || 0,
        currency: currency || 'INR',
        maxLeads: maxLeads != null ? parseInt(maxLeads) : null,
        maxEmployees: maxEmployees != null ? parseInt(maxEmployees) : null,
        maxLeadSources: maxLeadSources != null ? parseInt(maxLeadSources) : null,
        maxCustomers: maxCustomers != null ? parseInt(maxCustomers) : null,
        maxSalesOrders: maxSalesOrders != null ? parseInt(maxSalesOrders) : null,
        maxProducts: maxProducts != null ? parseInt(maxProducts) : null,
        canUseWebhook: Boolean(canUseWebhook),
        canUseIndiamart: Boolean(canUseIndiamart),
        canUseMeta: Boolean(canUseMeta),
        canUseEmail: Boolean(canUseEmail),
        canUseJustdial: Boolean(canUseJustdial),
        canUseSalesFlow: canUseSalesFlow !== false,
        canUseInventory: Boolean(canUseInventory),
        canUseReports: Boolean(canUseReports),
        canUseAuditLog: Boolean(canUseAuditLog),
        isActive: isActive !== false,
        isPopular: Boolean(isPopular),
      },
      include: { _count: { select: { companies: true } } },
    });
    return formatPlan(plan);
  },

  async updatePlan(id, data) {
    const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!existing) throw planError('Plan not found.', 404);

    const updateData = {};
    if (data.name !== undefined) updateData.name = String(data.name).trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.billingCycle !== undefined) {
      if (!['MONTHLY', 'HALF_YEARLY', 'ANNUAL'].includes(data.billingCycle)) throw planError('Invalid billingCycle.');
      updateData.billingCycle = data.billingCycle;
    }
    if (data.price !== undefined) updateData.price = parseFloat(data.price) || 0;
    if (data.currency !== undefined) updateData.currency = data.currency;

    // Limits (null = unlimited, number = capped)
    const limitFields = ['maxLeads','maxEmployees','maxLeadSources','maxCustomers','maxSalesOrders','maxProducts'];
    for (const f of limitFields) {
      if (data[f] !== undefined) updateData[f] = data[f] === '' || data[f] === null ? null : parseInt(data[f]);
    }

    // Feature flags
    const flags = ['canUseWebhook','canUseIndiamart','canUseMeta','canUseEmail','canUseJustdial','canUseSalesFlow','canUseInventory','canUseReports','canUseAuditLog','isActive','isPopular'];
    for (const f of flags) {
      if (data[f] !== undefined) updateData[f] = Boolean(data[f]);
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { companies: true } } },
    });
    return formatPlan(plan);
  },

  async deletePlan(id) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: { _count: { select: { companies: true } } },
    });
    if (!plan) throw planError('Plan not found.', 404);
    if (plan._count.companies > 0) {
      throw planError(`Cannot delete — ${plan._count.companies} company(ies) are on this plan. Reassign them first.`, 409);
    }
    await prisma.subscriptionPlan.delete({ where: { id } });
  },

  // ─── ASSIGN PLAN TO COMPANY ────────────────────────────────────────────
  async assignPlanToCompany(companyId, { planId, subscriptionStatus, startDate, endDate }) {
    const company = await prisma.clientAdmin.findUnique({ where: { id: companyId } });
    if (!company) throw planError('Company not found.', 404);

    if (planId) {
      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
      if (!plan) throw planError('Subscription plan not found.', 404);
    }

    const updated = await prisma.clientAdmin.update({
      where: { id: companyId },
      data: {
        subscriptionPlanId: planId || null,
        subscriptionStatus: subscriptionStatus || 'ACTIVE',
        subscriptionStartDate: startDate ? new Date(startDate) : new Date(),
        subscriptionEndDate: endDate ? new Date(endDate) : null,
      },
      include: { subscriptionPlan: true },
    });

    return formatCompanySubscription(updated);
  },

  async listCompanySubscriptions() {
    const companies = await prisma.clientAdmin.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { subscriptionPlan: true },
    });
    return companies.map(formatCompanySubscription);
  },

  async getCompanySubscription(companyId) {
    const company = await prisma.clientAdmin.findUnique({
      where: { id: companyId },
      include: { subscriptionPlan: true },
    });
    if (!company) throw planError('Company not found.', 404);
    return formatCompanySubscription(company);
  },
};

export default subscriptionService;

