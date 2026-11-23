import prisma from '../../config/prisma.js';
import { auditService } from '../audit.service.js';

function coreError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export const salesInvoiceService = {
  async listInvoices(companyId, options = {}) {
    const { search, status, limit, offset } = options;
    const where = { companyId };
    if (status && status !== 'ALL') where.status = status;
    if (search && search.trim()) {
      where.OR = [
        { invoiceNo: { contains: search.trim() } },
        { customerName: { contains: search.trim() } },
      ];
    }

    const queryOptions = {
      where,
      orderBy: { invoiceDate: 'desc' },
      include: {
        items: true,
        customer: true,
        salesOrder: {
          select: { id: true, orderNo: true, status: true, paymentStatus: true },
        },
      },
    };

    if (limit && Number(limit) > 0) {
      queryOptions.take = Math.min(Number(limit), 200);
      if (offset && Number(offset) >= 0) {
        queryOptions.skip = Number(offset);
      }
    }

    return prisma.salesInvoice.findMany(queryOptions);
  },

  async getInvoiceById(companyId, invoiceId) {
    const invoice = await prisma.salesInvoice.findFirst({
      where: { id: invoiceId, companyId },
      include: {
        items: true,
        customer: true,
        salesOrder: true,
      },
    });
    if (!invoice) throw coreError('Sales invoice not found.', 404);
    return invoice;
  },

  async createInvoiceFromOrder(companyId, orderId, data = {}, currentUser = {}) {
    const order = await prisma.salesOrder.findFirst({
      where: { id: orderId, companyId },
    });
    if (!order) throw coreError('Sales order not found.', 404);

    // 1. Ensure Customer exists
    let customerId = order.customerId;
    let customerRecord = null;
    if (customerId) {
      customerRecord = await prisma.crmCustomer.findUnique({ where: { id: customerId } });
    }
    if (!customerRecord) {
      customerRecord = await prisma.crmCustomer.findFirst({
        where: { companyId, companyName: order.customer },
      });
      if (customerRecord) {
        customerId = customerRecord.id;
      } else {
        customerRecord = await prisma.crmCustomer.create({
          data: {
            companyId,
            companyName: order.customer,
            customerCode: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'ACTIVE',
          },
        });
        customerId = customerRecord.id;
      }
    }

    // 2. Parse Items & Totals
    const orderItems = Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : [{ item: 'Standard Sales Package', qty: 1, rate: parseFloat(order.amount) || 0, gst: '18', total: parseFloat(order.amount) || 0 }];

    let computedTaxable = 0;
    let computedCgst = 0;
    let computedSgst = 0;
    let computedIgst = 0;
    let computedTotal = 0;

    const lineItemsToCreate = orderItems.map((it, idx) => {
      const qty = parseFloat(it.qty) || 1;
      const rate = parseFloat(it.rate) || 0;
      const gstPct = parseFloat(it.gst) || 18;
      const taxable = Math.round(qty * rate * 100) / 100;
      const taxAmt = Math.round((taxable * gstPct / 100) * 100) / 100;
      const halfTax = Math.round((taxAmt / 2) * 100) / 100;
      const total = taxable + taxAmt;

      computedTaxable += taxable;
      computedCgst += halfTax;
      computedSgst += halfTax;
      computedTotal += total;

      return {
        companyId,
        sku: it.item ? String(it.item).slice(0, 80) : `SKU-${idx + 1}`,
        description: it.item || 'Product Item',
        quantity: qty,
        unitPrice: rate,
        taxableAmount: taxable,
        taxRate: gstPct,
        cgstAmount: halfTax,
        sgstAmount: halfTax,
        igstAmount: 0,
        totalAmount: total,
      };
    });

    const finalTotal = computedTotal > 0 ? computedTotal : (parseFloat(order.amount) || 0);

    // 3. Paid & Outstanding Amounts
    const requestedPaidStatus = data.paidStatus || (order.paymentStatus === 'PAID' ? 'PAID' : 'PENDING');
    let paidAmount = 0;
    if (requestedPaidStatus === 'PAID') {
      paidAmount = finalTotal;
    } else if (data.paidAmount !== undefined && data.paidAmount !== '') {
      paidAmount = parseFloat(data.paidAmount) || 0;
    } else if (order.advanceReceived && parseFloat(order.advanceReceived) > 0) {
      paidAmount = parseFloat(order.advanceReceived);
    }

    const outstandingAmount = Math.max(0, finalTotal - paidAmount);
    const calculatedStatus = paidAmount >= finalTotal && finalTotal > 0
      ? 'PAID'
      : paidAmount > 0
        ? 'PARTIAL'
        : 'UNPAID';

    const invoiceNo = data.invoiceNo?.trim() || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return prisma.$transaction(async (tx) => {
      const invoice = await tx.salesInvoice.create({
        data: {
          companyId,
          invoiceNo,
          invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
          dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 15 * 86400000),
          customerId,
          customerName: order.customer,
          customerGstin: customerRecord.gstin || null,
          billingAddress: customerRecord.billingAddress || null,
          shippingAddress: customerRecord.shippingAddress || customerRecord.billingAddress || null,
          salesOrderId: order.id,
          taxableAmount: computedTaxable,
          cgstAmount: computedCgst,
          sgstAmount: computedSgst,
          igstAmount: computedIgst,
          totalAmount: finalTotal,
          paidAmount,
          outstandingAmount,
          status: calculatedStatus,
          metadata: {
            paymentMode: data.paymentMode || 'Bank Transfer',
            paymentStatus: calculatedStatus,
            paymentDate: new Date().toISOString(),
            orderNo: order.orderNo,
            notes: data.notes || order.notes || '',
          },
          items: {
            create: lineItemsToCreate,
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });

      // Update SalesOrder paymentStatus
      await tx.salesOrder.update({
        where: { id: order.id },
        data: {
          paymentStatus: calculatedStatus === 'PAID' ? 'PAID' : calculatedStatus === 'PARTIAL' ? 'PARTIAL' : order.paymentStatus,
        },
      });

      await auditService.logAction({
        companyId,
        actor: currentUser,
        action: 'CREATE_SALES_INVOICE',
        entityType: 'SALES_INVOICE',
        entityId: invoice.id,
        afterState: { id: invoice.id, invoiceNo: invoice.invoiceNo, totalAmount: finalTotal, status: calculatedStatus },
        reason: `Generated sales bill/invoice ${invoice.invoiceNo} from Order ${order.orderNo}`,
      });

      return invoice;
    });
  },

  async updateInvoicePayment(companyId, invoiceId, data = {}, currentUser = {}) {
    const existing = await prisma.salesInvoice.findFirst({
      where: { id: invoiceId, companyId },
    });
    if (!existing) throw coreError('Sales invoice not found.', 404);

    const total = parseFloat(existing.totalAmount) || 0;
    let newPaidAmount = existing.paidAmount;
    let newStatus = existing.status;

    if (data.paidStatus === 'PAID') {
      newPaidAmount = total;
      newStatus = 'PAID';
    } else if (data.paidStatus === 'UNPAID') {
      newPaidAmount = 0;
      newStatus = 'UNPAID';
    } else if (data.paidAmount !== undefined) {
      newPaidAmount = parseFloat(data.paidAmount) || 0;
      newStatus = newPaidAmount >= total && total > 0 ? 'PAID' : newPaidAmount > 0 ? 'PARTIAL' : 'UNPAID';
    } else if (data.paidStatus) {
      newStatus = data.paidStatus;
    }

    const newOutstanding = Math.max(0, total - parseFloat(newPaidAmount));

    const existingMeta = (typeof existing.metadata === 'object' && existing.metadata !== null) ? existing.metadata : {};
    const updatedMeta = {
      ...existingMeta,
      paymentMode: data.paymentMode || existingMeta.paymentMode || 'Bank Transfer',
      paymentStatus: newStatus,
      paidDate: data.paidDate || new Date().toISOString(),
      bankReference: data.bankReference || existingMeta.bankReference || null,
      notes: data.notes !== undefined ? data.notes : existingMeta.notes,
    };

    return prisma.$transaction(async (tx) => {
      const updated = await tx.salesInvoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          outstandingAmount: newOutstanding,
          status: newStatus,
          metadata: updatedMeta,
        },
        include: {
          items: true,
          customer: true,
        },
      });

      if (existing.salesOrderId) {
        await tx.salesOrder.update({
          where: { id: existing.salesOrderId },
          data: {
            paymentStatus: newStatus === 'PAID' ? 'PAID' : newStatus === 'PARTIAL' ? 'PARTIAL' : 'PENDING',
          },
        });
      }

      await auditService.logAction({
        companyId,
        actor: currentUser,
        action: 'UPDATE_INVOICE_PAYMENT',
        entityType: 'SALES_INVOICE',
        entityId: invoiceId,
        beforeState: { status: existing.status, paidAmount: existing.paidAmount },
        afterState: { status: newStatus, paidAmount: newPaidAmount, paymentMode: updatedMeta.paymentMode },
        reason: `Updated payment status to ${newStatus} (${updatedMeta.paymentMode})`,
      });

      return updated;
    });
  },

  async removeInvoice(companyId, invoiceId) {
    const existing = await prisma.salesInvoice.findFirst({
      where: { id: invoiceId, companyId },
    });
    if (!existing) throw coreError('Sales invoice not found.', 404);

    return prisma.$transaction(async (tx) => {
      await tx.salesInvoiceItem.deleteMany({ where: { invoiceId } });
      await tx.salesInvoice.delete({ where: { id: invoiceId } });
      return true;
    });
  },
};

export default salesInvoiceService;

