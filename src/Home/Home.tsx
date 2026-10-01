import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import products from "../data/products.json";

type Product = (typeof products)[number];

export default function Home() {
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const glassRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const priceRef = useRef<HTMLDivElement | null>(null);
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [activeItem, setActiveItem] = useState<Product | null>(null);
    const isOverModalRef = useRef(false);
    const closeTimerRef = useRef<number | null>(null);

    function closeModal() {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        isOverModalRef.current = false;
        setActiveProduct(null);
        tweenRef.current?.play();
    }

    function handleCardHover(product: Product) {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setActiveProduct(product);
        tweenRef.current?.pause();
    }

    function handleCardLeave() {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        closeTimerRef.current = window.setTimeout(() => {
            if (!isOverModalRef.current) {
                closeModal();
            }
        }, 120);
    }

    function handleModalEnter() {
        isOverModalRef.current = true;
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }

    function handleModalLeave() {
        isOverModalRef.current = false;
        closeModal();
    }

    // Close modal and resume carousel when clicking outside or leaving the window
    useEffect(() => {
        if (!activeProduct) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".product-modal-fixed") && !target.closest(".floating-card")) {
                closeModal();
            }
        };

        const handleWindowLeave = () => {
            closeModal();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mouseleave", handleWindowLeave);
        window.addEventListener("blur", handleWindowLeave);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mouseleave", handleWindowLeave);
            window.removeEventListener("blur", handleWindowLeave);
        };
    }, [activeProduct]);

    useEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
            const numCards = cards.length;
            const radiusX = 380;
            const radiusY = 90;
            const angleStep = (2 * Math.PI) / numCards;

            // Proxy object GSAP will tween — drives the whole carousel
            const state = { angle: 0 };

            /* ---- Entrance timeline ---- */
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Glass scales in
            tl.from(glassRef.current, {
                scale: 0.7,
                opacity: 0,
                y: 80,
                duration: 1,
            });

            // Cards pop in from center
            tl.from(
                cards,
                { scale: 0, opacity: 0, stagger: 0.06, duration: 0.5 },
                "-=0.5"
            );

            // Title slides up
            tl.from(
                titleRef.current,
                { y: 40, opacity: 0, duration: 0.6 },
                "-=0.3"
            );

            // Price badge fades in
            tl.from(
                priceRef.current,
                { scale: 0.8, opacity: 0, duration: 0.4 },
                "-=0.2"
            );

            /* ---- Continuous carousel rotation ---- */
            const tween = gsap.to(state, {
                angle: Math.PI * 2,
                duration: 22, // seconds per full orbit
                repeat: -1,
                ease: "none",
                onUpdate() {
                    cards.forEach((card, i) => {
                        const a = state.angle + i * angleStep;
                        const x = Math.sin(a) * radiusX;
                        const depth = Math.cos(a); // -1 (back) → 1 (front)
                        const depthNorm = (depth + 1) / 2; // 0 → 1
                        const y = -depth * radiusY; // back items float up
                        const scale = 0.5 + 0.5 * depthNorm;
                        const opacity = 0.3 + 0.7 * depthNorm;
                        const zIndex = Math.round(depthNorm * 20) + 5;
                        const tilt = Math.sin(a) * 18;

                        gsap.set(card, {
                            x,
                            y,
                            scale,
                            opacity,
                            zIndex,
                            rotation: tilt,
                        });
                    });
                },
            });

            tweenRef.current = tween;
        });

        return () => mm.revert();
    }, []);

    return (
        <>
            {/* ======= MOBILE & TABLET: Responsive Views with Desktop Matcha Styling ======= */}
            <div className="lg:hidden min-h-screen matcha-bg p-4 sm:p-6 md:p-8 flex flex-col gap-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                        <span className="text-[11px] font-bold tracking-widest text-[#b8d47b] uppercase">
                            Ceremonial Blends
                        </span>
                        <h1 className="matcha-title text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight">
                            Choose your matcha tea
                        </h1>
                    </div>
                    <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e8e4d4] shadow-sm shrink-0">
                        {products.length} Blends
                    </span>
                </div>

                {/* ===== MOBILE LAYOUT (< md): Simple Column Layout ===== */}
                <div className="flex flex-col gap-3.5 md:hidden">
                    {products.map((product) => {
                        const isOpen = activeItem?.id === product.id;
                        return (
                            <div
                                key={product.id}
                                onClick={() => setActiveItem(isOpen ? null : product)}
                                className={`rounded-2xl transition-all duration-300 cursor-pointer ${
                                    isOpen
                                        ? "bg-[#263413]/90 backdrop-blur-2xl border border-white/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/20"
                                        : "bg-white/95 border border-white/40 p-4 shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:bg-white hover:scale-[1.01]"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3.5">
                                        <span className="text-3xl sm:text-4xl filter drop-shadow-sm">
                                            {product.emoji}
                                        </span>
                                        <div>
                                            <span
                                                className={`font-semibold text-base block leading-tight ${
                                                    isOpen
                                                        ? "matcha-title text-lg text-[#f5f2e9]"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {product.name}
                                            </span>
                                            <span
                                                className={`text-[11px] font-medium ${
                                                    isOpen ? "text-[#b8d47b]" : "text-gray-500"
                                                }`}
                                            >
                                                Ceremonial Grade
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`font-bold text-sm px-2.5 py-1 rounded-full border ${
                                                isOpen
                                                    ? "bg-white/15 border-white/25 text-white"
                                                    : "bg-gray-100 border-gray-300 text-gray-900"
                                            }`}
                                        >
                                            {product.price.toFixed(2)}€
                                        </span>
                                        <span
                                            className={`text-xs transition-transform duration-200 ${
                                                isOpen
                                                    ? "rotate-180 text-white/80"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="mt-4 pt-3.5 border-t border-white/15 text-left">
                                        <p className="text-sm text-white/80 leading-relaxed mb-4">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#d4e8a8]">
                                                50g Airtight Tin
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white text-xs font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer"
                                            >
                                                <span>Add {product.price.toFixed(2)}€</span>
                                                <span>🛒</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ===== TABLET LAYOUT (md to < lg): Masonry Grid Layout ===== */}
                <div
                    className="
                        hidden md:grid md:grid-cols-4 [grid-auto-flow:dense]
                        gap-4 auto-rows-[145px]
                    "
                >
                    {products.map((product, index) => {
                        const isOpen = activeItem?.id === product.id;
                        // Organic masonry variations when not open: item index 3 and 7 span 2 cols
                        const isWide = !isOpen && (index === 3 || index === 7);

                        return (
                            <div
                                key={product.id}
                                onClick={() => setActiveItem(isOpen ? null : product)}
                                className={`
                                    rounded-2xl transition-all duration-300 cursor-pointer group
                                    ${
                                        isOpen
                                            ? "col-span-3 row-span-2 bg-[#263413]/90 backdrop-blur-2xl border border-white/30 p-6 flex flex-col justify-between shadow-[0_25px_70px_rgba(0,0,0,0.65)] ring-1 ring-white/25 z-10"
                                            : isWide
                                            ? "col-span-2 row-span-1 bg-white/95 border border-white/40 hover:bg-white hover:scale-[1.02] flex items-center justify-between px-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                                            : "col-span-1 row-span-1 bg-white/95 border border-white/40 hover:bg-white hover:scale-[1.03] flex flex-col items-center justify-center p-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                                    }
                                `}
                            >
                                {isOpen ? (
                                    /* Desktop-style Open state card */
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-[#d4e8a8]">
                                                    Blend No. 0{product.id}
                                                </span>
                                                <span className="text-xs font-semibold text-[#b8d47b]">
                                                    Ceremonial Grade
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveItem(null);
                                                }}
                                                aria-label="Close"
                                                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-5 my-2">
                                            <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-5xl shadow-inner shrink-0">
                                                {product.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <h2 className="matcha-title text-2xl font-bold text-[#f5f2e9] leading-tight">
                                                    {product.name}
                                                </h2>
                                                <p className="text-xs sm:text-sm text-white/75 mt-1.5 line-clamp-3 leading-relaxed">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/15">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-xl font-bold text-white">
                                                    {product.price.toFixed(2)}€
                                                </span>
                                                <span className="text-xs text-white/60">/ 50g tin</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="px-5 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                                            >
                                                <span>Add to Cart</span>
                                                <span>🛒</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : isWide ? (
                                    /* Wide 2-col card */
                                    <div className="flex items-center justify-between w-full h-full select-none">
                                        <div className="flex items-center gap-3.5">
                                            <span className="text-4xl transition-transform duration-200 group-hover:scale-110 filter drop-shadow-sm">
                                                {product.emoji}
                                            </span>
                                            <div className="text-left">
                                                <span className="text-sm font-bold text-gray-900 block truncate">
                                                    {product.name}
                                                </span>
                                                <span className="text-[11px] text-gray-500 font-medium">
                                                    Ceremonial blend
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-300 shadow-sm">
                                            {product.price.toFixed(2)}€
                                        </span>
                                    </div>
                                ) : (
                                    /* Compact 1x1 card */
                                    <div className="flex flex-col items-center justify-center text-center w-full h-full select-none">
                                        <span className="text-4xl transition-transform duration-200 group-hover:scale-110 filter drop-shadow-sm">
                                            {product.emoji}
                                        </span>
                                        <span className="text-xs font-bold text-gray-900 mt-2 truncate max-w-full">
                                            {product.name}
                                        </span>
                                        <span className="text-[11px] font-medium text-gray-500">
                                            {product.price.toFixed(2)}€
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ======= DESKTOP: Matcha Carousel Layout ======= */}
            <div className="hidden lg:flex matcha-bg min-h-screen flex-col items-center justify-center relative overflow-hidden">

                {/* Carousel orbit area */}
                <div
                    ref={carouselRef}
                    className="relative flex items-center justify-center"
                    style={{ width: 800, height: 420 }}
                >
                    {/* Floating ingredient cards — orbit around center */}
                    {products.map((product, i) => (
                        <div
                            key={product.id}
                            ref={(el) => {
                                cardsRef.current[i] = el;
                            }}
                            className={`floating-card absolute w-24 h-24 xl:w-28 xl:h-28 flex items-center justify-center cursor-pointer${activeProduct?.id === product.id ? " is-active" : ""}`}
                            style={{
                                left: "50%",
                                top: "50%",
                                marginLeft: -48,
                                marginTop: -48,
                            }}
                            onMouseEnter={() => handleCardHover(product)}
                            onMouseLeave={handleCardLeave}
                        >
                            <span className="text-4xl xl:text-5xl">
                                {product.emoji}
                            </span>
                        </div>
                    ))}

                    {/* Central glass container — always in front */}
                    {/*<div
                        ref={glassRef}
                        className="glass-container relative z-30 w-52 h-80 rounded-3xl flex flex-col items-center justify-center gap-3"
                    >                        
                        <div className="w-20 h-40 rounded-xl overflow-hidden relative">
                            <div className="absolute inset-0 top-0 h-1/2 bg-gradient-to-b from-[#6b8e3a] to-[#7fa042]" />
                            <div className="absolute inset-0 top-1/2 h-1/2 bg-gradient-to-b from-[#f0e8d0] to-[#e8dcc0]" />
                            <div className="absolute inset-0 left-0 w-1/3 bg-gradient-to-r from-white/20 to-transparent" />
                        </div>
                        <span className="text-white/80 text-sm font-medium tracking-wider uppercase">
                            Original
                        </span>
                    </div>*/}

                    {/* Product Info Modal rendered as fixed overlay — outside carousel so it clears overflow:hidden */}

                </div>

                {/* Price badge */}
                {/*<div
                    ref={priceRef}
                    className="price-badge mt-6 z-30 px-5 py-2.5 rounded-full flex items-center gap-3 cursor-pointer hover:bg-white/25 transition-colors"
                >
                    <span className="text-white/90 font-semibold text-lg">
                        {activeProduct ? `${activeProduct.price.toFixed(2)}€` : "19.33€"}
                    </span>
                    <span className="text-white/70 text-xl">🛒</span>
                </div>*/}

                {/* Title */}
                <h1
                    ref={titleRef}
                    className="matcha-title text-5xl xl:text-6xl mt-10 z-30 text-center leading-tight"
                >
                    Choose your matcha tea
                </h1>
            </div>

            {/* ======= Product Info Modal — fixed center, z-index 9999 ======= */}
            {activeProduct && (
                <div
                    className="product-modal-fixed"
                    onMouseEnter={handleModalEnter}
                    onMouseLeave={handleModalLeave}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {/* LEFT — large emoji panel */}
                    <div className="product-modal-left">
                        <span className="product-modal-emoji-lg">
                            {activeProduct.emoji}
                        </span>
                    </div>

                    {/* RIGHT — info */}
                    <div className="product-modal-right">
                        <div className="product-modal-name">
                            {activeProduct.name}
                        </div>
                        <div className="product-modal-desc">
                            {activeProduct.description}
                        </div>
                        <div className="product-modal-price">
                            <span>{activeProduct.price.toFixed(2)}€</span>
                            <span>🛒</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}