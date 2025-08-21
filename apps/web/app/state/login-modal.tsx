"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Ctx = {
    open: boolean;
    openLogin: () => void;
    closeLogin: () => void;
};

const LoginModalCtx = createContext<Ctx | null>(null);

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const openLogin = useCallback(() => setOpen(true), []);
    const closeLogin = useCallback(() => setOpen(false), []);

    const value = useMemo(() => ({ open, openLogin, closeLogin }), [open, openLogin, closeLogin]);

    return <LoginModalCtx.Provider value={value}>{children}</LoginModalCtx.Provider>;
}

export function useLoginModal() {
    const ctx = useContext(LoginModalCtx);
    if (!ctx) throw new Error("useLoginModal deve ser usado dentro de <LoginModalProvider />");
    return ctx;
}

/** Portal que monta o `children` diretamente em document.body */
export function BodyPortal({ children }: { children: React.ReactNode }) {
    const elRef = useRef<HTMLElement | null>(null);
    if (!elRef.current && typeof document !== "undefined") {
        elRef.current = document.body as unknown as HTMLElement;
    }
    return elRef.current ? createPortal(children, elRef.current) : null;
}