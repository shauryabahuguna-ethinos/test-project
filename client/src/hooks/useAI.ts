import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AIGeneratedContent } from "@shared/schema";

export function useAIContent() {
  return useQuery<AIGeneratedContent[]>({
    queryKey: ['ai-content'],
    queryFn: () => apiRequest('/api/ai/content'),
  });
}

export function useGenerateContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ type, originalText }: { type: string; originalText: string }) =>
      apiRequest('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ type, originalText }),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-content'] });
    },
  });
}

export function useAnalyzeTask() {
  return useMutation({
    mutationFn: ({ title, description }: { title: string; description: string }) =>
      apiRequest('/api/ai/analyze-task', {
        method: 'POST',
        body: JSON.stringify({ title, description }),
        headers: { 'Content-Type': 'application/json' },
      }),
  });
}