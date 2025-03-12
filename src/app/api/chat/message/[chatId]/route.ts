import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Chat from "@/models/Chats";

// ✅ **Send a Message**
export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  await dbConnect();
  try {
    const { chatId } = params;
    const { sender, text, isImage, isVoice, imageURL, voiceURL } = await req.json();

    if (!sender || (!text && !imageURL && !voiceURL)) {
      return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
    }

    // Find chat and push message
    const chat = await Chat.findById(chatId);
    if (!chat) return NextResponse.json({ error: "Chat not found." }, { status: 404 });

    const newMessage = { sender, text, isImage, isVoice, imageURL, voiceURL, timestamp: new Date() };
    chat.messages.push(newMessage);
    await chat.save();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  await dbConnect();
  try {
    const { chatId } = params;

    const chat = await Chat.findById(chatId);
    if (!chat) return NextResponse.json({ error: "Chat not found." }, { status: 404 });

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
