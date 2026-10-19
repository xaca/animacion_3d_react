import gsap from "gsap";
import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { MOTION } from "./panelMode";

export type TabItem<T> = { value: T; label: ReactNode; done?: boolean; disabled?: boolean };

type Props<T> = {
    items: TabItem<T>[];
    value: T;
    onChange: (value: T) => void;
    label: string; // aria-label of the tab list
    idBase?: string; // set when the tabs control a panel: tab ids `${idBase}-tab-N`, panel `${idBase}-panel`
    big?: boolean;
};

// Segmented tabs in the spirit of shadcn's Tabs (no shadcn): a translucent pill track
// with a white indicator that slides behind the active tab. Used for the setup steps and
// as the segmented control for the time settings. ←/→/Home/End move between tabs.
export default function Tabs<T extends string | number>({ items, value, onChange, label, idBase, big }: Props<T>) {
    const list = useRef<HTMLDivElement>(null);
    const indicator = useRef<HTMLSpanElement>(null);
    const placed = useRef(false);
    const active = Math.max(0, items.findIndex((i) => i.value === value));

    // Slide the indicator to the active tab (placed without animation the first time)
    useLayoutEffect(() => {
        const move = (animate: boolean) => {
            const tab = list.current?.children[active + 1] as HTMLElement | undefined; // [0] is the indicator
            if (!tab || !indicator.current) return;
            const to = { x: tab.offsetLeft, width: tab.offsetWidth, height: tab.offsetHeight, y: tab.offsetTop };
            if (animate) gsap.to(indicator.current, { ...to, duration: 0.35 * MOTION, ease: "power3.inOut", overwrite: true });
            else gsap.set(indicator.current, to);
        };
        move(placed.current);
        placed.current = true;
        const onResize = () => move(false);
        addEventListener("resize", onResize);
        return () => removeEventListener("resize", onResize);
    }, [active, items.length]);

    function onKey(e: KeyboardEvent<HTMLDivElement>) {
        const last = items.length - 1;
        const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        // Walk in the pressed direction until an enabled tab is found
        const dir = next >= active ? 1 : -1;
        let i = (next + items.length) % items.length;
        for (let hops = 0; items[i].disabled && hops < items.length; hops++) i = (i + dir + items.length) % items.length;
        if (items[i].disabled) return;
        onChange(items[i].value);
        (list.current?.children[i + 1] as HTMLElement | undefined)?.focus();
    }

    return (
        <div
            ref={list}
            role="tablist"
            aria-label={label}
            onKeyDown={onKey}
            className="relative inline-flex flex-wrap justify-center gap-1 p-1 rounded-xl bg-white/10"
        >
            <span ref={indicator} aria-hidden className="absolute left-0 top-0 rounded-lg bg-white shadow-md pointer-events-none" />
            {items.map((item, i) => {
                const selected = i === active;
                return (
                    <button
                        key={String(item.value)}
                        type="button"
                        role="tab"
                        id={idBase ? `${idBase}-tab-${i}` : undefined}
                        aria-controls={idBase ? `${idBase}-panel` : undefined}
                        aria-selected={selected}
                        disabled={item.disabled}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => onChange(item.value)}
                        className={`relative z-10 flex items-center gap-2 rounded-lg font-bold transition-colors ${
                            big ? "px-5 py-2 text-xl" : "px-4 py-1.5 text-lg"
                        } ${
                            selected
                                ? "text-[#2a3698] cursor-pointer"
                                : item.disabled
                                  ? "text-white/25 cursor-not-allowed"
                                  : "text-white/80 cursor-pointer hover:text-white hover:bg-white/10"
                        }`}
                    >
                        {item.done !== undefined && <StepMark n={i + 1} done={item.done} selected={selected} />}
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}

// Step number in a circle; turns into a ✓ that pops in once the step is done
function StepMark({ n, done, selected }: { n: number; done: boolean; selected: boolean }) {
    return (
        <span
            className={`w-7 h-7 rounded-full grid place-items-center text-sm ${
                done ? "bg-yellow-300 text-black" : selected ? "bg-[#2a3698] text-white" : "bg-white/20"
            }`}
        >
            {done ? <Check /> : n}
        </span>
    );
}

function Check() {
    const el = useRef<HTMLSpanElement>(null);
    useLayoutEffect(() => {
        const tween = gsap.fromTo(
            el.current,
            { scale: 0.3, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.3 * MOTION, ease: "back.out(3)", clearProps: "transform,opacity,visibility" }
        );
        return () => {
            tween.kill();
        };
    }, []);
    return <span ref={el}>✓</span>;
}
