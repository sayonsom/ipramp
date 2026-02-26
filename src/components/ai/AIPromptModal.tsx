"use client";

import { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface AIPromptModalProps {
  open: boolean;
  onClose: () => void;
  featureName: string;
  systemPrompt: string;
  userPrompt: string;
  /** Called when user pastes a response and clicks Apply. Receives parsed JSON or raw string. */
  onApply?: (parsed: unknown) => void;
  /** Hint about expected response format */
  responseFormatHint?: string;
}

export function AIPromptModal({
  open,
  onClose,
  featureName,
  systemPrompt,
  userPrompt,
  onApply,
  responseFormatHint,
}: AIPromptModalProps) {
  const [showSystem, setShowSystem] = useState(false);
  const [copied, setCopied] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [applyError, setApplyError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleCopy() {
    const fullPrompt = `=== SYSTEM PROMPT ===\n${systemPrompt}\n\n=== USER PROMPT ===\n${userPrompt}`;
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleApply() {
    if (!responseText.trim() || !onApply) return;
    setApplyError(null);

    // Try to extract JSON from the response (may be wrapped in markdown code blocks)
    let text = responseText.trim();

    // Strip markdown code fences
    const jsonBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (jsonBlockMatch) {
      text = jsonBlockMatch[1].trim();
    }

    try {
      const parsed = JSON.parse(text);
      onApply(parsed);
      setResponseText("");
      onClose();
    } catch {
      // If not valid JSON, pass the raw text
      onApply(text);
      setResponseText("");
      onClose();
    }
  }

  function handleClose() {
    setResponseText("");
    setApplyError(null);
    setCopied(false);
    setShowSystem(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={`AI Assist: ${featureName}`} maxWidth="2xl">
      <div className="space-y-5">
        {/* Instruction banner */}
        <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Copy this prompt and paste it into any LLM</p>
            <p className="text-blue-600 mt-0.5">Works with ChatGPT, Claude, Gemini, or any AI assistant.</p>
          </div>
        </div>

        {/* System prompt (collapsible) */}
        <div>
          <button
            onClick={() => setShowSystem(!showSystem)}
            className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-ink transition-colors"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${showSystem ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            System Prompt (context for the AI)
          </button>
          {showSystem && (
            <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-neutral-off-white border border-border p-3 text-xs text-text-secondary whitespace-pre-wrap font-mono">
              {systemPrompt}
            </pre>
          )}
        </div>

        {/* User prompt (always visible) */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Your Prompt</label>
          <pre className="max-h-64 overflow-auto rounded-md bg-neutral-off-white border border-border p-3 text-sm text-ink whitespace-pre-wrap font-mono">
            {userPrompt}
          </pre>
        </div>

        {/* Copy button */}
        <Button onClick={handleCopy} className="w-full" variant={copied ? "secondary" : "primary"}>
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Copied to Clipboard
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              Copy Full Prompt to Clipboard
            </>
          )}
        </Button>

        {/* Response paste-back area */}
        {onApply && (
          <div className="border-t border-border pt-4">
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Paste AI Response Here (optional)
            </label>
            {responseFormatHint && (
              <p className="text-xs text-text-muted mb-2">{responseFormatHint}</p>
            )}
            <textarea
              ref={textareaRef}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Paste the AI's JSON response here, then click Apply..."
              rows={5}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm font-mono text-ink placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue-ribbon/40 resize-y"
            />
            {applyError && (
              <p className="mt-1 text-xs text-danger">{applyError}</p>
            )}
            <Button
              onClick={handleApply}
              disabled={!responseText.trim()}
              variant="secondary"
              size="sm"
              className="mt-2"
            >
              Apply Response
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
