import { create } from "zustand";
// 1. Import the persist middleware tool from zustand
import { persist } from "zustand/middleware";

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

  createNewThread: () => string;
  setActiveThread: (id: string) => void;
  addMessageToActiveThread: (message: Message) => void;
  clearAllThreads: () => void;
  login: (username: string) => void;
  logout: () => void;
}

// 2. Wrap your entire store creation function inside the persist() middleware wrapper
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
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
          threads: [newThread, ...state.threads],
          activeThreadId: newId,
        }));

        return newId;
      },

      setActiveThread: (id) => set({ activeThreadId: id }),

      addMessageToActiveThread: (newMessage) => {
        const { threads, activeThreadId } = get();
        if (!activeThreadId) return;

        const updatedThreads = threads.map((thread) => {
          if (thread.id === activeThreadId) {
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
        if (get().threads.length === 0) {
          get().createNewThread();
        }
      },

      logout: () =>
        set({
          isAuthenticated: false,
          username: null,
          threads: [],
          activeThreadId: null,
        }),
    }),
    {
      // 3. Provide a unique key name. Zustand uses this to save data inside browser localStorage
      name: "ai-workbench-auth-storage",
    },
  ),
);
