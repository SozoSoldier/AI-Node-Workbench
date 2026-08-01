import { create } from "zustand";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatStore {
  threads: ChatThread[];
  activeThreadId: string | null;
  isAuthenticated: boolean;
  username: string | null;

  createNewThread: () => string; // Returns the new thread's ID
  setActiveThread: (id: string) => void;
  addMessageToActiveThread: (message: Message) => void;
  clearAllThreads: () => void;
  login: (username: string) => void;
  logout: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  threads: [],
  activeThreadId: null,
  isAuthenticated: false,
  username: null,

  createNewThread: () => {
    const newId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: `Chat Session #${get().threads.length + 1}`,
      messages: [],
    };

    set((state) => ({
      threads: [newThread, ...state.threads], // Add to the top of the list
      activeThreadId: newId, // Instantly switch focus to it
    }));

    return newId;
  },

  setActiveThread: (id) => set({ activeThreadId: id }),

  addMessageToActiveThread: (newMessage) => {
    const { threads, activeThreadId } = get();
    if (!activeThreadId) return;

    // Map through threads and append the message ONLY to the currently active thread
    const updatedThreads = threads.map((thread) => {
      if (thread.id === activeThreadId) {
        // Optional: Update thread title dynamically using the first words of the first message
        const newTitle =
          thread.messages.length === 0 && newMessage.sender === "user"
            ? newMessage.text.substring(0, 24) + "..."
            : thread.title;

        return {
          ...thread,
          title: newTitle,
          messages: [...thread.messages, newMessage],
        };
      }
      return thread;
    });

    set({ threads: updatedThreads });
  },

  clearAllThreads: () => set({ threads: [], activeThreadId: null }),

  login: (user) => {
    set({ isAuthenticated: true, username: user });
    // Proactively generate a default first chat container right upon authenticating
    get().createNewThread();
  },

  logout: () =>
    set({
      isAuthenticated: false,
      username: null,
      threads: [],
      activeThreadId: null,
    }),
}));
