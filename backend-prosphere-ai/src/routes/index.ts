import { Router } from 'express';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware.js';
import {
  handleLogin,
  handleGetCurrentUser,
  handleLogout,
} from '../modules/auth/auth.controller.js';
import {
  handleGetStaff,
  handleCreateStaff,
  handleUpdateStaff,
  handleDeleteStaff,
} from '../modules/users/users.controller.js';
import { handleGetActivityLogs } from '../modules/logs/logs.controller.js';
import { getDashboardData } from '../modules/analytics/analytics.controller.js';
import {
  getDevices,
  startSession,
  disconnectDevice,
  sendDirectMessage,
} from '../modules/whatsapp/whatsapp.controller.js';
import {
  getAiSettings,
  updateAiSettings,
  simulateChat,
} from '../modules/ai/ai.controller.js';
import {
  getPipeline,
  createLead,
  updateLeadStage,
} from '../modules/crm/crm.controller.js';
import {
  getContacts,
  createContact,
  getGroups,
  createGroup,
} from '../modules/contacts/contacts.controller.js';
import {
  getBookings,
  createBooking,
} from '../modules/bookings/bookings.controller.js';
import {
  getTemplates,
  createTemplate,
} from '../modules/templates/templates.controller.js';
import {
  getCampaigns,
  createCampaign,
} from '../modules/broadcast/broadcast.controller.js';
import {
  getFlows,
  createFlow,
  toggleFlow,
} from '../modules/flows/flows.controller.js';
import {
  getJobs,
  createJob,
  toggleJob,
} from '../modules/jobs/jobs.controller.js';
import {
  getChatThreads,
  getContactMessages,
  sendChatMessage,
} from '../modules/chats/chats.controller.js';

const router = Router();

// Role Constants
const SUPER_ADMIN = 'SUPER_ADMIN';
const SALES_CS = 'STAFF_SALES_CS';
const MARKETING = 'STAFF_MARKETING';

// ==========================================
// 1. PUBLIC ROUTES (Health & Auth)
// ==========================================
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ProSphere AI Enterprise RBAC Backend',
  });
});

router.post('/auth/login', handleLogin);

// ==========================================
// 2. AUTHENTICATED USER SESSIONS
// ==========================================
router.get('/auth/me', authenticateJwt, handleGetCurrentUser);
router.post('/auth/logout', authenticateJwt, handleLogout);

// ==========================================
// 3. SUPER ADMIN ONLY ROUTES
// ==========================================
// Dashboard Telemetry
router.get(
  '/analytics/dashboard',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  getDashboardData
);

// WhatsApp Gateway Devices & Pairing
router.get(
  '/whatsapp/devices',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  getDevices
);
router.post(
  '/whatsapp/session/start',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  startSession
);
router.post(
  '/whatsapp/disconnect',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  disconnectDevice
);
router.post(
  '/whatsapp/send',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  sendDirectMessage
);

// AI Settings & Simulator
router.get(
  '/ai/settings',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  getAiSettings
);
router.put(
  '/ai/settings',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  updateAiSettings
);
router.post(
  '/ai/simulate',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  simulateChat
);

// User Management (Staff Accounts)
router.get(
  '/users',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  handleGetStaff
);
router.post(
  '/users',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  handleCreateStaff
);
router.put(
  '/users/:id',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  handleUpdateStaff
);
router.delete(
  '/users/:id',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  handleDeleteStaff
);

// Activity Logs
router.get(
  '/activity-logs',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  handleGetActivityLogs
);

// Scheduled Jobs
router.get(
  '/jobs',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  getJobs
);
router.post(
  '/jobs',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  createJob
);
router.patch(
  '/jobs/:id/toggle',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  toggleJob
);

// Chatbot Flows
router.get(
  '/flows',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  getFlows
);
router.post(
  '/flows',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  createFlow
);
router.patch(
  '/flows/:id/toggle',
  authenticateJwt,
  requireRole([SUPER_ADMIN]),
  toggleFlow
);

// ==========================================
// 4. SALES & CUSTOMER SERVICE + SUPER ADMIN
// ==========================================
// CRM & Leads
router.get(
  '/crm/pipeline',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  getPipeline
);
router.post(
  '/crm/leads',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  createLead
);
router.patch(
  '/crm/leads/:id/stage',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  updateLeadStage
);

// Contacts
router.get(
  '/contacts',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  getContacts
);
router.post(
  '/contacts',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  createContact
);

// Bookings
router.get(
  '/bookings',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  getBookings
);
router.post(
  '/bookings',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  createBooking
);

// Chat History & Threads
router.get(
  '/chats',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  getChatThreads
);
router.get(
  '/chats/:contactId/messages',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  getContactMessages
);
router.post(
  '/chats/:contactId/messages',
  authenticateJwt,
  requireRole([SUPER_ADMIN, SALES_CS]),
  sendChatMessage
);

// ==========================================
// 5. MARKETING + SUPER ADMIN
// ==========================================
// Broadcast Campaigns
router.get(
  '/broadcast/campaigns',
  authenticateJwt,
  requireRole([SUPER_ADMIN, MARKETING]),
  getCampaigns
);
router.post(
  '/broadcast/campaigns',
  authenticateJwt,
  requireRole([SUPER_ADMIN, MARKETING]),
  createCampaign
);

// Templates
router.get(
  '/templates',
  authenticateJwt,
  requireRole([SUPER_ADMIN, MARKETING]),
  getTemplates
);
router.post(
  '/templates',
  authenticateJwt,
  requireRole([SUPER_ADMIN, MARKETING]),
  createTemplate
);

// Groups
router.get(
  '/contacts/groups',
  authenticateJwt,
  requireRole([SUPER_ADMIN, MARKETING]),
  getGroups
);
router.post(
  '/contacts/groups',
  authenticateJwt,
  requireRole([SUPER_ADMIN, MARKETING]),
  createGroup
);

export default router;
