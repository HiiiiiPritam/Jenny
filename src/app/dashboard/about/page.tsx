"use client";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();

  return (
    <div className="bg-black h-[calc(100dvh-4rem)]  text-white  flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute max-h-[calc(100dvh-4rem)] inset-0 bg-gradient-to-br from-darkPurple to-black opacity-60"></div>

      {/* Main Content Container */}
      <motion.div
        className="relative text-center z-10 max-w-4xl space-y-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-matteRed drop-shadow-lg">
          About Us 🚀
        </h1>

        {/* About AI Girlfriend Section */}
        <motion.div
          className="p-6 bg-white/10 rounded-xl shadow-lg border border-white/20 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-2xl font-semibold text-white">About the Project</h2>
          <p className="text-gray-300 text-md mt-2">
            Our AI Girlfriend project is designed to provide engaging and meaningful conversations using cutting-edge AI models. 
            Users can create unique AI characters, chat in real-time, and even use images to enhance conversations. I know there might be several bugs in the project, this is just a side project that i made for fun so please forgive me for your inconvenience, you may inform me about any issues you come across. Lots of Love ❤️
          </p>
        </motion.div>

        {/* About the Developer Section */}
        <motion.div
          className="p-6 bg-white/10 rounded-xl shadow-lg border border-white/20 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-2xl font-semibold text-white">About the Developer</h2>
          <p className="text-gray-300 text-md mt-2">
            Hi, I am Pritam a second year Computer Science Undergrad and the creator of Jenny AI. I am passionate about AI, full-stack development and CS in general.
            Feel free to connect with me!
          </p>

          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mt-4">
            <a href="mailto:ratsdust4226gmail.com" target="_blank" rel="noopener noreferrer">
              <FaEnvelope className="text-white text-2xl hover:text-matteRed transition-all" />
            </a>
            <a href="https://github.com/HiiiiiPritam" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-white text-2xl hover:text-matteRed transition-all" />
            </a>
            <a href="https://www.linkedin.com/in/pritam-roy-95185328a/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-white text-2xl hover:text-matteRed transition-all" />
            </a>
            <a href="https://www.instagram.com/pritam_roy_2023/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-white text-2xl hover:text-matteRed transition-all" />
            </a>
          </div>
        </motion.div>

        {/* CTA to Go Back */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-matteRed text-white px-6 py-3 rounded-full text-lg shadow-lg transition-all hover:bg-red-700"
          onClick={() => router.push("/dashboard")}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
