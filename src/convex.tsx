import type { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

/** True once both Convex and Clerk env vars are set — flips the app from mock to the live backend. */
export const convexConfigured = Boolean(convexUrl && clerkKey);

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function CofoundrProviders({ children }: { children: ReactNode }) {
  if (!convexConfigured || !convex || !clerkKey) return <>{children}</>;
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
