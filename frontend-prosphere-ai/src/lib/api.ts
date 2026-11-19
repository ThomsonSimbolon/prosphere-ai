const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('prosphere_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const api = {
  // 0. Auth & Staff Management
  async getStaff() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching staff:', err);
      return [];
    }
  },

  async createStaff(data: { name: string; email: string; password: string; role: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating staff:', err);
      return { success: false, message: 'Gagal membuat staff' };
    }
  },

  async updateStaff(id: string, data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error updating staff:', err);
      return { success: false, message: 'Gagal memperbarui staff' };
    }
  },

  async deleteStaff(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('API error deleting staff:', err);
      return { success: false, message: 'Gagal menghapus staff' };
    }
  },

  async getActivityLogs(limit = 50) {
    try {
      const res = await fetch(`${API_BASE_URL}/activity-logs?limit=${limit}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching activity logs:', err);
      return [];
    }
  },

  // 1. Analytics & Dashboard
  async getDashboardTelemetry() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching dashboard telemetry:', err);
      return null;
    }
  },

  // 2. CRM & Pipeline
  async getCrmPipeline() {
    try {
      const res = await fetch(`${API_BASE_URL}/crm/pipeline`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
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
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating lead:', err);
      return { success: false };
    }
  },

  async updateLeadStage(leadId: string, stage: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/crm/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stage }),
      });
      return await res.json();
    } catch (err) {
      console.error('API error updating lead stage:', err);
      return { success: false };
    }
  },

  // 3. WhatsApp Devices & Messages
  async getDevices() {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/devices`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching devices:', err);
      return null;
    }
  },

  async startDeviceSession() {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/session/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('API error starting device session:', err);
      return { success: false };
    }
  },

  async disconnectDevice() {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/disconnect`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('API error disconnecting device:', err);
      return { success: false };
    }
  },

  async sendSingleMessage(to: string, message: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ to, message }),
      });
      return await res.json();
    } catch (err) {
      console.error('API error sending single message:', err);
      return { success: false };
    }
  },

  async sendWhatsAppMessage(to: string, message: string) {
    return this.sendSingleMessage(to, message);
  },

  // 4. Contacts & Groups
  async getContacts() {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching contacts:', err);
      return [];
    }
  },

  async createContact(data: { name: string; phoneNumber: string; tags?: string; groupId?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const res = await fetch(`${API_BASE_URL}/contacts/groups`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching groups:', err);
      return [];
    }
  },

  async createGroup(data: { name: string; description?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts/groups`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching bookings:', err);
      return [];
    }
  },

  async createBooking(data: { clientName: string; clientPhone: string; serviceName: string; scheduledAt: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const res = await fetch(`${API_BASE_URL}/templates`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching templates:', err);
      return [];
    }
  },

  async createTemplate(data: { title: string; category?: string; content: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating template:', err);
      return { success: false };
    }
  },

  // 7. Broadcast Campaigns
  async getCampaigns() {
    try {
      const res = await fetch(`${API_BASE_URL}/broadcast/campaigns`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching campaigns:', err);
      return [];
    }
  },

  async createCampaign(data: {
    title: string;
    targetGroup: string;
    messageText: string;
    delaySeconds?: number;
    contactIds?: string[];
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/broadcast/campaigns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error creating campaign:', err);
      return { success: false };
    }
  },

  // 8. AI Settings & Simulator
  async getAiSettings() {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/settings`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('API error fetching AI settings:', err);
      return null;
    }
  },

  async updateAiSettings(data: { modelName?: string; temperature?: number; systemPrompt?: string; humanFallback?: boolean }) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error('API error updating AI settings:', err);
      return { success: false };
    }
  },

  async simulateAiChat(message: string, history?: Array<{ role: string; content: string }>) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/simulate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message, history }),
      });
      return await res.json();
    } catch (err) {
      console.error('API error simulating AI chat:', err);
      return { success: false, reply: 'Maaf, terjadi kesalahan saat menghubungi AI.' };
    }
  },

  async simulateChat(message: string, history?: Array<{ role: string; content: string }>) {
    return this.simulateAiChat(message, history);
  },

  // 9. Chatbot Flows
  async getFlows() {
    try {
      const res = await fetch(`${API_BASE_URL}/flows`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching flows:', err);
      return [];
    }
  },

  async createFlow(data: { name: string; trigger: string; stepsCount?: number }) {
    try {
      const res = await fetch(`${API_BASE_URL}/flows`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const res = await fetch(`${API_BASE_URL}/flows/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('API error toggling flow:', err);
      return { success: false };
    }
  },

  // 10. Scheduled Jobs
  async getJobs() {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching jobs:', err);
      return [];
    }
  },

  async createJob(data: { title: string; cron: string; target: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const res = await fetch(`${API_BASE_URL}/jobs/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('API error toggling job:', err);
      return { success: false };
    }
  },

  // 11. Chat History & Real-time Threads
  async getChatThreads() {
    try {
      const res = await fetch(`${API_BASE_URL}/chats`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching chat threads:', err);
      return [];
    }
  },

  async getChats() {
    return this.getChatThreads();
  },

  async getContactMessages(contactId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${contactId}/messages`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.warn('API error fetching messages for contact:', err);
      return [];
    }
  },

  async getChatMessages(contactId: string) {
    return this.getContactMessages(contactId);
  },

  async sendChatMessage(contactId: string, content: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${contactId}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });
      return await res.json();
    } catch (err) {
      console.error('API error sending message:', err);
      return { success: false };
    }
  },
};
