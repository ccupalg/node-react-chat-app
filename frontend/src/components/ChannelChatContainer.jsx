import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChannelChatHeader from "./ChannelChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import Typing from "./Typing";

const ChannelChatContainer = () => {
  const {
    messages,
    getUserMessages,
    isMessagesLoading,
    selectedChannel,
    subscribeToChannelMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, typingUsers } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getUserMessages(selectedChannel._id);

    subscribeToChannelMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedChannel._id,
    getUserMessages,
    subscribeToChannelMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChannelChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChannelChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : message?.sender?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center h-12">
        {messages.length === 0 && (
          <p className="text-gray-500">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.length > 0 && (
          <p className="text-gray-500">
            You are chatting in the Channel: {selectedChannel.name}
          </p>
        )}

        {messages.length > 0 && (
          <p className="text-gray-500">
            {messages[messages.length - 1].isTyping
              ? `${selectedChannel.fullName} is typing...`
              : ""}
          </p>
        )}
      </div>

  		{/* Typing Indicator */}
      {typingUsers.includes(selectedChannel._id) && (
       <Typing userFullName={selectedChannel.fullName} />
      )}


      {/* Message Input */}
      <MessageInput />
    </div>
  );
};
export default ChannelChatContainer;
