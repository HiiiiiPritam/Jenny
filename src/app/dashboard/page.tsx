"use client";
import useCharacterStore from "@/store/useCharacterStore";
import { div } from "framer-motion/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const ExplorePage = () => {
  const { characters, fetchCharacters } = useCharacterStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {data : session} = useSession();
  useEffect(() => {
    const loadCharacters = async () => {
      await fetchCharacters();
      setLoading(false);
    };
    loadCharacters();
  }, []);
 
  if(!session)return <div>Login first</div>
  if (loading) return <p>Loading characters...</p>;

  const createChat=async(characterId:string)=>{
      const userId= session.user.id;
      const response = await fetch(`/api/chat/create`,{
        
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId, characterId
          }),
        
      })

      const data :any = response.json();

      if(response.ok){
        alert("chat created")
        // router.push(`/dashboard/my-chats/${data._id}`)
      }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Explore AI Characters</h1>
      <div className="grid grid-cols-3 gap-4">
        {characters.map((char) => (
          <div onClick={()=>createChat(char._id)} key={char._id} className="bg-gray-100 p-4 rounded shadow cursor-pointer">
            <div className="">
              <img src={char.profilePicture} alt={char.name} />
            <h2 className="text-lg font-semibold">{char.name}</h2>
            </div>            
            <p className="text-gray-600">{char.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
