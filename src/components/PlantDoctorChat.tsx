import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { PlantAnalysisResult } from "../types";
import { getApiEndpoint } from "../services/apiConfig";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface PlantDoctorChatProps {
  plantData: PlantAnalysisResult;
}

export const PlantDoctorChat: React.FC<PlantDoctorChatProps> = ({ plantData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `Ciao! Sono il Dottore Botanico di FloraID. Ho esaminato la tua **${plantData.identification.commonName}** (${plantData.identification.scientificName}). Puoi chiedermi qualsiasi cosa su irrigazione, parassiti, concimazione o sintomi visibili!`,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    "Perché le punte delle foglie diventano marroni?",
    "Come rinvasarla correttamente?",
    "Posso metterla in bagno o in una stanza poco illuminata?",
    "Cosa fare se noto piccoli moscerini nel terriccio?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    const question = textToSend.trim();
    if (!question || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", text: question }];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch(getApiEndpoint("/api/plant-chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantName: plantData.identification.commonName,
          scientificName: plantData.identification.scientificName,
          question,
          messages: newMessages.slice(-6), // last 6 for context
        }),
      });

      if (!res.ok) throw new Error("Errore API");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "Non sono riuscito a elaborare una risposta precisa.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Scusami, si è verificato un errore di connessione temporaneo. Riprova tra poco.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs flex flex-col h-[580px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <span>Dottore Botanico FloraID</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                AI Attivo
              </span>
            </h4>
            <p className="text-xs text-stone-400">
              Consulenza su {plantData.identification.commonName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                msg.role === "user"
                  ? "bg-emerald-700 text-white"
                  : "bg-white border border-stone-200 text-emerald-800 shadow-xs"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.role === "user"
                  ? "bg-emerald-800 text-white rounded-tr-xs"
                  : "bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs whitespace-pre-line"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 text-emerald-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-4 text-xs text-stone-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Il Dottore Botanico sta formulando la diagnosi...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 3 && (
        <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200/70 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="shrink-0 bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Fai una domanda specifica su ${plantData.identification.commonName}...`}
          disabled={isLoading}
          className="flex-1 p-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
