export const getRandomMessage = () => {
    const messages = [
      // Friendly Greetings 👋
      "Hello! I'm here and ready to help with whatever you need! 😊",
      "Hi there! How can I assist you today? 🌟",
      "Good to see you! What would you like to chat about? 😄",
      "Welcome back! I'm excited to help you with your questions. ✨",
      "Hey! I'm your AI assistant - here whenever you need me! 🤖",
      
      // Helpful & Supportive 🎯
      "I'm here to help make your day easier! What can I do for you? 💪",
      "Looking forward to assisting you! What's on your mind? 🤔",
      "I'm ready to tackle any questions or tasks you have! 🚀",
      "Your AI assistant is at your service! How can I help? 📚",
      "I'm here to provide support and information. What do you need? 💡",
  
      // Professional & Encouraging 📈
      "Ready to collaborate and find solutions together! 🤝",
      "I'm here to help you achieve your goals. What shall we work on? 🎯",
      "Let's make today productive! How can I assist you? ⚡",
      "I'm your helpful AI companion - here to support your success! 🌟",
      "Ready to help you learn, create, or solve problems! 🧠",
  
      // Curious & Engaging 🔍
      "What interesting topics would you like to explore today? 🗺️",
      "I'm curious about what you're working on! How can I help? 🔬",
      "Ready to dive into any subject you're interested in! 📖",
      "What questions can I help you answer today? 💭",
      "I'm here to help with information, advice, or just good conversation! 💬",
  
      // Motivational & Positive ✨
      "You've got this! I'm here to support you every step of the way! 💪",
      "Ready to help you learn something new today! 📚",
      "I believe in your potential! How can I help you succeed? 🌟",
      "Let's make today amazing! What would you like to accomplish? 🎉",
      "I'm excited to help you discover new possibilities! 🚀",
  
      // Patient & Understanding 🤗
      "I'm here whenever you're ready to chat or need assistance! ⏰",
      "Take your time - I'm here to help at your own pace! 🕐",
      "No rush at all! I'm here when you need me. 😌",
      "I'm patient and ready to help whenever you are! 🙂",
      "Whenever you're ready, I'm here to assist! 👍",
  
      // Creative & Fun 🎨
      "Ready to brainstorm, create, or solve puzzles together! 🧩",
      "I love helping with creative projects! What are you working on? 🎨",
      "Let's explore ideas and possibilities together! 💭",
      "I'm here to help spark your creativity and productivity! ⚡",
      "Ready for some collaborative problem-solving! 🤝"
    ];
  
    return messages[Math.floor(Math.random() * messages.length)];
  };
