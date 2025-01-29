import React from "react";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";
import useChatAPI from "./hooks/useChatAPI";


const App: React.FC = () => {
  const { messages, sendMessage,chatContainerRef } = useChatAPI();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-md">
        <ChatBox messages={messages} chatContainerRef={chatContainerRef} />
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
};

export default App;
