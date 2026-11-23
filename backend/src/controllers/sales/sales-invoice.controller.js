import salesInvoiceService from '../../services/sales/sales-invoice.service.js';

function respondError(error, res, next) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  return next(error);
}

export const salesInvoiceController = {
  async list(req, res, next) {
    try {
      const invoices = await salesInvoiceService.listInvoices(
        String(req.params.companyId),
        req.query || {}
      );
      res.json({ success: true, data: invoices });
    } catch (error) {
      respondError(error, res, next);
    }
  },

  async getById(req, res, next) {
    try {
      const invoice = await salesInvoiceService.getInvoiceById(
        String(req.params.companyId),
        req.params.invoiceId
      );
      res.json({ success: true, data: invoice });
    } catch (error) {
      respondError(error, res, next);
    }
  },

  async createFromOrder(req, res, next) {
    try {
      const invoice = await salesInvoiceService.createInvoiceFromOrder(
        String(req.params.companyId),
        req.params.orderId,
        req.body || {},
        req.user || {}
      );
      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      respondError(error, res, next);
    }
  },

  async updatePayment(req, res, next) {
    try {
      const invoice = await salesInvoiceService.updateInvoicePayment(
        String(req.params.companyId),
        req.params.invoiceId,
        req.body || {},
        req.user || {}
      );
      res.json({ success: true, data: invoice });
    } catch (error) {
      respondError(error, res, next);
    }
  },

  async remove(req, res, next) {
    try {
      await salesInvoiceService.removeInvoice(
        String(req.params.companyId),
        req.params.invoiceId
      );
      res.json({ success: true, message: 'Sales invoice removed.' });
    } catch (error) {
      respondError(error, res, next);
    }
  },
};

export default salesInvoiceController;

