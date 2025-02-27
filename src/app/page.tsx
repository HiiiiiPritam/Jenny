import Image from "next/image";
import Link from "next/link";
import ladki from "@/images/indi-gf.webp";
// import ImagePage from "@/pages/ImagePage";
import Homepage from "@/pages/Homepage";


export default function Home() {
  return (
    <div>
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div
        style={{ backgroundImage: `url(${ladki.src})` }}
        className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-end"
      >
        {/* Logo Section */}
        <div className="fixed right-[-20px] top-[-20px] text-white font-bold text-wrap rounded-full bg-black bg-opacity-50 text-right h-24 w-24 z-10">
          <p className="relative top-5 right-7">
            <span className="text-purple-400">Jenny AI</span> Your Personal <br /> <span className="text-pink-600">Waifu</span>
          </p>
        </div>
        <Homepage />
        {/* Navigation */}
        <div className="absolute left-0 top-0">
          <Link href="/image" className="bg-purple-500 text-white px-4 py-2 rounded">Go to Image Generator</Link>
        </div>
      </div>
    </div>
    </div>
  );
}
