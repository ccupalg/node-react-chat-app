import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	channels: [],
	selectedUser: null,
	selectedChannel: null,
	isUsersLoading: false,
	isChannelsLoading: false,
	isMessagesLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/messages/users");
			set({ users: res.data });
		} catch (error) {
			toast.error(error.message);
		} finally {
			set({ isUsersLoading: false });
		}
	},
	createChannel: async (channelData) => {
		try {
			const res = await axiosInstance.post("/channels", channelData);
			set({ channels: [...get().channels, res.data] });
			toast.success("Channel created successfully");
		} catch (error) {
			toast.error(error.message);
		}
	},
	getChannels: async () => {
		set({ isChannelsLoading: true });
		try {
			const res = await axiosInstance.get("/channels");
			set({ channels: res.data });
		} catch (error) {
			toast.error(error.message);
		} finally {
			set({ isChannelsLoading: false });
		}
	},
	getUserMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: res.data });
		} catch (error) {
			toast.error(error.message);
		} finally {
			set({ isMessagesLoading: false });
		}
	},
	sendMessage: async (messageData) => {
		const { selectedUser, selectedChannel, messages } = get();
		try {
			if (selectedChannel) {
				const res = await axiosInstance.post(
					`/messages/send/${selectedChannel?._id}`,
					{ ...messageData, messageType: "CHANNEL" }
				);
				set({ messages: [...messages, res.data] });
			} else {
				const res = await axiosInstance.post(
					`/messages/send/${selectedUser?._id}`,
					messageData
				);
				set({ messages: [...messages, res.data] });
			}
		} catch (error) {
			toast.error(error.message);
		}
	},

	sendEvent: (event, data) => {
		const socket = useAuthStore.getState().socket;
		socket.emit(event, data);
	},

	subscribeToMessages: () => {
		const { selectedUser } = get();
		if (!selectedUser) return;

		const socket = useAuthStore.getState().socket;

		socket.on("newMessage", (newMessage) => {
			
			const isMessageSentFromSelectedUser =
				newMessage.senderId === selectedUser._id;
			if (!isMessageSentFromSelectedUser) return;

			set({
				messages: [...get().messages, newMessage],
			});
		});
	},

	subscribeToChannelMessages: () => {
		const { selectedChannel } = get();
		if (!selectedChannel) return;

		const socket = useAuthStore.getState().socket;

		const authUser = useAuthStore.getState().authUser;

		socket.on("newMessage", (newMessage) => {
			const isMessageSentFromSelectedUser =
				newMessage.senderId === authUser?._id;
			if (isMessageSentFromSelectedUser) return;

			set({
				messages: [...get().messages, newMessage],
			});
		});
	},

	unsubscribeFromMessages: () => {
		// it is for user one-to-one chat
		const socket = useAuthStore.getState().socket;
		socket.off("newMessage");
	},

	subscribeToChannel: (channelId) => {
		const { selectedChannel } = get();
		if (!selectedChannel || !channelId) return;

		const socket = useAuthStore.getState().socket;

		socket.emit("joinChannel", {
			channelId: channelId,
		});
	},

	unsubscribeFromChannel: (channelId) => {
		const { selectedChannel } = get();
		if (!selectedChannel || !channelId) return;

		const socket = useAuthStore.getState().socket;

		socket.emit("leaveChannel", {
			channelId: channelId,
		});
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),

	setSelectedChannel: (selectedChannel) => {
    const { selectedChannel: prevSelectedChannel } = get();

    set({ selectedChannel })

    const { subscribeToChannel, unsubscribeFromChannel } = get();

    // join the room for new channel
    if (selectedChannel?._id) {
      subscribeToChannel(selectedChannel?._id);
    } 
    
    // leave the room for previous channel
    if (prevSelectedChannel?._id) {
      unsubscribeFromChannel(prevSelectedChannel?._id);
    }
  },
}));
