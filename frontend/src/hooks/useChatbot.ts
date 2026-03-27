import { useState } from "react";
import api from "@/lib/api";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI recruitment assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userText: string) => {
    const userMessage: ChatMessage = { role: "user", content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Reverted to original gemini endpoint
      const res = await api.post("/recruitment-chat/chat", {
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      const data = res.data as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err?.response?.data?.details
              ? `${err?.response?.data?.error || "Failed to get response"}: ${err.response.data.details}`
              : err?.response?.data?.error ||
                err?.message ||
                "Failed to get response from the chatbot.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
}
