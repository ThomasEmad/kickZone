import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook للتعامل مع المصادقة والمستخدم
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user from localStorage on mount
  useEffect(() => {
    // التحقق من وجود مستخدم مسجل دخول
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  const login = useCallback((userData, tokens) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", tokens.access_token);
      if (tokens.refresh_token) {
        localStorage.setItem("refresh_token", tokens.refresh_token);
      }
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    login,
  };
}

/**
 * Custom hook لحماية الصفحات - يعيد التوجيه إذا لم يكن المستخدم مسجل دخول
 */
export function useProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
}

/**
 * Custom hook للتحقق من نوع المستخدم
 */
export function useUserRole(requiredRole) {
  const { user, loading } = useAuth();

  if (loading) {
    return { hasAccess: false, loading: true };
  }

  if (!user) {
    return { hasAccess: false, loading: false };
  }

  if (requiredRole && user.type !== requiredRole) {
    return { hasAccess: false, loading: false };
  }

  return { hasAccess: true, loading: false };
}
