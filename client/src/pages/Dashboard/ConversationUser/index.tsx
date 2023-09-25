import React, { useEffect, useState } from "react";

// hooks
import { useRedux } from "../../../hooks/index";

import io from "socket.io-client";

// actions
import {
  toggleUserDetailsTab,
  getChatUserConversations,
  onSendMessage,
  receiveMessage,
  readMessage,
  receiveMessageFromUser,
  deleteMessage,
  deleteUserMessages,
  toggleArchiveContact,
  addChatUserConversations,
} from "../../../redux/actions";

// hooks
import { useProfile } from "../../../hooks";

// components
import Conversation from "./Conversation";
import ChatInputSection from "./ChatInputSection/index";

// interface
import { MessagesTypes } from "../../../data/messages";

// dummy data
import { pinnedTabs } from "../../../data/index";
import UserHead from "./UserHead";

const socket = io("http://localhost:5000/");

interface IndexProps {
  isChannel: boolean;
}
const Index = ({ isChannel }: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedChatCompare, setSelectedChatCompare] = useState();

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    chatUserDetails,
    chatUserConversations,
    messages,
    isUserMessageSent,
    isMessageDeleted,
    isMessageForwarded,
    isUserMessagesDeleted,
    isImageDeleted,
  } = useAppSelector((state) => ({
    chatUserDetails: state.Chats.chatUserDetails,
    chatUserConversations: state.Chats.chatUserConversations,
    messages: state.Chats.messages,
    isUserMessageSent: state.Chats.isUserMessageSent,
    isMessageDeleted: state.Chats.isMessageDeleted,
    isMessageForwarded: state.Chats.isMessageForwarded,
    isUserMessagesDeleted: state.Chats.isUserMessagesDeleted,
    isImageDeleted: state.Chats.isImageDeleted,
  }));

  const onOpenUserDetails = () => {
    dispatch(toggleUserDetailsTab(true));
  };

  /*
  hooks
  */
  const { userProfile } = useProfile();

  /*
  reply handeling
  */
  const [replyData, setReplyData] = useState<
    null | MessagesTypes | undefined
  >();
  const onSetReplyData = (reply: null | MessagesTypes | undefined) => {
    setReplyData(reply);
  };


  /*
  send message
  */
  const onSend = (data: any) => {
    // let params: any = {
    //   text: data.text && data.text,
    //   time: new Date().toISOString(),
    //   image: data.image && data.image,
    //   attachments: data.attachments && data.attachments,
    //   meta: {
    //     receiver: chatUserDetails.id,
    //     sender: userProfile.uid,
    //   },
    // };
    let params: any = {
      channel: "Olfa-Mahran",
      receiver: chatUserDetails.id,
      text: data.text && data.text,
    };

    let messageobject: any = {
      user: userProfile.user.id,
      text: data.text && data.text,
      meta: {
        receiver: chatUserDetails.id,
        sender: userProfile.user.id,
        sent: true,
        received: false,
        read: false,
      },
    };
    if (replyData && replyData !== null) {
      params["replyOf"] = replyData;
    }
    dispatch(onSendMessage(params));
    dispatch(addChatUserConversations(messageobject));
    socket.emit(
      "new message",
      messageobject,
      userProfile.user.id,
      chatUserConversations.messages.length
    );

    if (!isChannel) {
      setTimeout(() => {
        dispatch(receiveMessage(chatUserDetails.id));
      }, 1000);
      setTimeout(() => {
        dispatch(readMessage(chatUserDetails.id));
      }, 1500);
      setTimeout(() => {
        dispatch(receiveMessageFromUser(chatUserDetails.id));
      }, 2000);
    }
    setReplyData(null);
  };

  useEffect(() => {
    socket.emit("setup", userProfile);
    socket.on("connected", () => setSocketConnected(true));
    socket.emit("join chat", chatUserDetails);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (
      isUserMessageSent ||
      isMessageDeleted ||
      isMessageForwarded ||
      isUserMessagesDeleted ||
      isImageDeleted
    ) {
      dispatch(getChatUserConversations(chatUserDetails.id));
    }
  }, [
    dispatch,
    isUserMessageSent,
    chatUserDetails,
    isMessageDeleted,
    isMessageForwarded,
    isUserMessagesDeleted,
    isImageDeleted,
    chatUserConversations,
    userProfile,
  ]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved, userId, leng) => {
      dispatch(addChatUserConversations(newMessageRecieved));
    });
  }, []);

  const onDeleteMessage = (messageId: string | number) => {
    dispatch(deleteMessage(chatUserDetails.id, messageId));
  };

  const onDeleteUserMessages = () => {
    dispatch(deleteUserMessages(chatUserDetails.id));
  };

  const onToggleArchive = () => {
    dispatch(toggleArchiveContact(chatUserDetails.id));
  };

  const sendMessageSocket = (data: any, userId: any) => {
    socket.emit("new message", data, userId);
  };

  return (
    <>
      <UserHead
        chatUserDetails={chatUserDetails}
        pinnedTabs={pinnedTabs}
        onOpenUserDetails={onOpenUserDetails}
        onDelete={onDeleteUserMessages}
        isChannel={isChannel}
        onToggleArchive={onToggleArchive}
      />
      <Conversation
        chatUserConversations={chatUserConversations}
        chatUserDetails={chatUserDetails}
        onDelete={onDeleteMessage}
        onSetReplyData={onSetReplyData}
        isChannel={isChannel}
        messagesList={messages}
        isTyping={isTyping}
      />
      <ChatInputSection
        onSend={onSend}
        replyData={replyData}
        onSetReplyData={onSetReplyData}
        chatUserDetails={chatUserDetails}
        sendMessageSocket={sendMessageSocket}
      />
    </>
  );
};

export default Index;
