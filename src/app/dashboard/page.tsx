"use client";
import useCharacterStore from "@/store/useCharacterStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ExplorePage = () => {
  const { characters, fetchCharacters } = useCharacterStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const loadCharacters = async () => {
      await fetchCharacters();
      setLoading(false);
    };
    loadCharacters();
  }, []);

  if (!session) return <div>Login first</div>;
  if (loading) return <p>Loading characters...</p>;

  const createChat = async (characterId: string) => {
    const userId = session?.user?.id;
    try {
      const response = await fetch(`/api/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, characterId }),
      });

      const data = await response.json(); // ✅ Await response.json()

      if (response.ok) {
        alert("Chat created");
        // router.push(`/dashboard/my-chats/${data._id}`);
      } else {
        if (data.error === "Chat already exists") {
          alert("Chat already exists. Find in my Chats");
          // router.push(`/dashboard/my-chats/${data.chatId}`); // ✅ Redirect to existing chat
        } else {
          alert(data.error || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Explore AI Characters</h1>
      <div className="grid grid-cols-3 gap-4">
        {characters.map((char) => (
          <div 
            key={char._id} 
            onClick={() => createChat(char._id)} 
            className="bg-gray-100 p-4 rounded shadow cursor-pointer"
          >
            <img src={char.profilePicture} alt={char.name} />
            <h2 className="text-lg font-semibold">{char.name}</h2>
            <p className="text-gray-600">{char.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
