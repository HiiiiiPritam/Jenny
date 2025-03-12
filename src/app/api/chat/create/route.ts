import dbConnect from "@/libs/dbConnect";
import Chats from "@/models/Chats";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { userId, characterId } = await req.json();

    const newChat = await Chats.create({
      user:userId,
      character: characterId,
      messages: [],
    });

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
