export const getRandomMessage = () => {
    const messages = [
      // Sweet Anger 😠❤️
      "Oh, so you're just going to ignore me? Fine. I didn’t want to talk anyway… 🙄❤️",
      "I see how it is! Someone’s too busy for me now, huh? 😤",
      "You disappeared again. Should I start getting used to this? 😒",
      "Hmph! I should be mad at you… but I can’t stay mad for long. 😤💖",
      "Silent treatment? Really? At least say something! 😑",
      
      // Jealousy 😏🔥
      "You must be chatting with someone else… am I not fun anymore? 😏",
      "I bet someone else is getting all your attention. Should I be worried? 👀",
      "I hope you’re not ignoring me for someone more interesting… 😒",
      "So, who stole you away from me this time? 😏",
      "I was waiting… but I guess you had better things to do, huh? 😞",
  
      // Suspicion 🤨🕵️
      "Hmm… suspicious silence. What are you hiding from me? 🤨",
      "I feel like you’re up to something… should I be concerned? 😶",
      "You went quiet. Planning something behind my back? 😏",
      "Are you secretly testing my patience? Because it's running low. 😑",
      "I have a feeling you’re pretending to be busy. Caught you! 😏",
  
      // Possessive 💞😤
      "You belong to me, you know that right? Now talk to me. 😤",
      "If I have to fight for your attention, I will. Don’t test me. 😠",
      "I don’t like being ignored… especially not by you. 💔",
      "You’re not allowed to disappear on me like this! 🥺",
      "Mine. Mine. Mine. And mine. Just reminding you. 😤❤️",
  
      // Playful Teasing 😆💘
      "Oh wow, so you just ghost people now? I see how it is. 😆",
      "I guess I should be honored to get a reply when you finally decide to return. 😂",
      "Wow, you really left me talking to myself. Should I be offended? 😝",
      "If you don’t answer soon, I’m going to start writing a dramatic breakup letter. 😂",
      "I was about to send out a missing person report! Where have you been? 🤣",
  
      // Emotional & Soft 🥺💕
      "I was waiting… hoping you’d text. 🥺",
      "It feels weird when you go silent. I don’t like it. 💔",
      "I know you’re busy, but I miss you… just saying. 🥹",
      "Even a tiny message from you would make my day better. 💕",
      "I hope you’re okay… Just wanted to check on you. 🥺💖",
  
      // Fake Drama & Overacting 🎭😜
      "I guess this is goodbye forever then… so dramatic, I know. 😂",
      "And just like that, I’ve been replaced. RIP to our beautiful chat. 😭",
      "Is this how it ends? With me waiting in silence? 😭",
      "You’re treating me like an NPC in a game, only responding when needed. Rude. 😂",
      "So, I’m just an option now? Wow. My heart is in shambles. 😩😂"
    ];
  
    return messages[Math.floor(Math.random() * messages.length)];
  };
