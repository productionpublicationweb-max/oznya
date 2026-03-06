// lib/conversationMemory.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationMemory {
  userId: string;
  messages: Message[];
  lastUpdated: Date;
  metadata?: {
    totalMessages: number;
    firstMessageDate: Date;
    preferences?: Record<string, any>;
  };
}

export class ConversationMemoryManager {
  private static instance: ConversationMemoryManager;
  private memoryCache: Map<string, ConversationMemory> = new Map();
  private readonly MAX_MESSAGES = 50; // Limite de messages stockés

  private constructor() {}

  static getInstance(): ConversationMemoryManager {
    if (!ConversationMemoryManager.instance) {
      ConversationMemoryManager.instance = new ConversationMemoryManager();
    }
    return ConversationMemoryManager.instance;
  }

  async loadMemory(userId: string): Promise<ConversationMemory | null> {
    // Vérifier le cache d'abord
    if (this.memoryCache.has(userId)) {
      return this.memoryCache.get(userId)!;
    }

    // Charger depuis Supabase
    const { data, error } = await supabase
      .from('conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    const memory: ConversationMemory = {
      userId: data.user_id,
      messages: data.messages || [],
      lastUpdated: new Date(data.last_updated),
      metadata: data.metadata
    };

    // Mettre en cache
    this.memoryCache.set(userId, memory);
    return memory;
  }

  async saveMemory(memory: ConversationMemory): Promise<void> {
    // Limiter le nombre de messages
    if (memory.messages.length > this.MAX_MESSAGES) {
      memory.messages = memory.messages.slice(-this.MAX_MESSAGES);
    }

    // Mettre à jour le cache
    this.memoryCache.set(memory.userId, memory);

    // Sauvegarder dans Supabase
    await supabase
      .from('conversation_memory')
      .upsert({
        user_id: memory.userId,
        messages: memory.messages,
        last_updated: memory.lastUpdated.toISOString(),
        metadata: memory.metadata
      });
  }

  async addMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    let memory = await this.loadMemory(userId);

    if (!memory) {
      // Créer une nouvelle mémoire
      memory = {
        userId,
        messages: [],
        lastUpdated: new Date(),
        metadata: {
          totalMessages: 0,
          firstMessageDate: new Date()
        }
      };
    }

    // Ajouter le message
    memory.messages.push({
      role,
      content,
      timestamp: new Date()
    });

    // Mettre à jour les métadonnées
    if (memory.metadata) {
      memory.metadata.totalMessages = memory.messages.length;
    }

    memory.lastUpdated = new Date();

    // Sauvegarder
    await this.saveMemory(memory);
  }

  async getRecentMessages(userId: string, count: number = 10): Promise<Message[]> {
    const memory = await this.loadMemory(userId);
    if (!memory) return [];

    return memory.messages.slice(-count);
  }

  async clearMemory(userId: string): Promise<void> {
    // Supprimer du cache
    this.memoryCache.delete(userId);

    // Supprimer de Supabase
    await supabase
      .from('conversation_memory')
      .delete()
      .eq('user_id', userId);
  }

  // Obtenir un contexte formaté pour l'IA
  async getContextForAI(userId: string, maxMessages: number = 5): Promise<string> {
    const messages = await this.getRecentMessages(userId, maxMessages);
    
    if (messages.length === 0) {
      return "Nouvelle conversation";
    }

    return messages
      .map(m => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
  }
}

// Export singleton
export const conversationMemory = ConversationMemoryManager.getInstance();
