'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';

function numberToWords(amount) {
  const num = Math.floor(Math.abs(Number(amount) || 0));
  if (num === 0) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return inWords(num) + ' Rupees Only';
}

export default function SalesBillModal({
  isOpen,
  onClose,
  invoice,
  activeCompany,
  onUpdatePayment,
  isUpdatingPayment,
}) {
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paidStatus: invoice?.status || 'PAID',
    paymentMode: invoice?.metadata?.paymentMode || 'Bank Transfer',
    paidAmount: invoice?.paidAmount !== undefined ? String(invoice.paidAmount) : '',
    bankReference: invoice?.metadata?.bankReference || '',
    notes: invoice?.metadata?.notes || '',
  });

  if (!isOpen || !invoice) return null;

  const totalAmount = parseFloat(invoice.totalAmount) || 0;
  const paidAmount = parseFloat(invoice.paidAmount) || 0;
  const outstandingAmount = Math.max(0, totalAmount - paidAmount);
  const status = invoice.status || 'UNPAID';
  const paymentMode = invoice.metadata?.paymentMode || 'Bank Transfer';

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (onUpdatePayment) {
      await onUpdatePayment(invoice.id, {
        paidStatus: paymentForm.paidStatus,
        paymentMode: paymentForm.paymentMode,
        paidAmount: paymentForm.paidStatus === 'PAID' ? totalAmount : (parseFloat(paymentForm.paidAmount) || 0),
        bankReference: paymentForm.bankReference,
        notes: paymentForm.notes,
      });
      setIsEditingPayment(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Tax Invoice: ${invoice.invoiceNo}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20px;
              background: #ffffff !important;
              color: #000000 !important;
              font-size: 11pt !important;
              box-shadow: none !important;
              border: none !important;
              z-index: 999999;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        {/* Action Header / Toolbar */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Status Badge */}
            <span style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: status === 'PAID' ? '#dcfce7' : status === 'PARTIAL' ? '#fef3c7' : '#fee2e2',
              color: status === 'PAID' ? '#15803d' : status === 'PARTIAL' ? '#b45309' : '#b91c1c',
              border: `1px solid ${status === 'PAID' ? '#86efac' : status === 'PARTIAL' ? '#fde68a' : '#fca5a5'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}>
              <span>{status === 'PAID' ? '✅' : status === 'PARTIAL' ? '⏳' : '⚠️'}</span>
              <span>{status === 'PAID' ? 'FULLY PAID' : status === 'PARTIAL' ? 'PARTIALLY PAID' : 'PAYMENT PENDING'}</span>
            </span>

            {/* Payment Mode Badge */}
            <span style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}>
              <span>💳 Mode:</span>
              <span>{paymentMode}</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setIsEditingPayment(!isEditingPayment)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ✏️ {isEditingPayment ? 'Cancel Edit' : 'Update Payment'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: '#7f22fe',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 6px rgba(127, 34, 254, 0.25)',
              }}
            >
              <span>🖨️</span> Print &amp; Download PDF
            </button>
          </div>
        </div>

        {/* Payment Edit Drawer */}
        {isEditingPayment && (
          <form onSubmit={handleSavePayment} className="no-print" style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.88rem' }}>
              💳 Update Bill Payment Status &amp; Mode
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                  Paid Status *
                </label>
                <select
                  value={paymentForm.paidStatus}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paidStatus: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
                >
                  <option value="PAID">✅ Fully Paid (100%)</option>
                  <option value="PARTIAL">⏳ Partially Paid</option>
                  <option value="UNPAID">⚠️ Unpaid / Pending</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                  Payment Mode *
                </label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
                >
                  <option value="Bank Transfer">🏦 Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="UPI">📱 UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Cash">💵 Cash</option>
                  <option value="Cheque">📑 Cheque / Demand Draft</option>
                  <option value="Credit Card">💳 Credit / Debit Card</option>
                  <option value="Net Banking">🌐 Online Net Banking</option>
                </select>
              </div>

              {paymentForm.paidStatus === 'PARTIAL' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalAmount}
                    step="0.01"
                    value={paymentForm.paidAmount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paidAmount: e.target.value })}
                    placeholder={`e.g. ${Math.round(totalAmount / 2)}`}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                  Bank Reference / UTR No
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR-9823482103"
                  value={paymentForm.bankReference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankReference: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="submit"
                disabled={isUpdatingPayment}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isUpdatingPayment ? 'Saving...' : 'Save Payment Changes'}
              </button>
            </div>
          </form>
        )}

        {/* PRINTABLE BILL DOCUMENT CONTAINER */}
        <div
          id="printable-invoice"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '2rem',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#1e293b',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', borderBottom: '2px solid #7f22fe', paddingBottom: '1.25rem', marginBottom: '1.5rem', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                {activeCompany?.organizationName || activeCompany?.name || 'AZZUNIQUE CRM & ERP'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem', maxWidth: '320px', lineHeight: '1.35' }}>
                {activeCompany?.address || 'Corporate Headquarters · Industrial Area · Tech Park'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600, marginTop: '0.35rem' }}>
                GSTIN: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{activeCompany?.gstin || '07AABCU9603R1ZM'}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-block', background: '#7f22fe', color: '#ffffff', padding: '0.3rem 0.85rem', borderRadius: '4px', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                TAX INVOICE / BILL
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                {invoice.invoiceNo}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                Date: <strong>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</strong>
              </div>
              {invoice.salesOrder?.orderNo && (
                <div style={{ fontSize: '0.8rem', color: '#7f22fe', fontWeight: 700, marginTop: '0.2rem' }}>
                  SO Ref: {invoice.salesOrder.orderNo}
                </div>
              )}
            </div>
          </div>

          {/* Customer / Billing Info */}
          <div className="resp-grid-2" style={{ gap: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                BILLED TO:
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {invoice.customerName}
              </div>
              {invoice.customer?.contactPerson && (
                <div style={{ color: '#475569', marginTop: '0.2rem' }}>
                  Attn: {invoice.customer.contactPerson}
                </div>
              )}
              {invoice.customer?.phone && (
                <div style={{ color: '#64748b', marginTop: '0.15rem' }}>
                  Phone: {invoice.customer.phone}
                </div>
              )}
              {invoice.customer?.email && (
                <div style={{ color: '#64748b', marginTop: '0.15rem' }}>
                  Email: {invoice.customer.email}
                </div>
              )}
              <div style={{ marginTop: '0.35rem', fontWeight: 700, color: '#0f172a' }}>
                GSTIN: {invoice.customerGstin || invoice.customer?.gstin || 'Unregistered / Consumer'}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                DISPATCH &amp; PAYMENT DETAILS:
              </div>
              <div><strong>Place of Supply:</strong> India (State: Delhi NCR)</div>
              <div><strong>Due Date:</strong> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : 'Immediate on Receipt'}</div>
              <div style={{ marginTop: '0.35rem' }}>
                <strong>Payment Mode:</strong> <span style={{ color: '#7f22fe', fontWeight: 700 }}>{paymentMode}</span>
              </div>
              <div style={{ marginTop: '0.15rem' }}>
                <strong>Payment Status:</strong> <span style={{ color: status === 'PAID' ? '#15803d' : status === 'PARTIAL' ? '#b45309' : '#b91c1c', fontWeight: 800 }}>{status}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="resp-table-scroll" style={{ marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', color: '#334155', fontWeight: 800 }}>
                <th style={{ padding: '0.65rem 0.75rem', width: '35px' }}>#</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Item Description</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Unit Rate</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>GST %</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Tax Amount</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                invoice.items.map((it, idx) => {
                  const qty = parseFloat(it.quantity) || 1;
                  const rate = parseFloat(it.unitPrice) || 0;
                  const taxAmt = (parseFloat(it.cgstAmount) || 0) + (parseFloat(it.sgstAmount) || 0) + (parseFloat(it.igstAmount) || 0);
                  const lineTotal = parseFloat(it.totalAmount) || (qty * rate);

                  return (
                    <tr key={it.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>
                        {it.description || it.sku}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{qty}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{it.taxRate ? `${it.taxRate}%` : '18%'}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>₹{taxAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#64748b' }}>1</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Commercial Order &amp; Product Fulfillment</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>1</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>₹{(totalAmount / 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>18%</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>₹{(totalAmount - totalAmount / 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>

          {/* Totals & Payment Summary */}
          <div className="resp-grid-split-bill" style={{ gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem' }}>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                  Amount in Words:
                </div>
                <div style={{ color: '#0f172a', fontWeight: 700, fontStyle: 'italic' }}>
                  {numberToWords(totalAmount)}
                </div>
              </div>

              {/* Payment Summary Box */}
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: status === 'PAID' ? '#f0fdf4' : '#fffbeb', borderRadius: '6px', border: `1px solid ${status === 'PAID' ? '#bbf7d0' : '#fde68a'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span><strong>Payment Status:</strong></span>
                  <span style={{ fontWeight: 800, color: status === 'PAID' ? '#15803d' : '#b45309' }}>{status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span><strong>Payment Method:</strong></span>
                  <span style={{ fontWeight: 700, color: '#1e40af' }}>{paymentMode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Paid Amount:</span>
                  <span style={{ fontWeight: 700, color: '#15803d' }}>₹{paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Balance Outstanding:</span>
                  <span style={{ fontWeight: 800, color: outstandingAmount > 0 ? '#b91c1c' : '#15803d' }}>₹{outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: '#64748b' }}>
                <span>Taxable Subtotal:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  ₹{(parseFloat(invoice.taxableAmount) || (totalAmount / 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: '#64748b' }}>
                <span>CGST (9%):</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  ₹{(parseFloat(invoice.cgstAmount) || ((totalAmount - totalAmount / 1.18) / 2)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: '#64748b' }}>
                <span>SGST (9%):</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  ₹{(parseFloat(invoice.sgstAmount) || ((totalAmount - totalAmount / 1.18) / 2)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '2px solid #0f172a', borderBottom: '2px solid #0f172a', marginTop: '0.35rem', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                <span>TOTAL INVOICE VALUE:</span>
                <span style={{ color: '#7f22fe' }}>
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Signatory */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Terms &amp; Conditions:</div>
              <div>1. Payment due within specified credit period.</div>
              <div>2. Standard warranty and return policies apply as per commercial agreement.</div>
              <div>3. This is a computer-generated tax invoice.</div>
            </div>

            <div style={{ textAlign: 'center', minWidth: '180px' }}>
              <div style={{ height: '40px', borderBottom: '1px dashed #94a3b8', marginBottom: '0.35rem' }}></div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Authorized Signatory</div>
              <div style={{ fontSize: '0.72rem' }}>{activeCompany?.organizationName || 'AZZUNIQUE'}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

