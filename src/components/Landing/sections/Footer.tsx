// <== IMPORTS ==>
import { Mail } from "lucide-react";
import { JSX, useState, ChangeEvent } from "react";
import PURPLE_LOGO from "../../../assets/images/LOGO-PURPLE.png";

// <== FOOTER COMPONENT ==>
const Footer = (): JSX.Element => {
  // MESSAGE STATE
  const [message, setMessage] = useState<string>("");
  // HANDLE SEND FUNCTION
  const handleSend = (): void => {
    // CHECK IF MESSAGE IS EMPTY
    if (!message.trim()) return;
    // EXAMPLE RESPONSES ARRAY
    const responses = [
      "Thanks for reaching out!",
      "Message received! We'll get back to you soon.",
      "We appreciate your message!",
      "Your message has been sent successfully!",
    ];
    // GET RANDOM RESPONSE
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    // LOG USER MESSAGE AND RESPONSE
    console.log("User message:", message);
    console.log("Response:", randomResponse);
    // CLEAR TEXTAREA
    setMessage("");
  };
  // HANDLE MESSAGE CHANGE FUNCTION
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    // SET MESSAGE STATE
    setMessage(e.target.value);
  };
  // RETURNING THE FOOTER COMPONENT
  return (
    // FOOTER MAIN CONTAINER
    <section id="contact" className="text-gray-300 py-7 px-6 md:px-12 lg:px-24">
      {/* TOP SECTION CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-8">
        {/* LEFT COLUMN CONTAINER */}
        <div className="flex flex-col gap-4">
          {/* LOGO AND TITLE CONTAINER */}
          <div className="flex items-center gap-2">
            {/* FOOTER LOGO IMAGE */}
            <img
              src={PURPLE_LOGO}
              alt="PlanOra Logo"
              className="w-8 h-8 rounded"
            />
            {/* FOOTER LOGO TEXT */}
            <h1 className="text-xl font-medium text-gray-900">PlanOra</h1>
          </div>
          {/* FOOTER DESCRIPTION TEXT */}
          <p className="text-sm text-gray-600 leading-6 max-w-md">
            Simplifying project management for teams, freelancers, and
            businesses. Stay on top of your goals smart, fast, and organized.
          </p>
          {/* EMAIL CONTAINER */}
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
            {/* MAIL ICON */}
            <span className="inline-block">
              <Mail className="w-5 h-5" />
            </span>
            {/* EMAIL ADDRESS */}
            connect@planora.com
          </p>
        </div>
        {/* RIGHT COLUMN CONTAINER */}
        <div className="flex flex-col gap-3 relative">
          {/* MESSAGE TEXTAREA CONTAINER */}
          <div className="relative w-full">
            {/* MESSAGE TEXTAREA */}
            <textarea
              placeholder="Send your message..."
              value={message}
              onChange={handleMessageChange}
              className="w-full h-40 p-3 pr-20 text-sm rounded-lg bg-violet-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none text-black"
            />
            {/* SEND BUTTON */}
            <button
              onClick={handleSend}
              className="absolute bottom-3 right-2 bg-violet-500 hover:bg-violet-600 text-white font-medium px-4 py-1 rounded transition cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {/* BOTTOM SECTION CONTAINER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-3 mt-6 pt-12">
        {/* COPYRIGHT TEXT */}
        <p>© 2025 PlanOra. All rights reserved.</p>
        {/* FOOTER LINKS CONTAINER */}
        <div className="flex gap-5">
          {/* PRIVACY POLICY LINK */}
          <a href="#" className="hover:text-violet-500 transition">
            Privacy Policy
          </a>
          {/* TERMS OF SERVICE LINK */}
          <a href="#" className="hover:text-violet-500 transition">
            Terms of Service
          </a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
