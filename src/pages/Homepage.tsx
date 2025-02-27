"use client"

import ChatBox from '../components/ChatBox'
import ChatInput from '../components/ChatInput'
import useChatAPI from '../hooks/useChatAPI';

function Homepage() {
  const { messages, sendMessage,chatContainerRef,isTyping } = useChatAPI();
  return (
    <div>
      <div className="flex flex-col justify-end px-2 h-[90vh]">
        <ChatBox messages={messages} isTyping={isTyping} chatContainerRef={chatContainerRef} />
        <ChatInput onSend={(userMessage, isImage) => sendMessage({ userMessage, isImage })} isTyping={isTyping} />

        </div>
    </div>
  )
}

export default Homepage