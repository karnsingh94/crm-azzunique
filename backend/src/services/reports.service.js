import prisma from '../config/prisma.js';

export const reportsService = {
  /**
   * Aggregate comprehensive CRM, Sales, and Product analytics for a company
   */
  async getCompanyAnalytics(companyId, query = {}) {
    const { period = '30d' } = query;

    // Calculate date threshold based on period
    const now = new Date();
    let startDate = new Date();
    if (period === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (period === '90d') {
      startDate.setDate(now.getDate() - 90);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate = new Date(0); // All time
    }

    // 1. Fetch leads for this company
    const leads = await prisma.lead.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Fetch sales orders for this company
    const salesOrders = await prisma.salesOrder.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Fetch sales quotations
    const quotations = await prisma.salesQuotation.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    // 4. Fetch customers
    const customers = await prisma.crmCustomer.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    // 5. Fetch products
    const products = await prisma.product.findMany({
      where: { companyId },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    // ================= SUMMARY KPIs =================
    const activeOrders = salesOrders.filter((o) => o.status !== 'CANCELLED');
    const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const totalOrdersCount = salesOrders.length;
    const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    const totalQuotesCount = quotations.length;
    const quotesPipelineValue = quotations.reduce((sum, q) => sum + Number(q.amount || 0), 0);

    const convertedQuotes = quotations.filter((q) => q.status === 'CONVERTED' || q.status === 'ACCEPTED').length;
    const quoteConversionRate = totalQuotesCount > 0 ? (convertedQuotes / totalQuotesCount) * 100 : 0;

    const totalLeadsCount = leads.length;
    const wonLeadsCount = leads.filter((l) => l.status === 'WON' || l.convertedCustomerId != null).length;
    const leadConversionRate = totalLeadsCount > 0 ? (wonLeadsCount / totalLeadsCount) * 100 : 0;

    const totalPipelineValue = leads.reduce((sum, l) => sum + Number(l.value || 0), 0);

    // ================= MONTHLY TRENDS =================
    // Generate 6-month historical bucket
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyBuckets = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      const label = `${monthNames[mIdx]} ${String(y).slice(2)}`;
      const key = `${y}-${String(mIdx + 1).padStart(2, '0')}`;

      monthlyBuckets.push({
        key,
        label,
        month: monthNames[mIdx],
        year: y,
        revenue: 0,
        orders: 0,
        quotes: 0,
        leads: 0,
      });
    }

    // Populate actuals into monthly buckets
    salesOrders.forEach((order) => {
      if (order.status === 'CANCELLED') return;
      const orderDate = new Date(order.date || order.createdAt);
      const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      const bucket = monthlyBuckets.find((b) => b.key === key);
      if (bucket) {
        bucket.revenue += Number(order.amount || 0);
        bucket.orders += 1;
      }
    });

    quotations.forEach((quote) => {
      const qDate = new Date(quote.createdAt);
      const key = `${qDate.getFullYear()}-${String(qDate.getMonth() + 1).padStart(2, '0')}`;
      const bucket = monthlyBuckets.find((b) => b.key === key);
      if (bucket) {
        bucket.quotes += 1;
      }
    });

    leads.forEach((lead) => {
      const lDate = new Date(lead.createdAt);
      const key = `${lDate.getFullYear()}-${String(lDate.getMonth() + 1).padStart(2, '0')}`;
      const bucket = monthlyBuckets.find((b) => b.key === key);
      if (bucket) {
        bucket.leads += 1;
      }
    });

    // Provide demo baseline projection if system was just initialized
    const isNewWorkspace = totalRevenue === 0 && totalLeadsCount === 0 && totalOrdersCount === 0;

    // ================= LEADS BY STATUS =================
    const statusCounts = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      PROPOSAL: 0,
      WON: 0,
      LOST: 0,
    };

    leads.forEach((lead) => {
      const st = String(lead.status || 'NEW').toUpperCase();
      if (statusCounts[st] !== undefined) {
        statusCounts[st] += 1;
      } else {
        statusCounts['NEW'] += 1;
      }
    });

    const leadsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalLeadsCount > 0 ? Math.round((count / totalLeadsCount) * 100) : 0,
    }));

    // ================= LEADS BY SOURCE =================
    const sourceMap = {};
    leads.forEach((l) => {
      const src = l.source || 'Website Inquiry';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });

    const leadsBySource = Object.entries(sourceMap)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalLeadsCount > 0 ? Math.round((count / totalLeadsCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // ================= ORDERS BY STATUS =================
    const orderStatusMap = {
      CONFIRMED: 0,
      PENDING_APPROVAL: 0,
      IN_PRODUCTION: 0,
      DISPATCHED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    salesOrders.forEach((o) => {
      const st = o.status || 'PENDING_APPROVAL';
      if (orderStatusMap[st] !== undefined) {
        orderStatusMap[st] += 1;
      }
    });

    const ordersByStatus = Object.entries(orderStatusMap).map(([status, count]) => ({
      status,
      count,
    }));

    // ================= TOP PRODUCTS =================
    const topProducts = products.map((p, idx) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: Number(p.sellingPrice || 0),
      stock: p.stock || 0,
      status: p.status,
    }));

    // ================= RECENT TRANSACTIONS =================
    const recentOrders = salesOrders.slice(0, 8).map((o) => ({
      id: o.id,
      orderNo: o.orderNo,
      customer: o.customer,
      amount: Number(o.amount || 0),
      status: o.status,
      date: o.date || o.createdAt,
    }));

    return {
      success: true,
      data: {
        isNewWorkspace,
        kpis: {
          totalRevenue,
          totalOrders: totalOrdersCount,
          avgOrderValue,
          totalQuotations: totalQuotesCount,
          quotesPipelineValue,
          quoteConversionRate: Number(quoteConversionRate.toFixed(1)),
          totalLeads: totalLeadsCount,
          wonLeads: wonLeadsCount,
          leadConversionRate: Number(leadConversionRate.toFixed(1)),
          totalPipelineValue,
          totalCustomers: customers.length,
          totalProducts: products.length,
        },
        monthlyTrends: monthlyBuckets,
        leadsByStatus,
        leadsBySource: leadsBySource.length ? leadsBySource : [
          { source: 'Website Inquiry', count: 0, percentage: 0 },
          { source: 'Referral', count: 0, percentage: 0 },
          { source: 'Direct Sales', count: 0, percentage: 0 },
        ],
        ordersByStatus,
        topProducts,
        recentOrders,
      },
    };
  },
};

export default reportsService;
