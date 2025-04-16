import { create } from "zustand";

export const useTabStore = create((set, get) => ({
  chat: {
    selectedTab: "CHANNELS", // CONTACTS,
    allTabs: [
      { id: "CHANNELS", name: "Channels" },
      { id: "CONTACTS", name: "Contacts" },
    ],
  },

  setSelectedChatTab: async (selectedTab) => {
    const { chat } = get();
    set({ chat: { ...chat, selectedTab } });
  },
}));
