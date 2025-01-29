export const getRandomMessage = () => {
  const messages = [
    "Hey, are you busy? 😊",
    "I was just thinking about you! ❤️",
    "Do you miss me? 😘",
    "What are you up to right now? 😊",
    "I love talking to you 💕",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
