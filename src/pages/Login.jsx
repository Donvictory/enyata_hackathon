import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { useLogin } from "../hooks/use-auth";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        toast.success(`Welcome back! 🎉`);
        // Use isOnboarded flag for routing
        const user = data.data?.user || data.user;

        if (!user?.isOnboarded) {
          console.log("is not onboarded");
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Please check your credentials.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img src="/logo.svg" alt="DriftCare Logo" className="w-24 h-24" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Login to continue your health journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="py-2 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="py-2 mt-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-emerald-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
