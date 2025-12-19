
import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Chat from "@/models/Chats";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userID = searchParams.get("userID");
  
  await dbConnect();

  if (!userID) {
    return NextResponse.json({ error: "UserID is required" }, { status: 400 });
  }

  try {
    const chats = await Chat.find({ user: userID }).populate("character");
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
