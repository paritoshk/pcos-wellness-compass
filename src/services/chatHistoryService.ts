import { ChatMessage } from '@/contexts/UserContext';

class ChatHistoryService {
  private readonly STORAGE_KEY = 'chatHistory';
  private readonly MAX_HISTORY_SIZE = 100;

  /**
   * Save a chat message to localStorage
   */
  saveMessage(message: ChatMessage): void {
    try {
      // Get existing history
      const history = this.getHistory();
      
      // Add new message
      const updatedHistory = [...history, this.prepareMessageForStorage(message)];
      
      // Limit history size
      const limitedHistory = updatedHistory.slice(-this.MAX_HISTORY_SIZE);
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
      
      console.log('Message saved to chat history:', message.id);
    } catch (error) {
      console.error('Error saving message to chat history:', error);
    }
  }

  /**
   * Get all chat history from localStorage
   */
  getHistory(): ChatMessage[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return [];
      
      const parsedHistory = JSON.parse(saved);
      
      // Convert string timestamps back to Date objects
      return parsedHistory.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));
    } catch (error) {
      console.error('Error retrieving chat history:', error);
      return [];
    }
  }

  /**
   * Clear all chat history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Chat history cleared');
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  /**
   * Prepare a message for storage by handling Date objects
   */
  private prepareMessageForStorage(message: ChatMessage): any {
    // Create a copy to avoid modifying the original
    const messageCopy = { ...message };
    
    // Ensure timestamp is stored as a string
    if (messageCopy.timestamp instanceof Date) {
      // Create a new object with the timestamp as string to avoid type errors
      return {
        ...messageCopy,
        timestamp: messageCopy.timestamp.toISOString()
      };
    }
    
    return messageCopy;
  }
}

// Export a singleton instance
export const chatHistoryService = new ChatHistoryService();
