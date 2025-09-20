import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch('/api/auth/user', {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          return null; // Not authenticated
        }
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
