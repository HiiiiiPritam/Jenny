import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Chat from "@/models/Chats";

// ✅ **Get All Chats of a User**
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await dbConnect();
  try {
    const { userId } = params;

    const chats = await Chat.find({ user: userId }).populate("character");

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
