/**
 * Fixed 9-Service Catalogue Definition
 * Synchronized with AZZUNIQUE Backend Catalogue Specification & Prisma Models.
 */

export const CORE_SERVICES = [
  {
    id: 1,
    code: 'crm_sales',
    name: 'CRM & Sales',
    icon: 'IconCRM',
    description: 'Leads, Customers, Contacts, Quotations, Proforma Invoices, Sales Orders & Pricing',
    modules: [
      {
        code: 'crm',
        name: 'CRM Management',
        icon: 'IconUsers',
        subModules: [
          { code: 'crm_leads', name: 'Leads Pipeline', route: '/crm/leads', alias: 'leads' },
          { code: 'crm_customers', name: 'Customer Directory', route: '/crm/customers', alias: 'customers' },
          { code: 'crm_contacts', name: 'Contact Persons', route: '/crm/contacts', alias: 'contacts' },
          { code: 'crm_followups', name: 'Deal Opportunities', route: '/crm/opportunities', alias: 'opportunities' },
        ],
      },
      {
        code: 'product',
        name: 'Products & Catalogue',
        icon: 'IconBox',
        subModules: [
          { code: 'product_master', name: 'Product Directory', route: '/products', alias: 'product_list' },
          { code: 'categories', name: 'Categories & Types', route: '/products/categories' },
          { code: 'price_management', name: 'Price Management', route: '/products/pricing', alias: 'price_list' },
        ],
      },
      {
        code: 'sales',
        name: 'Sales Operations',
        icon: 'IconShoppingBag',
        subModules: [
          { code: 'sales_quotations', name: 'Quotations', route: '/sales/quotations', alias: 'quotations' },
          { code: 'sales_proforma_invoices', name: 'Proforma Invoices (PI)', route: '/sales/proforma', alias: 'proforma_invoice' },
          { code: 'sales_orders', name: 'Sales Orders', route: '/sales/orders' },
        ],
      },
    ],
  },
];
