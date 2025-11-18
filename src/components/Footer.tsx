import { Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-600 to-gray-500 text-white relative overflow-hidden">
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full text-white"
        >
          <path
            d="M0,0 C300,100 600,-50 900,30 C1200,110 1500,-20 1440,60 L1440,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative px-8 py-16 lg:px-16 lg:py-20">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-x-28">
          {/* About */}
          <div className="flex flex-col gap-3 max-w-lg">
            <h2 className="text-3xl font-bold text-white">About Ticketing App</h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Ticketing App is your one-stop platform to explore, book, and manage
              tickets for concerts, sports, theatre, and more. Experience seamless booking,
              secure payments, and a user-friendly interface built for everyone.
            </p>
            <p className="text-lg text-blue-100 leading-relaxed">
              Currently in development mode — crafted as a real-world learning project to
              experiment with modern UI/UX and event management systems.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold text-white">Contact Us</h2>
            <div className="text-lg text-blue-100">
              <Link
                href="mailto:support@ticketingapp.com"
                className="block hover:underline"
              >
                support@ticketingapp.com
              </Link>
              <Link href="tel:+919876543210" className="block hover:underline">
                +91 98765 43210
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h2 className="text-3xl font-semibold text-white">Follow Us</h2>
            <div className="flex space-x-6">
              <a
                href="https://github.com/"
                aria-label="GitHub"
                className="hover:text-blue-200 transform hover:scale-125 transition-all duration-150"
              >
                <Github className="w-7 h-7" />
              </a>
              <a
                href="https://linkedin.com/"
                aria-label="LinkedIn"
                className="hover:text-blue-200 transform hover:scale-125 transition-all duration-150"
              >
                <Linkedin className="w-7 h-7" />
              </a>
              <a
                href="https://instagram.com/"
                aria-label="Instagram"
                className="hover:text-blue-200 transform hover:scale-125 transition-all duration-150"
              >
                <Instagram className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-blue-400/40 py-4 text-center text-sm text-blue-100">
        © {year} Ticketing App — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
