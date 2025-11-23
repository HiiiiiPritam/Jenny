import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import User from "@/models/User";
import Chat from "@/models/Chats";
import Character from "@/models/Character";
import { generateProactiveMessage, generateImage } from "@/services/generativeAIService";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    // 1. Find users with Real Girlfriend Mode enabled
    const users = await User.find({ isRealGirlfriendMode: true });
    let messagesSent = 0;

    for (const user of users) {
      // 2. Find all chats for this user
      const chats = await Chat.find({ user: user._id }).populate('character');

      for (const chat of chats) {
        // 3. Check activity: Stop if user hasn't messaged in 7 days
        const lastUserMsg = chat.lastUserMessageAt ? new Date(chat.lastUserMessageAt).getTime() : 0;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (now - lastUserMsg > sevenDays) continue;

        // 4. Check schedule: Send if nextProactiveMessageAt is due or not set (and user is active)
        const nextMsgTime = chat.nextProactiveMessageAt ? new Date(chat.nextProactiveMessageAt).getTime() : 0;

        if (force || !nextMsgTime || nextMsgTime <= now) {
          // 5. Generate Message
          const character = chat.character;
          if (!character) continue;

          // Get last few messages for context
          const lastMessages = chat.messages.slice(-5).map((m: any) => `${m.sender}: ${m.text}`).join('\n');

          const text = await generateProactiveMessage(
            character.name,
            user.name,
            character.basePersonalityPrompt || "Loving, caring girlfriend",
            lastMessages
          );

          // 6. Randomly generate an image (10% chance)
          let imageURL = null;
          if (Math.random() < 0.1) {
             imageURL = await generateImage({
               userMessage: "selfie", 
               baseprompt: character.baseImagePrompt || `A photo of ${character.name}`
             });
          }

          // 7. Save Message
          const newMessage = {
            sender: "bot",
            text: text,
            isImage: !!imageURL,
            imageURL: imageURL,
            timestamp: new Date()
          };

          chat.messages.push(newMessage);
          chat.lastProactiveMessageSentAt = new Date();
          
          // Schedule NEXT message (4-12 hours later)
          const randomHours = Math.floor(Math.random() * (12 - 4 + 1) + 4);
          chat.nextProactiveMessageAt = new Date(now + randomHours * 60 * 60 * 1000);
          
          await chat.save();
          messagesSent++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      messagesSent, 
      usersProcessed: users.length 
    });

  } catch (error) {
    console.error("Proactive messaging error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
