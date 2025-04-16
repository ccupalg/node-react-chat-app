import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import Typing from "./Typing";
import useShortcutFocus from "../hooks/useShortcutFocus";
import { useTabStore } from "../store/useTabStore";

const Sidebar = () => {
	const {
		getUsers,
		getChannels,
		users,
		channels,
		selectedUser,
		selectedChannel,
		setSelectedUser,
		setSelectedChannel,
		isUsersLoading,
		// createChannel,
	} = useChatStore();
	const {
		chat: { selectedTab },
		setSelectedChatTab,
	} = useTabStore();

	const { onlineUsers, typingUsers } = useAuthStore();
	const [showOnlineOnly, setShowOnlineOnly] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const _searchContactsRef = useRef(null);

	useShortcutFocus(_searchContactsRef);

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	useEffect(() => {
		getChannels();
		// createChannel({
		// 	name: "General",
		// 	members: ["67fd071309e640ecf6b5db45"],
		// })
	}, [getChannels]);

	// Keep the input focused when `searchTerm` changes
	useEffect(() => {
		if (_searchContactsRef.current) {
			_searchContactsRef.current.focus();
		}
	}, [searchTerm]);

	useEffect(() => {
		setSearchTerm("");
	}, [selectedTab]);

	const filteredUsers = users
		.filter((user) => !showOnlineOnly || onlineUsers.includes(user._id))
		.filter(
			(user) =>
				!searchTerm ||
				user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
		);

	const filteredChannels = channels.filter(
		(channel) =>
			!searchTerm ||
			channel.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isUsersLoading) return <SidebarSkeleton />;

	const SearchFromList = () => {
		return (
			<label className="input mt-3 mr-3 ml-2 input-bordered input-sm flex items-center gap-2 p-3 border-b border-base-300">
				<svg
					className="h-5 w-5 opacity-50"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<g
						strokeLinejoin="round"
						strokeLinecap="round"
						strokeWidth="2.5"
						fill="none"
						stroke="currentColor"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</g>
				</svg>
				<input
					ref={_searchContactsRef}
					type="search"
					className="grow"
					placeholder="Search"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<kbd className="kbd kbd-sm">⌘</kbd>
				<kbd className="kbd kbd-sm">K</kbd>
			</label>
		);
	};

	return (
		<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
			<div className="border-b border-gray-200 dark:border-gray-700">
				<ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
					<li className="me-2" onClick={() => setSelectedChatTab("CHANNELS")}>
						<a
							href="#"
							className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
								selectedTab === "CHANNELS"
									? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
									: "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
							}`}
						>
							<svg
								className={`w-4 h-4 me-2 ${
									selectedTab === "CHANNELS"
										? "text-blue-600 dark:text-blue-500"
										: "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
								}`}
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 18 18"
							>
								<path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
							</svg>
							Channels
						</a>
					</li>

					<li className="me-2" onClick={() => setSelectedChatTab("CONTACTS")}>
						<a
							href="#"
							className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
								selectedTab === "CONTACTS"
									? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
									: "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
							}`}
						>
							<svg
								className={`w-4 h-4 me-2 ${
									selectedTab === "CONTACTS"
										? "text-blue-600 dark:text-blue-500"
										: "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
								}`}
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 18 20"
							>
								<path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
							</svg>
							Contacts
						</a>
					</li>
				</ul>
			</div>

			{selectedTab === "CONTACTS" && (
				<div className="flex-1 flex flex-col overflow-auto">
					{/* Online filter*/}
					<div className="border-b border-base-300 w-full p-5">
						<div className="mt-3 hidden lg:flex items-center gap-2">
							<label className="cursor-pointer flex items-center gap-2">
								<input
									type="checkbox"
									checked={showOnlineOnly}
									onChange={(e) => setShowOnlineOnly(e.target.checked)}
									className="checkbox checkbox-sm"
								/>
								<span className="text-sm">Show online only</span>
							</label>
							<span className="text-xs text-zinc-500">
								({onlineUsers.length - 1} online)
							</span>
						</div>
					</div>

					{/* Search box*/}
					<SearchFromList />

					{/* Users list*/}
					<div className="overflow-y-auto w-full py-3">
						{filteredUsers.map((user) => (
							<button
								key={user._id}
								onClick={() => setSelectedUser(user)}
								className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
								selectedUser?._id === user._id
									? "bg-base-300 ring-1 ring-base-300"
									: ""
							}
            `}
							>
								<div className="relative mx-auto lg:mx-0">
									<img
										src={user.profilePic || "/avatar.png"}
										alt={user.fullName}
										className="size-12 object-cover rounded-full"
									/>
									{onlineUsers.includes(user._id) && (
										<span
											className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
										/>
									)}
								</div>

								{/* User info - only visible on larger screens */}
								<div className="hidden lg:block text-left min-w-0">
									<div className="font-medium truncate">{user.fullName}</div>
									<div className="text-sm text-zinc-400">
										{onlineUsers.includes(user._id) ? "Online" : "Offline"}
									</div>
									{/* Typing indicator - only visible on larger screens */}
									{typingUsers.includes(user._id) && <Typing />}
								</div>
							</button>
						))}

						{filteredUsers.length === 0 && (
							<div className="text-center text-zinc-500 py-4">
								No online users
							</div>
						)}
					</div>
				</div>
			)}

			{selectedTab === "CHANNELS" && (
				<div className="flex-1 flex flex-col overflow-auto">
					{/* Search box*/}
					<SearchFromList />

					{/* Users list*/}
					<div className="overflow-y-auto w-full py-3">
						{filteredChannels.map((channel) => (
							<button
								key={channel._id}
								onClick={() => setSelectedChannel(channel)}
								className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
								selectedChannel?._id === channel._id
									? "bg-base-300 ring-1 ring-base-300"
									: ""
							}
            `}
							>
								<div className="relative mx-auto lg:mx-0">
									<img
										src={channel.profilePic || "/avatar.png"}
										alt={channel.name}
										className="size-12 object-cover rounded-full"
									/>
									{onlineUsers.includes(channel._id) && (
										<span
											className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
										/>
									)}
								</div>

								{/* User info - only visible on larger screens */}
								<div className="hidden lg:block text-left min-w-0">
									<div className="font-medium truncate">{channel.name}</div>
									<div className="text-sm text-zinc-400">
										{channel?.members?.filter((memberId) =>
											onlineUsers?.includes(memberId)
										).length
											? channel?.members?.filter((memberId) =>
													onlineUsers?.includes(memberId)
											  ).length + " Online"
											: "All offline"}
									</div>
									{/* Typing indicator - only visible on larger screens */}
									{typingUsers.includes(channel._id) && <Typing />}
								</div>
							</button>
						))}

						{filteredUsers.length === 0 && (
							<div className="text-center text-zinc-500 py-4">
								No channel available
							</div>
						)}
					</div>
				</div>
			)}
		</aside>
	);
};
export default Sidebar;
