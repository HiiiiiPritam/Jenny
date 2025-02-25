import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 bg-gray-300 rounded-lg px-3 py-2 w-fit">
      <span className="text-gray-600">Typing</span>
      <motion.span
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  );
};

export default TypingIndicator;
