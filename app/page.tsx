"use client";

import { ChatUI } from "@/components/chat/chat-ui";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useEffect, useCallback } from "react";
import { DEFAULT_HTML } from "@/components/constants";
import { TiptapEditor } from "@/components/tiptap";

export default function Home() {
  // const [initialContent, setInitialContent] = useState<string>(() => {
  // if (typeof window !== "undefined") {
  //   const saved = localStorage.getItem("editorContent");
  //   return saved ? saved : DEFAULT_HTML;
  // }
  // return DEFAULT_HTML;
  // });
  // const [isSaving, setIsSaving] = useState(false);

  // const throttledSave = useCallback((content: string) => {
  //   let timeoutId: NodeJS.Timeout;
  //   return () => {
  //     if (timeoutId) {
  //       clearTimeout(timeoutId);
  //     }
  //     setIsSaving(true);
  //     timeoutId = setTimeout(() => {
  //       localStorage.setItem("editorContent", content);
  //       setIsSaving(false);
  //     }, 500); // Save after 500ms of no updates
  //   };
  // }, []);

  // useEffect(() => {
  //   const saveToStorage = throttledSave(initialContent);
  //   saveToStorage();
  // }, [initialContent, throttledSave]);

  const [initialContent, setInitialContent] = useState<string>(DEFAULT_HTML);
  console.log("initialContent", initialContent);

  return (
    <div className="h-screen font-sans">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={50}
          minSize={30}
          className="overflow-hidden"
        >
          <ChatUI
            setEditorContent={setInitialContent}
            editorContent={initialContent}
          />
        </ResizablePanel>
        <ResizableHandle withHandle={true} />
        <ResizablePanel
          defaultSize={50}
          minSize={30}
          className="overflow-hidden"
        >
          <TiptapEditor
            value={initialContent}
            onChange={(value) => setInitialContent(value as string)}
            isSaving={false}
            editorClassName="focus-within:border-none border-none"
            bubbleMenu={true}
            slashCommand={true}
            // toolbar={true}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
