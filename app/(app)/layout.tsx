import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
          <main>{children}</main>
          <Toaster position="bottom-center"/> 
          <SanityLive />
      </CartStoreProvider>

    </ClerkProvider>
  );
}
