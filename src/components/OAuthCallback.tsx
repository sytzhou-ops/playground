import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const OAuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log("[OAuthCallback] state:", { session: !!session, loading, hasRedirected: hasRedirected.current });
    
    if (hasRedirected.current) return;

    if (session) {
      hasRedirected.current = true;
      const returnTo = localStorage.getItem("auth_return_to") || "/";
      localStorage.removeItem("auth_return_to");
      console.log("[OAuthCallback] Redirecting to:", returnTo);
      navigate(returnTo, { replace: true });
      return;
    }

    // Fallback: if no session after 8 seconds, go to home page
    // (the lovable handler may have already set the session before React mounted)
    if (!loading) {
      const fallback = setTimeout(() => {
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          console.log("[OAuthCallback] Fallback redirect to /");
          navigate("/", { replace: true });
        }
      }, 8000);
      return () => clearTimeout(fallback);
    }
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground animate-pulse">Signing you in...</p>
    </div>
  );
};

export default OAuthCallback;
