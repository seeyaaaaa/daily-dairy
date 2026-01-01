import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 max-w-md mx-auto text-center">
      <div className="w-24 h-24 mb-6 rounded-3xl bg-accent flex items-center justify-center">
        <span className="text-5xl">🥛</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The page "{location.pathname}" doesn't exist.
      </p>
      <Button variant="fresh" size="lg" asChild>
        <Link to="/">
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
