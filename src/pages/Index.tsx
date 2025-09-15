
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center animate-pulse">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-orphan-blue" />
        <p className="mt-4 text-lg text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
