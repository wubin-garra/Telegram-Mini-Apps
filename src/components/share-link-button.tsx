"use client";

import { useState } from "react";
import {
  buildGameShareText,
  buildTelegramShareLink,
  getGameTelegramLink,
} from "@/lib/bot-links";
import { getTelegramWebApp } from "@/lib/telegram";

type ShareLinkButtonProps = {
  slug: string;
  title: string;
  challenge: string;
  label?: string;
  className?: string;
};

type CopyLinkButtonProps = {
  slug: string;
  className?: string;
};

export function ShareLinkButton({
  slug,
  title,
  challenge,
  label = "Share",
  className = "button button--ghost",
}: ShareLinkButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const deepLink = getGameTelegramLink(slug);

  async function handleShare() {
    if (!deepLink) return;

    const text = buildGameShareText(title, challenge);
    const shareUrl = buildTelegramShareLink({
      url: deepLink,
      text,
    });
    const webApp = getTelegramWebApp();
    setIsOpening(true);

    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text,
            url: deepLink,
          });
          return;
        } catch {
          // Fall back to Telegram share if the native share sheet is canceled or unavailable.
        }
      }

      if (webApp?.openTelegramLink) {
        webApp.openTelegramLink(shareUrl);
        return;
      }

      window.open(shareUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsOpening(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        handleShare().catch(() => undefined);
      }}
      disabled={!deepLink || isOpening}
    >
      {isOpening ? "Opening..." : label}
    </button>
  );
}

export function CopyLinkButton({
  slug,
  className = "button button--ghost",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const deepLink = getGameTelegramLink(slug);

  async function handleCopy() {
    if (!deepLink) return;
    await navigator.clipboard.writeText(deepLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        handleCopy().catch(() => undefined);
      }}
      disabled={!deepLink}
    >
      {copied ? "Copied" : "Copy Link"}
    </button>
  );
}
