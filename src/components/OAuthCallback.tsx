import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const OAuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // Once we have a session (or loading is done), redirect
    const returnTo = localStorage.getItem("auth_return_to") || "/";
    localStorage.removeItem("auth_return_to");

    // Small delay to let session fully propagate
    const timer = setTimeout(() => {
      navigate(returnTo, { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
};

export default OAuthCallback;
