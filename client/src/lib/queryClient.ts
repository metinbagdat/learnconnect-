import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`[API] ${method} ${url}`, data ? { data } : "");
  
  // Get auth token from localStorage if available
  const user = localStorage.getItem('edulearn_user');
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  // If we have a user in localStorage, add it as a custom header
  if (user) {
    try {
      const userData = JSON.parse(user);
      headers['X-User-Id'] = userData.id?.toString() || '';
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e);
    }
  }
  
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    console.log(`[API] Response: ${method} ${url}`, { status: res.status, ok: res.ok });
    
    if (!res.ok) {
      const text = await res.text();
      console.error(`[API] Error response:`, { status: res.status, text });
      throw new Error(`${res.status}: ${text}`);
    }
    return res;
  } catch (error) {
    console.error(`[API] Request failed:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get auth token from localStorage if available
    const user = localStorage.getItem('edulearn_user');
    const headers: Record<string, string> = {};
    
    // If we have a user in localStorage, add it as a custom header
    if (user) {
      try {
        const userData = JSON.parse(user);
        headers['X-User-Id'] = userData.id?.toString() || '';
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
      }
    }
    
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
