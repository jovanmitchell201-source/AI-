"use client";
import Assistant from "@/components/assistant";
import ToolsPanel from "@/components/tools-panel";
import { Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useConversationStore from "@/stores/useConversationStore";

export default function Main() {
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const router = useRouter();
  const { resetConversation } = useConversationStore();

  // After OAuth redirect, reinitialize the conversation so the next turn
  // uses the connector-enabled server configuration immediately
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isConnected = new URLSearchParams(window.location.search).get("connected");
    if (isConnected === "1") {
      resetConversation();
      router.replace("/", { scroll: false });
    }
  }, [router, resetConversation]);

  return (
    <div className="flex flex-col h-screen">
      {/* Upgrade Banner */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <Link href="/" className="text-sm font-medium text-foreground">
          AI Assistant
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          <Sparkles className="h-3 w-3" />
          Upgrade
        </Link>
      </div>
      
      <div className="flex flex-1 justify-center overflow-hidden">
      <div className="w-full md:w-[70%]">
        <Assistant />
      </div>
      <div className=" hidden md:block w-[30%]">
        <ToolsPanel />
      </div>
      {/* Hamburger menu for small screens */}
      <div className="absolute top-4 right-4 md:hidden">
        <button onClick={() => setIsToolsPanelOpen(true)}>
          <Menu size={24} />
        </button>
      </div>
      {/* Overlay panel for ToolsPanel on small screens */}
      {isToolsPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-full bg-card h-full p-4">
            <button className="mb-4 text-foreground" onClick={() => setIsToolsPanelOpen(false)}>
              <X size={24} />
            </button>
            <ToolsPanel />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
