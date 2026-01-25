"use client";

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { CustomLoginType, CustomApiProvider, VaultStorage } from "@/lib/types/account";
import { STORAGE_KEY } from "@/lib/types/account";

// State shape
interface CustomTypesState {
  loginTypes: CustomLoginType[];
  apiProviders: CustomApiProvider[];
}

// Action types
type CustomTypesAction =
  | { type: "ADD_LOGIN_TYPE"; payload: CustomLoginType }
  | { type: "UPDATE_LOGIN_TYPE"; payload: { id: string; data: Partial<Pick<CustomLoginType, "label" | "color">> } }
  | { type: "DELETE_LOGIN_TYPE"; payload: string }
  | { type: "ADD_API_PROVIDER"; payload: CustomApiProvider }
  | { type: "UPDATE_API_PROVIDER"; payload: { id: string; data: Partial<Pick<CustomApiProvider, "label" | "color">> } }
  | { type: "DELETE_API_PROVIDER"; payload: string }
  | { type: "IMPORT"; payload: { loginTypes: CustomLoginType[]; apiProviders: CustomApiProvider[] } };

// Reducer
function customTypesReducer(state: CustomTypesState, action: CustomTypesAction): CustomTypesState {
  switch (action.type) {
    case "ADD_LOGIN_TYPE":
      return { ...state, loginTypes: [...state.loginTypes, action.payload] };
    case "UPDATE_LOGIN_TYPE":
      return {
        ...state,
        loginTypes: state.loginTypes.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      };
    case "DELETE_LOGIN_TYPE":
      return { ...state, loginTypes: state.loginTypes.filter((t) => t.id !== action.payload) };
    case "ADD_API_PROVIDER":
      return { ...state, apiProviders: [...state.apiProviders, action.payload] };
    case "UPDATE_API_PROVIDER":
      return {
        ...state,
        apiProviders: state.apiProviders.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };
    case "DELETE_API_PROVIDER":
      return { ...state, apiProviders: state.apiProviders.filter((p) => p.id !== action.payload) };
    case "IMPORT":
      return { loginTypes: action.payload.loginTypes, apiProviders: action.payload.apiProviders };
    default:
      return state;
  }
}

// Load initial state from localStorage
function loadInitialState(): CustomTypesState {
  if (typeof window === "undefined") {
    return { loginTypes: [], apiProviders: [] };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data: VaultStorage = JSON.parse(stored);
      return {
        loginTypes: data.customLoginTypes || [],
        apiProviders: data.customApiProviders || [],
      };
    } catch {
      return { loginTypes: [], apiProviders: [] };
    }
  }
  return { loginTypes: [], apiProviders: [] };
}

