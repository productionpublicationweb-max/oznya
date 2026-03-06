// Library for localStorage management - Conversations, Favorites, Settings

export interface SavedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFavorite: boolean;
  serviceRecommendation?: {
    id: string;
    name: string;
    description: string;
    url: string;
  } | null;
}

export interface Conversation {
  id: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  preview: string;
  messages: SavedMessage[];
}

export interface DailyPrediction {
  date: string;
  energyNumber: number;
  message: string;
  advice: string;
  luckyColor: string;
  luckyNumber: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  reminderEnabled: boolean;
  lastVisitDate: string;
  conversationCount: number;
  promoCode?: string;
  promoExpiry?: string;
}

const STORAGE_KEYS = {
  CONVERSATIONS: 'nyxia_conversations',
  CURRENT_CONVERSATION: 'nyxia_current_conversation',
  FAVORITES: 'nyxia_favorites',
  SETTINGS: 'nyxia_settings',
  DAILY_PREDICTION: 'nyxia_daily_prediction'
};

// ========== CONVERSATIONS ==========

export function saveConversation(messages: SavedMessage[]): string {
  if (typeof window === 'undefined') return '';
  
  const conversations = getConversations();
  const now = new Date().toISOString();
  
  const conversationId = `conv-${Date.now()}`;
  const preview = messages[messages.length - 1]?.content.slice(0, 100) || '';
  
  const conversation: Conversation = {
    id: conversationId,
    startedAt: messages[0]?.timestamp || now,
    lastMessageAt: now,
    messageCount: messages.length,
    preview,
    messages
  };
  
  conversations.unshift(conversation);
  
  // Keep only last 50 conversations
  if (conversations.length > 50) {
    conversations.pop();
  }
  
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, conversationId);
  
  return conversationId;
}

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getConversation(id: string): Conversation | null {
  const conversations = getConversations();
  return conversations.find(c => c.id === id) || null;
}

export function deleteConversation(id: string): void {
  if (typeof window === 'undefined') return;
  
  const conversations = getConversations().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
}

export function updateCurrentConversation(messages: SavedMessage[]): void {
  if (typeof window === 'undefined') return;
  
  const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  if (!currentId) {
    saveConversation(messages);
    return;
  }
  
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === currentId);
  
  if (index >= 0) {
    conversations[index] = {
      ...conversations[index],
      lastMessageAt: new Date().toISOString(),
      messageCount: messages.length,
      preview: messages[messages.length - 1]?.content.slice(0, 100) || '',
      messages
    };
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } else {
    saveConversation(messages);
  }
}

// ========== FAVORITES ==========

export interface FavoriteMessage {
  id: string;
  content: string;
  timestamp: string;
  conversationId: string;
}

export function toggleFavorite(message: SavedMessage, conversationId?: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.id === message.id);
  
  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.unshift({
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      conversationId: conversationId || ''
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  return existingIndex < 0;
}

export function getFavorites(): FavoriteMessage[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isFavorite(messageId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === messageId);
}

// ========== SETTINGS ==========

const defaultSettings: UserSettings = {
  soundEnabled: true,
  reminderEnabled: true,
  lastVisitDate: '',
  conversationCount: 0
};

export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function updateSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return;
  
  const current = getSettings();
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
}

export function checkDailyVisit(): { isFirstVisitToday: boolean; daysSinceLastVisit: number } {
  const settings = getSettings();
  const today = new Date().toDateString();
  
  if (!settings.lastVisitDate) {
    updateSettings({ lastVisitDate: today, conversationCount: 1 });
    return { isFirstVisitToday: true, daysSinceLastVisit: 0 };
  }
  
  const lastVisit = new Date(settings.lastVisitDate);
  const todayDate = new Date(today);
  const diffTime = todayDate.getTime() - lastVisit.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (settings.lastVisitDate !== today) {
    updateSettings({ lastVisitDate: today });
    return { isFirstVisitToday: true, daysSinceLastVisit: diffDays };
  }
  
  return { isFirstVisitToday: false, daysSinceLastVisit: 0 };
}

// ========== PROMO CODES ==========

export function generatePromoCode(): { code: string; expiry: string; discount: number } {
  const prefixes = ['NYXIA', 'COSMOS', 'ETOILE', 'LUNE', 'MAGIC'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `${prefix}${suffix}`;
  
  // Expires in 48 hours
  const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  
  updateSettings({ promoCode: code, promoExpiry: expiry });
  
  return { code, expiry, discount: 15 };
}

export function getActivePromo(): { code: string; expiry: string; discount: number } | null {
  const settings = getSettings();
  
  if (!settings.promoCode || !settings.promoExpiry) {
    return null;
  }
  
  if (new Date(settings.promoExpiry) < new Date()) {
    return null;
  }
  
  return {
    code: settings.promoCode,
    expiry: settings.promoExpiry,
    discount: 15
  };
}

// ========== CLEAR ALL ==========

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
