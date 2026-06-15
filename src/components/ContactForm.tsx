import React, { useState } from "react";
import { Send, CheckCircle, Mail, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ContactFormProps {
  onMessageSubmitted: () => void;
}

export default function ContactForm({ onMessageSubmitted }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMessage("Please complete all sections of the form before submitting.");
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessInfo(data.message);
        setName("");
        setEmail("");
        setMessage("");
        onMessageSubmitted(); // Refreshes the database ledger on parent
      } else {
        setErrorMessage(data.message || "Failed to submit message.");
      }
    } catch (err: any) {
      setErrorMessage("Network server error: Could not submit contact: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="contact-form-section" className="bg-[#161616] border border-[#222222] rounded-xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none" />

      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-300 mb-1">
          <Mail className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">SECURE BUSINESS COMMUNICATIONS</span>
        </div>
        <h3 className="text-3xl font-serif text-white tracking-tight">Initiate Collaboration</h3>
        <p className="text-sm text-zinc-400 mt-2">
          Submit your details below to initiate a private connection. All entries are securely dispatched to my inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-mono"
            >
              ⚠️ {errorMessage}
            </motion.div>
          )}

          {successInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg text-xs"
            >
              <div className="flex items-center gap-2 font-semibold mb-1">
                <CheckCircle className="w-4 h-4" />
                Message Intercepted Successfully!
              </div>
              <p className="text-zinc-300 font-mono text-[11px] mt-1 pl-6 leading-relaxed">
                {successInfo}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 uppercase">
              <User className="w-3.5 h-3.5 text-zinc-600" /> Lead Operator / Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Margaret Hamilton"
              className="w-full bg-transparent border-b border-[#222222] focus:border-white/40 py-2 text-white placeholder-zinc-700 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 uppercase">
              <Mail className="w-3.5 h-3.5 text-zinc-600" /> Digital Mailbox / Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. margaret@nasa.gov"
              className="w-full bg-transparent border-b border-[#222222] focus:border-white/40 py-2 text-white placeholder-zinc-700 focus:outline-none transition-colors text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-600" /> Statement of Scope / Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Outline your technology goals, architectural needs, or feedback notes..."
            rows={4}
            className="w-full bg-transparent border-b border-[#222222] focus:border-white/40 py-2 text-white placeholder-zinc-700 focus:outline-none transition-colors text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-lg tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer clickable-cursor"
        >
          {isSending ? (
            <>
              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Sinking Packets...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Commit Transmission
            </>
          )}
        </button>
      </form>
    </div>
  );
}
