import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  arg1: string,
  arg2?: RequestInit | string,
  arg3?: unknown
): Promise<any> {
  let url: string;
  let init: RequestInit = {
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  };

  // Handle legacy signature: apiRequest(method, url, data)
  if (typeof arg2 === 'string' || arg3 !== undefined) {
    const method = arg1.toUpperCase();
    url = arg2 as string;
    if (arg3 !== undefined) {
      init.body = JSON.stringify(arg3);
    }
    init.method = method;
  } else {
    // Handle new signature: apiRequest(url, options)
    url = arg1;
    init = { ...init, method: 'GET', ...(arg2 || {}) };
  }

  // Defensive guard: if method looks like a URL, reset to GET
  if (init.method && init.method.startsWith('/')) {
    init.method = 'GET';
  }

  const res = await fetch(url, init);
  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
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
