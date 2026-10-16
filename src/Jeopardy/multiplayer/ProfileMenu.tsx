import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MOTION } from "./panelMode";

// `on` set = a switch: shows an on/off pill next to the label
export type MenuItem = { label: string; onClick: () => void; danger?: boolean; separatorBefore?: boolean; on?: boolean };

// Host avatar in the top-right corner with the less common actions (cancel the room,
// log out), kept out of the main setup flow. Closes on outside click and Escape.
export default function ProfileMenu({ items }: { items: MenuItem[] }) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (!root.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        addEventListener("mousedown", onDown);
        addEventListener("keydown", onKey);
        return () => {
            removeEventListener("mousedown", onDown);
            removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Grows out of the avatar's corner
    useLayoutEffect(() => {
        if (!open || !panel.current) return;
        const tween = gsap.fromTo(
            panel.current,
            { scale: 0.9, autoAlpha: 0, transformOrigin: "top right" },
            { scale: 1, autoAlpha: 1, duration: 0.2 * MOTION, ease: "power2.out", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, [open]);

    return (
        <div ref={root} className="relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 pl-1 pr-3 py-1 cursor-pointer font-bold"
            >
                <span className="w-9 h-9 rounded-full bg-yellow-300 text-black grid place-items-center text-xl">👩‍🏫</span>
                Host <span className="text-sm opacity-70">▾</span>
            </button>
            {open && (
                <div
                    ref={panel}
                    role="menu"
                    className="absolute right-0 top-full mt-2 z-40 min-w-56 rounded-xl bg-white text-black shadow-2xl p-1 text-left"
                >
                    {items.map((item) => (
                        <div key={item.label}>
                            {item.separatorBefore && <div className="my-1 border-t border-black/10" />}
                            <button
                                type="button"
                                role={item.on === undefined ? "menuitem" : "menuitemcheckbox"}
                                aria-checked={item.on}
                                onClick={() => {
                                    setOpen(false);
                                    item.onClick();
                                }}
                                className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded-lg cursor-pointer hover:bg-black/5 ${
                                    item.danger ? "text-red-700" : "text-[#2a3698]"
                                }`}
                            >
                                {item.label}
                                {item.on !== undefined && (
                                    <span
                                        className={`text-xs font-bold rounded-full px-2 py-0.5 ${item.on ? "bg-yellow-300 text-black" : "bg-black/10 text-black/60"}`}
                                    >
                                        {item.on ? "ON" : "OFF"}
                                    </span>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
