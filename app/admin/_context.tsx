'use client';

// Shared context and hooks for the admin shell.
// Extracted from layout.tsx so that layout only exports `default` —
// Next.js 15 rejects any named export from a layout file that isn't
// a recognised segment config (metadata, viewport, etc.).

import { createContext, useContext } from 'react';

// ── Auth context ──────────────────────────────────────────────────────────────
export interface AuthCtx { token: string; setToken: (t: string) => void }
export const AuthContext = createContext<AuthCtx>({ token: '', setToken: () => {} });
export function useAuth() { return useContext(AuthContext); }

// ── Toast context ─────────────────────────────────────────────────────────────
export interface ToastCtx { flash: (msg: string, type?: 'success' | 'error' | 'info') => void }
export const ToastContext = createContext<ToastCtx>({ flash: () => {} });
export function useToast() { return useContext(ToastContext); }
