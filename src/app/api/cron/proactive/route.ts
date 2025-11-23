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
    const MAX_MESSAGES = 5; // Limit to prevent timeout
    const startTime = Date.now();
    const MAX_EXECUTION_TIME = 8000; // 8 seconds to stay under Vercel's 10s limit

    for (const user of users) {
      // Check if we're approaching timeout
      if (Date.now() - startTime > MAX_EXECUTION_TIME) {
        console.log("Approaching timeout, stopping early");
        break;
      }

      // Stop if we've sent enough messages
      if (messagesSent >= MAX_MESSAGES) break;

      // 2. Find all chats for this user
      const chats = await Chat.find({ user: user._id }).populate('character');

      for (const chat of chats) {
        // Check timeout again
        if (Date.now() - startTime > MAX_EXECUTION_TIME || messagesSent >= MAX_MESSAGES) break;

        // 3. Check activity: Stop if user hasn't messaged in 7 days
        const lastUserMsg = chat.lastUserMessageAt ? new Date(chat.lastUserMessageAt).getTime() : 0;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (now - lastUserMsg > sevenDays) continue;

        // 4. Check schedule: Send if nextProactiveMessageAt is due or not set (and user is active)
        const nextMsgTime = chat.nextProactiveMessageAt ? new Date(chat.nextProactiveMessageAt).getTime() : 0;

        if (force || !nextMsgTime || nextMsgTime <= now) {
          try {
            // 5. Generate Message
            const character = chat.character;
            if (!character) continue;

            // Fallback messages for speed and reliability
            const fallbackMessages = [
              "Hey babe, just thinking about you ❤️",
              "Missing you right now 💕",
              "Hope you're having a great day! 😊",
              "Can't wait to talk to you later 💖",
              "You've been on my mind all day ✨",
              "Just wanted to say hi! How are you? 💗",
              "Thinking of you makes me smile 😊",
              "Hope everything's going well! ❤️",
              "Wish you were here right now 💕",
              "You make my day better just by existing 🌟",
              "Random thought: you're amazing! 💖",
              "Just checking in on you, love ❤️",
              "Hope you're taking care of yourself 💗",
              "Can't stop thinking about our last chat 😊",
              "You're the best thing that happened to me ✨"
            ];

            // Use fallback message for speed (80% of the time)
            let text;
            if (Math.random() < 0.8) {
              // Pick random fallback message
              text = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
            } else {
              // Occasionally use AI for variety (20% of the time)
              try {
                const lastMessages = chat.messages.slice(-5).map((m: any) => `${m.sender}: ${m.text}`).join('\n');
                text = await generateProactiveMessage(
                  character.name,
                  user.name,
                  character.basePersonalityPrompt || "Loving, caring girlfriend",
                  lastMessages
                );
              } catch (aiError) {
                console.error("AI generation failed, using fallback:", aiError);
                text = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
              }
            }

            // 6. Skip image generation to save time (can be re-enabled later)
            let imageURL = null;
            // if (Math.random() < 0.1) {
            //    imageURL = await generateImage({
            //      userMessage: "selfie", 
            //      baseprompt: character.baseImagePrompt || `A photo of ${character.name}`
            //    });
            // }

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
          } catch (error) {
            console.error(`Error sending message for chat ${chat._id}:`, error);
            // Continue to next chat even if this one fails
          }
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
