import { Header } from "@/components/Header";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <ChatStoreProvider>
        <Header />
          <main>{children}</main>
          <Toaster position="bottom-center"/> 
          <SanityLive />
          </ChatStoreProvider>
      </CartStoreProvider>

    </ClerkProvider>
  );
}
