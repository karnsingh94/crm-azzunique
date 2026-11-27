#!/usr/bin/env node
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function resetSuperAdminPassword() {
  const args = process.argv.slice(2);
  const newPassword = args[0] || process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2026!';
  const email = (process.env.SUPER_ADMIN_EMAIL || 'admin@azzunique.com').trim().toLowerCase();
  const name = process.env.SUPER_ADMIN_NAME || 'Platform Super Admin';

  console.log('====================================================');
  console.log(' 🔐 AZZUNIQUE CRM — Super Admin Password Reset Tool ');
  console.log('====================================================');
  console.log(`Target Email   : ${email}`);
  console.log(`Setting Password: ${newPassword.replace(/./g, '*')}`);

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const superAdmin = await prisma.superAdmin.upsert({
      where: { email },
      update: {
        name,
        passwordHash,
        status: 'ACTIVE',
      },
      create: {
        name,
        email,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    const isMatch = await bcrypt.compare(newPassword, superAdmin.passwordHash);

    if (!isMatch) {
      throw new Error('Hash verification check failed.');
    }

    console.log('----------------------------------------------------');
    console.log('✅ Super Admin password updated and verified successfully!');
    console.log(`   ID    : ${superAdmin.id}`);
    console.log(`   Email : ${superAdmin.email}`);
    console.log(`   Name  : ${superAdmin.name}`);
    console.log(`   Status: ${superAdmin.status}`);
    console.log('----------------------------------------------------');
    console.log('You can now log in at /login with these credentials.');
  } catch (err) {
    console.error('❌ Failed to update Super Admin password:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetSuperAdminPassword();

