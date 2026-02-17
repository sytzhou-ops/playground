import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const OAuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Wait until we have a session (OAuth handler has finished)
    if (hasRedirected.current) return;
    
    if (session) {
      hasRedirected.current = true;
      const returnTo = localStorage.getItem("auth_return_to") || "/";
      localStorage.removeItem("auth_return_to");
      navigate(returnTo, { replace: true });
      return;
    }

    // If loading is done and still no session after a timeout, redirect to auth
    if (!loading && !session) {
      const fallback = setTimeout(() => {
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          navigate("/auth", { replace: true });
        }
      }, 5000);
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
