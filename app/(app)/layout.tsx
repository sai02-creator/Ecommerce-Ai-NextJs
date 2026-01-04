import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
          <main>{children}</main>
    </ClerkProvider>
  );
}
