"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";



const MyChats = () => {
  const { data: session } = useSession();
  const { chats, fetchUserChats } = useChatStore();
  const router = useRouter();

  if(!session)return <div>User not present</div>

  // Load all chats on mount
  useEffect(() => {
    fetchUserChats({userID:session?.user?.id});
  }, []);

  return (
    <div className="p-6 bg-slate-600">
      <h2 className="text-2xl font-bold mb-4">My Chats</h2>
      {chats.length === 0 ? (
        <p className="text-gray-500">You have no chats yet.</p>
      ) : (
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => router.push(`/dashboard/my-chats/${chat._id}`)}
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex justify-between items-center"
            >
              <div className="h-10 flex gap-2">
                <img className="max-h-full rounded-full" src={chat.character.profilePicture} alt="character image" />
                <p className="font-semibold">{chat.character.name}</p>
              </div>
              <span className="text-gray-600">→</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyChats;
