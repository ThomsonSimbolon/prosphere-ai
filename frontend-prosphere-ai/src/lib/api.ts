const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = {
  // 1. Analytics & Dashboard
  async getDashboardTelemetry() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching dashboard telemetry, using local fallback:', err);
      return null;
    }
  },

  // 2. CRM & Pipeline
  async getCrmPipeline() {
    try {
      const res = await fetch(`${API_BASE_URL}/crm/pipeline`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching CRM pipeline:', err);
      return null;
    }
  },

  async createLead(data: { name: string; company?: string; stage?: string; value?: number; source?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/crm/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating lead:', err);
      return { success: false };
    }
  },

  // 3. WhatsApp Devices & Messages
  async getDevices() {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/devices`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching devices:', err);
      return null;
    }
  },

  async startDeviceSession() {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/session/start`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      console.error('API error starting device session:', err);
      return { success: false };
    }
  },

  async disconnectDevice() {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/disconnect`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      console.error('API error disconnecting device:', err);
      return { success: false };
    }
  },

  async sendWhatsAppMessage(phone: string, message: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message }),
      });
      return await res.json();
    } catch (err) {
      console.error('API error sending message:', err);
      return { success: false, message: 'Gagal terhubung ke backend server' };
    }
  },

  // 4. Contacts & Groups
  async getContacts() {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching contacts:', err);
      return null;
    }
  },

  async createContact(data: { name: string; phoneNumber: string; tags?: string[]; groupId?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating contact:', err);
      return { success: false };
    }
  },

  async getGroups() {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts/groups`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching groups:', err);
      return null;
    }
  },

  async createGroup(data: { name: string; description?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating group:', err);
      return { success: false };
    }
  },

  // 5. Bookings
  async getBookings() {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching bookings:', err);
      return null;
    }
  },

  async createBooking(data: { customerName: string; customerPhone?: string; serviceName: string; bookingDate: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating booking:', err);
      return { success: false };
    }
  },

  // 6. Templates
  async getTemplates() {
    try {
      const res = await fetch(`${API_BASE_URL}/templates`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching templates:', err);
      return null;
    }
  },

  async createTemplate(data: { title: string; category?: string; content: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating template:', err);
      return { success: false };
    }
  },

  // 7. AI Settings & Simulator
  async getAiSettings() {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/settings`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching AI settings:', err);
      return null;
    }
  },

  async updateAiSettings(data: { modelName?: string; temperature?: number; systemPrompt?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error updating AI settings:', err);
      return { success: false };
    }
  },

  async simulateChat(message: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      return await res.json();
    } catch (err) {
      console.error('API error simulating chat:', err);
      return { success: false };
    }
  },

  // 8. Broadcast Campaigns
  async getCampaigns() {
    try {
      const res = await fetch(`${API_BASE_URL}/broadcast/campaigns`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching campaigns:', err);
      return null;
    }
  },

  async createCampaign(data: { title: string; targetGroup: string; messageText: string; delaySeconds?: number }) {
    try {
      const res = await fetch(`${API_BASE_URL}/broadcast/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating campaign:', err);
      return { success: false };
    }
  },

  // 9. Chatbot Flows
  async getFlows() {
    try {
      const res = await fetch(`${API_BASE_URL}/flows`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching flows:', err);
      return null;
    }
  },

  async createFlow(data: { name: string; trigger: string; stepsCount?: number }) {
    try {
      const res = await fetch(`${API_BASE_URL}/flows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating flow:', err);
      return { success: false };
    }
  },

  async toggleFlow(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/flows/${id}/toggle`, { method: 'PATCH' });
      return await res.json();
    } catch (err) {
      console.error('API error toggling flow:', err);
      return { success: false };
    }
  },

  // 10. Scheduled Jobs
  async getJobs() {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching jobs:', err);
      return null;
    }
  },

  async createJob(data: { title: string; cron: string; target: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating job:', err);
      return { success: false };
    }
  },

  async toggleJob(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${id}/toggle`, { method: 'PATCH' });
      return await res.json();
    } catch (err) {
      console.error('API error toggling job:', err);
      return { success: false };
    }
  },

  // 11. Chat History & Real-Time Messaging
  async getChats() {
    try {
      const res = await fetch(`${API_BASE_URL}/chats`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching chats:', err);
      return null;
    }
  },

  async getChatMessages(contactId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${contactId}/messages`, { cache: 'no-store' });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching messages:', err);
      return null;
    }
  },

  async sendChatMessage(contactId: string, content: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${contactId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      return await res.json();
    } catch (err) {
      console.error('API error sending chat message:', err);
      return { success: false };
    }
  },
};
