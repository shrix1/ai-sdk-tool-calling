"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, useChat } from "ai/react";
import { Markdown } from "../markdown";
import ChatInput from "./chat-input";
import { Button } from "../ui/button";

type ChatUIProps = {
  setEditorContent: (content: string) => void;
  editorContent: string;
};

type ResponseObject = {
  message: string;
  updateEditorHTML: boolean;
  editorHTML: string;
  nextPrompt: string[];
};

export type Mode = "chat" | "composer";
export type Tools = "web" | "x" | "none" | "url";

export function ChatUI({ setEditorContent, editorContent }: ChatUIProps) {
  const [nextPromptSuggestion, setNextPromptSuggestion] = useState<string[]>([
    "List all the tasks in table format",
    "Mark this |taskName| as done",
    "Add a new task |taskName|",
  ]);
  const [mode, setMode] = useState<Mode>("chat");
  const [activeTool, setActiveTool] = useState<Tools>("none");
  const { messages, input, isLoading, setInput, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      tool: activeTool,
    },
  });
  const [composerMessages, setComposerMessages] = useState<Message[]>([]);
  const [isLoadingComposer, setIsLoadingComposer] = useState(false);
  const [inputComposer, setInputComposer] = useState<string>("");

  async function handleSubmitComposer() {
    if (inputComposer.length === 0) {
      alert("Please enter a message");
      return;
    }
    setInputComposer("");
    setIsLoadingComposer(true);
    setComposerMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputComposer, id: crypto.randomUUID() },
    ]);
    const response = await fetch("/api/composer", {
      method: "POST",
      body: JSON.stringify({
        messages: composerMessages,
        editorHTML: editorContent,
        prompt: inputComposer,
      }),
    });
    const data: ResponseObject = await response.json();
    console.log("ai-object", data);
    if (data.updateEditorHTML === true) {
      console.log("data.editorHTML is updated", data.editorHTML);
      setEditorContent(data.editorHTML);
    }
    setNextPromptSuggestion(data.nextPrompt);
    setComposerMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: data.message, id: crypto.randomUUID() },
    ]);
    setIsLoadingComposer(false);
  }

  console.log("messages", messages);
  console.log("composerMessages", composerMessages);

  return (
    <div className="flex flex-col h-full">
      <div className="pt-2 px-2 border-b flex gap-2">
        <Button
          variant="ghost"
          tooltipText="Chat with search, twitter and more"
          className={`rounded-none border-b-2 border-b-transparent ${
            mode === "chat" ? "border-b-primary" : ""
          } `}
          onClick={() => setMode("chat")}
        >
          Chat
        </Button>
        <Button
          variant="ghost"
          tooltipText="AI have context about the Notes, So it can edit, add, delete, and create new notes"
          className={`rounded-none border-b-2 border-b-transparent ${
            mode === "composer" ? "border-b-primary" : ""
          } `}
          onClick={() => setMode("composer")}
        >
          Composer
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {(mode === "chat" ? messages : composerMessages).map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : message.content === ""
                  ? "bg-blue-100 text-blue-500 font-medium"
                  : "bg-gray-200 text-black"
              }`}
            >
              {message.role === "user" ? (
                message.content
              ) : (
                <Markdown>
                  {message.content === ""
                    ? message?.toolInvocations?.[0]?.toolName +
                      " tool called with the query: " +
                      message?.toolInvocations?.[0]?.args?.query
                    : message.content}
                </Markdown>
              )}
            </span>
          </div>
        ))}
        {(isLoading || isLoadingComposer) && (
          <span className="ml-2 text-xs text-muted-foreground">
            Thinking...
          </span>
        )}
      </ScrollArea>
      <ChatInput
        input={mode === "chat" ? input : inputComposer}
        setInput={mode === "chat" ? setInput : setInputComposer}
        handleSubmit={mode === "chat" ? handleSubmit : handleSubmitComposer}
        isLoading={mode === "chat" ? isLoading : isLoadingComposer}
        nextPromptSuggestion={nextPromptSuggestion}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        mode={mode}
      />
    </div>
  );
}
