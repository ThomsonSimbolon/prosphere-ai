'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

interface ChatItem {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatarBg: string;
}

interface MessageBubble {
  id: string;
  sender: 'user' | 'me';
  text: string;
  time: string;
  status?: string;
}

export default function ChatHistoryPage() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Load All Chat Threads from MySQL
  useEffect(() => {
    async function loadThreads() {
      setLoading(true);
      const data = await api.getChats();
      if (data && Array.isArray(data) && data.length > 0) {
        setChats(data);
        setSelectedChat(data[0]);
      } else {
        setChats([]);
        setSelectedChat(null);
      }
      setLoading(false);
    }
    loadThreads();
  }, []);

  // 2. Load Messages for Selected Contact
  useEffect(() => {
    async function loadMessages() {
      if (!selectedChat?.id) return;
      const data = await api.getChatMessages(selectedChat.id);
      setMessages(data || []);
    }
    loadMessages();
  }, [selectedChat]);

  // 3. Send Reply to Contact
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedChat?.id || isSending) return;
    const textToSend = replyText;
    setReplyText('');
    setIsSending(true);

    const tempMsg: MessageBubble = {
      id: Date.now().toString(),
      sender: 'me',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, tempMsg]);

    const res = await api.sendChatMessage(selectedChat.id, textToSend);
    if (res && res.success && res.data) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChat.id ? { ...c, lastMessage: textToSend, time: 'Baru saja' } : c
        )
      );
    }
    setIsSending(false);
  };

  const filteredChats = chats.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'STAFF_SALES_CS']}>
      <DashboardShell>
      {/* Header */}
      <div className="flex items-center justify-between gap-space-md mb-space-md">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Chat History
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
              {chats.length} Percakapan Aktif
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Inbox pesan pelanggan langsung tersinkronisasi dengan WhatsApp Baileys Gateway & MySQL database.
          </p>
        </div>
      </div>

      {chats.length === 0 && !loading ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-16 text-center flex flex-col items-center justify-center min-h-[480px]">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
            <Icon name="chat" size={32} />
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Belum Ada Percakapan Masuk
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            Database pesan WhatsApp saat ini masih bersih (0 percakapan). Riwayat chat akan muncul otomatis saat Anda mengirim pesan atau saat pelanggan menghubungi WhatsApp Anda.
          </p>
          <a
            href="/single-message"
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
          >
            <Icon name="send" size={18} />
            <span>Kirim Pesan Single Sekarang</span>
          </a>
        </div>
      ) : (
        /* Split Pane Chat Box */
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] shadow-sm">
          {/* Left: Chat List (4 cols) */}
          <div className="md:col-span-4 border-r border-outline-variant/30 flex flex-col bg-surface-container-low">
            {/* Search Bar */}
            <div className="p-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl border border-outline-variant/20">
                <Icon name="search" size={18} className="text-on-surface-variant" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kontak atau nomor..."
                  className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-full"
                />
              </div>
            </div>

            {/* Contact Items */}
            <div className="overflow-y-auto divide-y divide-outline-variant/10 flex-1 max-h-[580px]">
              {filteredChats.map((chat) => {
                const isSelected = selectedChat?.id === chat.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-surface-container-high' : 'hover:bg-surface-container'
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${chat.avatarBg}`}
                      >
                        {chat.name.charAt(0)}
                      </div>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-low" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-label-md text-label-md font-bold text-on-surface truncate">
                          {chat.name}
                        </h4>
                        <span className="text-[11px] text-outline shrink-0">{chat.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">{chat.lastMessage}</p>
                    </div>

                    {chat.unread > 0 && (
                      <span className="bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Message Detail (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-surface-container-lowest/50">
            {selectedChat ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedChat.avatarBg}`}
                    >
                      {selectedChat.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                        {selectedChat.name}
                      </h3>
                      <span className="text-xs text-primary flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {selectedChat.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedChat.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      title="Buka WhatsApp Web"
                    >
                      <Icon name="open_in_new" size={18} />
                    </a>
                  </div>
                </div>

                {/* Conversation Bubble Area */}
                <div className="p-space-lg flex-1 overflow-y-auto space-y-4 max-h-[460px]">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-on-surface-variant">
                      Belum ada pesan di percakapan ini. Ketik pesan di bawah untuk memulai chat.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === 'me';
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`p-3.5 rounded-2xl text-sm max-w-[80%] shadow-sm ${
                              isMe
                                ? 'bg-primary/15 border border-primary/30 rounded-br-sm text-on-surface'
                                : 'bg-surface-container border border-outline-variant/20 rounded-bl-sm text-on-surface'
                            }`}
                          >
                            {isMe && (
                              <div className="flex items-center gap-1.5 mb-1 text-primary text-xs font-semibold">
                                <Icon name="smart_toy" size={14} />
                                <span>ProSphere AI Operator</span>
                              </div>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            <span
                              className={`text-[10px] block text-right mt-1 ${
                                isMe ? 'text-primary/80' : 'text-outline'
                              }`}
                            >
                              {msg.time} {isMe ? '✓✓' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Send Input Bar */}
                <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    disabled={isSending}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply();
                    }}
                    placeholder={`Balas pesan ke ${selectedChat.name}...`}
                    className="flex-1 bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={isSending || !replyText.trim()}
                    className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_rgba(158,233,57,0.25)]"
                  >
                    <Icon name="send" size={18} />
                    <span>{isSending ? 'Mengirim...' : 'Kirim'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-sm text-on-surface-variant">
                Pilih kontak dari daftar di sebelah kiri untuk melihat percakapan.
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  </RoleGuard>
  );
}
