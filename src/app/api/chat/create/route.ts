import dbConnect from "@/libs/dbConnect";
import Chats from "@/models/Chats";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { userId, characterId } = await req.json();

    if (!userId || !characterId) {
      return NextResponse.json({ error: "User ID and Character ID are required" }, { status: 400 });
    }

    // ✅ Use findOne instead of find
    const alreadyChat = await Chats.findOne({ user: userId, character: characterId });

    if (alreadyChat) {
      return NextResponse.json({ 
        error: "Chat already exists", 
        chatId: alreadyChat._id  // ✅ Return existing chat ID
      }, { status: 400 });
    }

    const newChat = await Chats.create({
      user: userId,
      character: characterId,
      messages: [],
    });

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
