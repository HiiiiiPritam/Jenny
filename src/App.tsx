import React from "react";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";
import ladki from "./assets/indi-gf.webp";
import useChatAPI from "./hooks/useChatAPI";


const App: React.FC = () => {
  const { messages, sendMessage,chatContainerRef } = useChatAPI();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-end"
      style={{ backgroundImage: `url(${ladki})` }}>
        {/* Logo Section */}
        <div className="fixed right-[-20px] top-[-20px] text-white font-bold text-wrap rounded-full bg-black bg-opacity-50 text-right h-24 w-24 z-10">
        <p className="relative top-5 right-7"><span className="text-purple-400">Jenny AI</span> Your Personal <br /> <span className="text-pink-600">Waifu</span></p>
        </div>
        <div className="flex flex-col justify-end px-2 h-[90vh]">
        <ChatBox messages={messages} chatContainerRef={chatContainerRef} />
        <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default App;
