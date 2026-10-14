import { useLayoutEffect, useRef } from "react";

// Shrinks the font size (from `max` px down to `min`) until the content fits the
// element's box, so the host question screen never needs a scrollbar. The element
// needs a bounded size (flex/grid child with overflow-hidden). Reruns on window
// resize and whenever `deps` change (e.g. the question text).
export function useFitText<T extends HTMLElement>(max: number, min: number, deps: unknown[]) {
    const ref = useRef<T>(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const fit = () => {
            let size = max;
            el.style.fontSize = `${size}px`;
            while (size > min && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)) {
                size -= 2;
                el.style.fontSize = `${size}px`;
            }
        };
        fit();
        addEventListener("resize", fit);
        return () => removeEventListener("resize", fit);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-provided deps
    }, deps);
    return ref;
}
