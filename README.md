# CRM Azzunique

Standalone CRM & Sales project extracted from AZZUNIQUE CRM & ERP. The working app includes tenant login and permissions, CRM, product catalogue and pricing, quotations, proforma invoices, and sales orders. Existing routes and API flow are retained for those features.

## Included workflows

- User login, password recovery, tenant/company selection, roles and permissions
- CRM leads, customers, contacts, opportunities, lead conversion, and lead integrations
- Product directory, categories, product images, and price management
- Sales quotations and approval/revision, quotation-to-order conversion, proforma invoices, and sales orders
- Shared company/team management, audit history, attachments, and notifications needed by the CRM & Sales workflows
- Super Admin tenant and CRM & Sales service setup

ERP feature pages have been removed from the frontend route tree. The backend mounts CRM & Sales and shared workspace APIs only. The Prisma schema and original migration history are retained because CRM & Sales tables reference shared tenant, user, permission, and approval models; other ERP models are not exposed through the API.

## Run locally

Requirements: Node.js 20 or 22, npm 10+, and MySQL 8+.

1. Configure `backend/.env` from `backend/.env.example`. Set a local MySQL database, such as `crm_azzunique_db`, and choose a strong Super Admin password.
2. Install and initialize the backend:

   ```sh
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   npm run dev
   ```

   The API starts on `http://localhost:5000`.
3. Configure `frontend/.env.local` from `frontend/.env.example` (API URL defaults to `http://localhost:5000/api`), then run:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   The app starts on `http://localhost:3000`.

Use `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from the backend environment for the initial platform login. Configure tenant users from the Super Admin client setup.

## Project layout

- `frontend/`: Next.js CRM & Sales UI
- `backend/`: Express API, Prisma schema, migrations, and CRM & Sales seed catalog

Environment secrets, uploaded user files, and database backup dumps are not included in this extracted project.
# crm-azzunique
