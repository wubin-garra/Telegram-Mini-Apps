import { AppNav } from "@/components/app-nav";
import { BotEntryCard } from "@/components/bot-entry-card";
import { ProfileOverview } from "@/components/profile-overview";
import { TelegramShell } from "@/components/telegram-shell";

export const metadata = {
  title: "Profile | Telegram Arcade",
};

export default function ProfilePage() {
  return (
    <TelegramShell>
      <main className="page">
        <ProfileOverview />
        <BotEntryCard />
      </main>
      <AppNav />
    </TelegramShell>
  );
}
