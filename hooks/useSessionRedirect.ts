import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useSessionRedirect(redirectUrl = "/") {
  const context = useSession();
  const { data: session, status } = context;
  const loading = status === "loading";
  const router = useRouter();

  useEffect((): void => {
    // Redirect if not authenticated
    if (!loading && !session) {
      void router.push(redirectUrl);
    }
  }, [session, loading, router]);

  return {
    ...context,
    loading,
  };
}
