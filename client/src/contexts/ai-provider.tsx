import React, { createContext, useContext, useMemo } from 'react';

interface AIContextValue {
  enabled: boolean;
  model: string;
}

const AIContext = createContext<AIContextValue>({
  enabled: false,
  model: 'claude-sonnet-3.5',
});

export function useAI() {
  return useContext(AIContext);
}

interface AIProviderProps {
  children: React.ReactNode;
  modelOverride?: string;
  enabledOverride?: boolean;
}

export function AIProvider({ children, modelOverride, enabledOverride }: AIProviderProps) {
  const viteModel = import.meta.env.VITE_AI_MODEL || 'claude-sonnet-3.5';
  const viteEnabled = import.meta.env.VITE_AI_ENABLED === 'true';

  const value = useMemo(() => ({
    enabled: enabledOverride ?? viteEnabled,
    model: modelOverride ?? viteModel,
  }), [modelOverride, enabledOverride, viteModel, viteEnabled]);

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export default AIProvider;