// Persist to localStorage
function persistState(state: CustomTypesState) {
  const stored = localStorage.getItem(STORAGE_KEY);
  let existingData: VaultStorage = { version: 2, accounts: [] };

  if (stored) {
    try {
      existingData = JSON.parse(stored);
    } catch {
      // Use defaults
    }
  }

  const data: VaultStorage = {
    ...existingData,
    version: 2,
    customLoginTypes: state.loginTypes,
    customApiProviders: state.apiProviders,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Context for state
const CustomTypesStateContext = createContext<CustomTypesState | null>(null);

// Context for actions (dispatch wrapper)
interface CustomTypesActions {
  addLoginType: (label: string, color: string) => CustomLoginType;
  updateLoginType: (id: string, data: Partial<Pick<CustomLoginType, "label" | "color">>) => void;
  deleteLoginType: (id: string) => void;
  addApiProvider: (label: string, color: string) => CustomApiProvider;
  updateApiProvider: (id: string, data: Partial<Pick<CustomApiProvider, "label" | "color">>) => void;
  deleteApiProvider: (id: string) => void;
  importCustomTypes: (loginTypes: CustomLoginType[], apiProviders: CustomApiProvider[]) => void;
}

const CustomTypesActionsContext = createContext<CustomTypesActions | null>(null);

// Provider component
export function CustomTypesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customTypesReducer, null, loadInitialState);

  // Persist on every state change
  const dispatchAndPersist = useCallback((action: CustomTypesAction) => {
    dispatch(action);
  }, []);

  // Wrap dispatch in stable action functions
  const actions: CustomTypesActions = {
    addLoginType: useCallback((label: string, color: string) => {
      const newType: CustomLoginType = {
        id: `custom-login-${crypto.randomUUID()}`,
        label,
        color,
        createdAt: Date.now(),
      };
      dispatchAndPersist({ type: "ADD_LOGIN_TYPE", payload: newType });
      // Persist immediately
      const newState = {
        loginTypes: [...loadInitialState().loginTypes, newType],
        apiProviders: loadInitialState().apiProviders
      };
      persistState(newState);
      return newType;
    }, [dispatchAndPersist]),

    updateLoginType: useCallback((id: string, data) => {
      dispatchAndPersist({ type: "UPDATE_LOGIN_TYPE", payload: { id, data } });
      const current = loadInitialState();
      persistState({
        loginTypes: current.loginTypes.map((t) => (t.id === id ? { ...t, ...data } : t)),
        apiProviders: current.apiProviders,
      });
    }, [dispatchAndPersist]),

    deleteLoginType: useCallback((id: string) => {
      dispatchAndPersist({ type: "DELETE_LOGIN_TYPE", payload: id });
      const current = loadInitialState();
      persistState({
        loginTypes: current.loginTypes.filter((t) => t.id !== id),
        apiProviders: current.apiProviders,
      });
    }, [dispatchAndPersist]),

    addApiProvider: useCallback((label: string, color: string) => {
      const newProvider: CustomApiProvider = {
        id: `custom-api-${crypto.randomUUID()}`,
        label,
        color,
        createdAt: Date.now(),
      };
      dispatchAndPersist({ type: "ADD_API_PROVIDER", payload: newProvider });
      const current = loadInitialState();
      persistState({
        loginTypes: current.loginTypes,
        apiProviders: [...current.apiProviders, newProvider],
      });
      return newProvider;
    }, [dispatchAndPersist]),

    updateApiProvider: useCallback((id: string, data) => {
      dispatchAndPersist({ type: "UPDATE_API_PROVIDER", payload: { id, data } });
      const current = loadInitialState();
      persistState({
        loginTypes: current.loginTypes,
        apiProviders: current.apiProviders.map((p) => (p.id === id ? { ...p, ...data } : p)),
      });
    }, [dispatchAndPersist]),

    deleteApiProvider: useCallback((id: string) => {
      dispatchAndPersist({ type: "DELETE_API_PROVIDER", payload: id });
      const current = loadInitialState();
      persistState({
        loginTypes: current.loginTypes,
        apiProviders: current.apiProviders.filter((p) => p.id !== id),
      });
    }, [dispatchAndPersist]),

    importCustomTypes: useCallback((loginTypes, apiProviders) => {
      dispatchAndPersist({ type: "IMPORT", payload: { loginTypes, apiProviders } });
      persistState({ loginTypes, apiProviders });
    }, [dispatchAndPersist]),
  };

  return (
    <CustomTypesStateContext value={state}>
      <CustomTypesActionsContext value={actions}>
        {children}
      </CustomTypesActionsContext>
    </CustomTypesStateContext>
  );
}

// Custom hooks for consuming context
export function useCustomTypesState() {
  const context = useContext(CustomTypesStateContext);
  if (!context) {
    throw new Error("useCustomTypesState must be used within CustomTypesProvider");
  }
  return context;
}

export function useCustomTypesActions() {
  const context = useContext(CustomTypesActionsContext);
  if (!context) {
    throw new Error("useCustomTypesActions must be used within CustomTypesProvider");
  }
  return context;
}

// Combined hook for convenience
export function useCustomTypes() {
  return {
    ...useCustomTypesState(),
    ...useCustomTypesActions(),
  };
}
