import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import ChannelChatContainer from "../components/ChannelChatContainer";
import { useTabStore } from "../store/useTabStore";

const HomePage = () => {
	const { selectedUser, selectedChannel } = useChatStore();
	const {
		chat: { selectedTab },
	} = useTabStore();

	return (
		<div className="h-screen bg-base-200">
			<div className="flex items-center justify-center pt-20 px-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(100vh-8rem)]">
					<div className="flex h-full rounded-lg overflow-hidden">
						<Sidebar />

						{selectedTab === 'CONTACTS' ? (!selectedUser ? <NoChatSelected /> : <ChatContainer />): (!selectedChannel ? <NoChatSelected /> : <ChannelChatContainer />)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default HomePage;
