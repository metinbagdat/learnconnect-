import React, { createContext, useContext, useMemo } from 'react';

// AIContext exposes whether AI features are enabled and which model to use.
// This file supports both Vite (import.meta.env.VITE_*) and CRA-style
// (process.env.REACT_APP_*) environment variables for portability.
const AIContext = createContext({
  enabled: false,
  model: null,
});

export function useAI() {
  return useContext(AIContext);
}

export function AIProvider({ children, modelOverride, enabledOverride }) {
  // Prefer Vite env vars when available (VITE_*). Fallback to CRA-style REACT_APP_*.
  const viteModel = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_AI_MODEL;
  const viteEnabled = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_AI_ENABLED;

  const envModel = viteModel || process.env.REACT_APP_AI_MODEL || 'claude-sonnet-3.5';
  const envEnabled = (viteEnabled === 'true') || ((process.env.REACT_APP_AI_ENABLED || 'false') === 'true');

  const value = useMemo(() => ({
    enabled: enabledOverride ?? envEnabled,
    model: modelOverride ?? envModel,
  }), [modelOverride, enabledOverride, envModel, envEnabled]);

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export default AIProvider;
