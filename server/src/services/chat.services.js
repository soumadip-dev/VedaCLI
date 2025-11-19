import prisma from '../lib/db.js';

export class ChatService {
  //* Create a new conversation for a user
  async createConversation(userId, mode = 'chat', title = null) {
    return await prisma.conversation.create({
      data: {
        userId,
        mode,
        title: title || `New ${mode} conversation`,
      },
    });
  }

  //* Retrieve an existing conversation or create a new one if not found
  async getOrCreateConversation(userId, conversationId = null, mode = 'chat') {
    if (conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }, // Fetch messages in chronological order
          },
        },
      });

      if (conversation) return conversation;
    }

    // If no conversation found, create a new one
    return await this.createConversation(userId, mode);
  }

  //* Add a message to a conversation
  async addMessage(conversationId, role, content) {
    // Ensure content is stored as a string
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

    return await prisma.message.create({
      data: {
        conversationId,
        role,
        content: contentStr,
      },
    });
  }

  //* Retrieve all messages for a conversation
  async getMessages(conversationId) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    // Convert stored JSON strings back to objects when needed
    return messages.map(msg => ({
      ...msg,
      content: this.parseContent(msg.content),
    }));
  }

  //* Retrieve all conversations for a user with the latest message
  async getUserConversations(userId) {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }, // Recent conversations first
      include: {
        messages: {
          take: 1, // Only latest message
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  //* Delete a specific conversation owned by the user
  async deleteConversation(conversationId, userId) {
    return await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userId,
      },
    });
  }

  //* Update conversation title
  async updateTitle(conversationId, title) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    });
  }
  //* Helper: Safely parse a message's content
  parseContent(content) {
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }

  //* Format messages in a structure acceptable to AI models
  formatMessagesForAI(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    }));
  }
}
