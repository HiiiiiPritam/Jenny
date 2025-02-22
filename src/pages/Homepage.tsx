import React from 'react'
import ChatBox from '../components/ChatBox'
import ChatInput from '../components/ChatInput'
import useChatAPI from '../hooks/useChatAPI';

function Homepage() {
  const { messages, sendMessage,chatContainerRef } = useChatAPI();
  return (
    <div>
      <div className="flex flex-col justify-end px-2 h-[90vh]">
        <ChatBox messages={messages} chatContainerRef={chatContainerRef} />
        <ChatInput onSend={sendMessage} />

        </div>
    </div>
  )
}

export default Homepage