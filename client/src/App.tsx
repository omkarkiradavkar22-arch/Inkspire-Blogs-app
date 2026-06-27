import { useState } from "react";
import {
  Twitter,
  CircleDot,
  Instagram,
  Linkedin,
} from "lucide-react";

// Constants
const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4";

const SERVICES = [
  "Website",
  "Mobile App",
  "Web App",
  "E-Commerce",
  "Visual Identity",
  "3D & Motion",
  "Digital Marketing",
  "Growth & Consulting",
  "Other",
];

// SocialBtn Helper Component
const SocialBtn = ({
  icon: Icon,
  bgColor,
  textColor,
  label,
}: {
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  label: string;
}) => (
  <button
    className={`w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity ${bgColor} ${textColor}`}
    aria-label={label}
  >
    <Icon size={13} />
  </button>
);

function App() {
  // State
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Toggle Service Selection
  const toggleService = (service: string) => {
    setSelected((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      {/* Main Card */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:h-[calc(100vh-48px)]">
        
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:h-full p-4 sm:p-6 md:p-8 gap-6">
          
          {/* Navbar */}
          <nav className="w-full sm:w-auto">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm pl-3 sm:pl-4 pr-2 py-2 flex items-center gap-3 sm:gap-6">
              
              {/* Logo */}
              <svg viewBox="0 0 256 256" className="w-8 h-8 flex-shrink-0">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" fill="black" />
                <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" fill="black" />
              </svg>

              {/* Links - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-6">
                <a href="#" className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap">
                  Our story
                </a>
                <a href="#" className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap">
                  Expertise
                </a>
                <a href="#" className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap">
                  Our work
                </a>
                <a href="#" className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap">
                  Journal
                </a>
              </div>

              {/* CTA Button */}
              <button className="bg-black text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors ml-auto">
                Start a project
              </button>
            </div>
          </nav>

          {/* Spacer */}
          <div className="flex-1 min-h-[2rem]" />

          {/* Bottom Row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            
            {/* Headline - Left */}
            <div className="shrink-0 lg:max-w-lg xl:max-w-2xl">
              <p className="text-white text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg">
                We craft bold ideas
                <br />
                and ship them as{" "}
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  products
                </span>
              </p>
            </div>

            {/* Contact Form Card - Right */}
            <div className="w-full lg:w-[min(480px,45%)] shrink-0">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 flex flex-col gap-4">
                
                {/* Success State */}
                {sent ? (
                  <div className="py-6 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl">
                      ✓
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">
                      You're all set!
                    </h2>
                    <p className="text-sm text-gray-500">
                      Expect a reply within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Heading */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-black tracking-tight">
                      Say hello! 👋
                    </h2>

                    {/* Email + Socials Row */}
                    <div className="flex flex-row items-center justify-between gap-3 bg-gray-50 rounded-2xl px-4 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-400 text-xs font-medium whitespace-nowrap">
                          Drop us a line
                        </span>
                        <a
                          href="mailto:hello@forma.co"
                          className="text-blue-600 font-semibold hover:underline truncate text-sm"
                        >
                          hello@forma.co
                        </a>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <SocialBtn
                          icon={Twitter}
                          bgColor="bg-gray-100"
                          textColor="text-gray-800"
                          label="Twitter"
                        />
                        <SocialBtn
                          icon={CircleDot}  // Fixed
                          bgColor="bg-pink-100"
                          textColor="text-pink-500"
                          label="Circle"
                        />
                        <SocialBtn
                          icon={Instagram}
                          bgColor="bg-orange-100"
                          textColor="text-orange-400"
                          label="Instagram"
                        />
                        <SocialBtn
                          icon={Linkedin}
                          bgColor="bg-blue-100"
                          textColor="text-blue-600"
                          label="LinkedIn"
                        />
                      </div>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-gray-400 font-medium text-sm">OR</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <label className="text-sm font-medium text-black">
                        Tell us about your vision
                      </label>

                      {/* Name + Email */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                          required
                        />
                      </div>

                      {/* Message */}
                      <textarea
                        rows={4}
                        placeholder="What are you looking to build or improve..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                        required
                      />

                      {/* Service Tags */}
                      <div>
                        <label className="text-sm font-medium text-black block mb-1.5">
                          I need help with...
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {SERVICES.map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => toggleService(service)}
                              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
                                selected.includes(service)
                                  ? "bg-gray-100 text-black border-black"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              {service}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-black text-white text-sm font-semibold py-3 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-60"
                      >
                        {sending ? "Sending..." : "Send my message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;