import { Router } from 'express';
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

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ProSphere AI Enterprise Backend',
  });
});

// Analytics & Telemetry
router.get('/analytics/dashboard', getDashboardData);

// WhatsApp Gateway
router.get('/whatsapp/devices', getDevices);
router.post('/whatsapp/session/start', startSession);
router.post('/whatsapp/disconnect', disconnectDevice);
router.post('/whatsapp/send', sendDirectMessage);

// AI Settings & Simulator
router.get('/ai/settings', getAiSettings);
router.put('/ai/settings', updateAiSettings);
router.post('/ai/simulate', simulateChat);

// CRM & Leads
router.get('/crm/pipeline', getPipeline);
router.post('/crm/leads', createLead);
router.patch('/crm/leads/:id/stage', updateLeadStage);

// Contacts & Groups
router.get('/contacts', getContacts);
router.post('/contacts', createContact);
router.get('/contacts/groups', getGroups);
router.post('/contacts/groups', createGroup);

// Bookings
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);

// Templates
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);

// Broadcast Campaigns
router.get('/broadcast/campaigns', getCampaigns);
router.post('/broadcast/campaigns', createCampaign);

// Chatbot Flows
router.get('/flows', getFlows);
router.post('/flows', createFlow);
router.patch('/flows/:id/toggle', toggleFlow);

// Scheduled Jobs
router.get('/jobs', getJobs);
router.post('/jobs', createJob);
router.patch('/jobs/:id/toggle', toggleJob);

// Chat History & Threads
router.get('/chats', getChatThreads);
router.get('/chats/:contactId/messages', getContactMessages);
router.post('/chats/:contactId/messages', sendChatMessage);

export default router;
