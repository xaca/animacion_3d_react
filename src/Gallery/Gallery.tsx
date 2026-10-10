import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import products from "../data/products.json";

type Product = (typeof products)[number];

// Helper to create a texture from canvas
function createCardTexture(product: Product) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 768; // vertical card
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture();

    // Background
    ctx.fillStyle = "#f5f2e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Inner border
    ctx.strokeStyle = "#4a5d23";
    ctx.lineWidth = 12;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    // Subtle dotted background effect
    ctx.fillStyle = "#c0c0c0";
    for (let x = 0; x < canvas.width; x += 40) {
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Emoji Box
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 150, 100, 300, 300, 40);
    ctx.fill();
    ctx.shadowColor = "transparent";

    // Emoji
    ctx.font = "160px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(product.emoji, canvas.width / 2, 250 + 10);

    // Title
    ctx.font = "bold 52px Georgia, serif";
    ctx.fillStyle = "#1f2a0f";
    ctx.fillText(product.name, canvas.width / 2, 500);

    // Grade
    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#4a5d23";
    ctx.fillText("CEREMONIAL GRADE", canvas.width / 2, 560);

    // Price
    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = "#2e3d16";
    ctx.fillText(`${product.price.toFixed(2)}€`, canvas.width / 2, 650);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    return texture;
}

export default function Gallery() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);

    // Store active product in a ref to use inside the Three.js event listener without stale closures
    const activeProductRef = useRef<Product | null>(null);
    activeProductRef.current = activeProduct;

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#1f2a0f");
        scene.fog = new THREE.FogExp2("#1f2a0f", 0.04);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.set(0, 0, 0); // Camera in the center

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Lower ambient for dramatic contrast
        scene.add(ambientLight);

        // Dramatic Spotlight aiming at the front-center cards
        const spotLight = new THREE.SpotLight(0xfff5e6, 80); // Warm spotlight
        spotLight.position.set(0, 8, 3); // Positioned above and slightly behind the camera
        spotLight.target.position.set(0, 0, -6); // Aiming directly at the cards in front of the camera
        spotLight.angle = Math.PI / 4.5; // Spread angle
        spotLight.penumbra = 0.8; // Soft feathered edges
        spotLight.decay = 1.5; // Realistic light falloff
        spotLight.distance = 40;
        scene.add(spotLight);
        scene.add(spotLight.target);

        // Subtle matcha-green rim/fill light from below
        const fillLight = new THREE.DirectionalLight(0x4a5d23, 0.6);
        fillLight.position.set(0, -10, 0);
        scene.add(fillLight);

        // Group to hold all cards
        const carouselGroup = new THREE.Group();
        scene.add(carouselGroup);

        // Layout state
        let currentLayout = window.innerWidth > 768 ? "desktop" : "tablet";

        // Create Cards
        const totalCards = products.length;
        const meshes: THREE.Mesh[] = [];

        products.forEach((product) => {
            const texture = createCardTexture(product);
            const geometry = new THREE.PlaneGeometry(2, 3);
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                side: THREE.DoubleSide,
                roughness: 0.2,
                metalness: 0.1,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { 
                product, 
                baseScale: 1,
                targetPosition: new THREE.Vector3(),
                targetRotation: new THREE.Euler()
            };
            meshes.push(mesh);
            carouselGroup.add(mesh);
        });

        const updateLayoutTargets = () => {
            const isDesktop = currentLayout === "desktop";
            const radius = 6;
            
            meshes.forEach((mesh, i) => {
                if (isDesktop) {
                    // Circular desktop layout
                    const angle = (i / totalCards) * Math.PI * 2;
                    mesh.userData.targetPosition.set(
                        Math.sin(angle) * radius,
                        0,
                        Math.cos(angle) * radius
                    );
                    mesh.userData.targetRotation.set(0, angle + Math.PI, 0);
                } else {
                    // Runner path layout (Tablet/Mobile)
                    const xOffset = (i % 2 === 0 ? -1.2 : 1.2);
                    const zOffset = - (i * 3.5) - 6; // Stretch along the Z axis
                    mesh.userData.targetPosition.set(xOffset, 0, zOffset);
                    mesh.userData.targetRotation.set(0, 0, 0); // Face camera directly
                }
            });
        };

        // Initialize targets and snap meshes to them immediately
        updateLayoutTargets();
        meshes.forEach(mesh => {
            mesh.position.copy(mesh.userData.targetPosition);
            mesh.rotation.copy(mesh.userData.targetRotation);
        });

        // Interaction setup
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredMesh: THREE.Mesh | null = null;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let isPointerDown = false;
        let isDragging = false;
        let pointerDownX = 0;
        let pointerDownY = 0;
        let groupRotationAtPointerDown = 0;
        let groupZAtPointerDown = 0;

        const onPointerMove = (e: PointerEvent) => {
            // Normalized device coordinates
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            if (isPointerDown) {
                const deltaX = e.clientX - pointerDownX;
                const deltaY = e.clientY - pointerDownY;

                // If user moves mouse more than 5px, it's a drag
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    isDragging = true;
                }

                if (currentLayout === "desktop") {
                    carouselGroup.rotation.y = groupRotationAtPointerDown + deltaX * 0.01;
                } else {
                    // Runner path layout: drag vertically to move forward/backward
                    let newZ = groupZAtPointerDown + deltaY * 0.02;
                    const maxZ = totalCards * 3.5;
                    newZ = THREE.MathUtils.clamp(newZ, 0, maxZ);
                    carouselGroup.position.z = newZ;
                }
            } else {
                // Parallax effect on camera
                targetRotationX = mouse.y * 0.1;
                targetRotationY = mouse.x * -0.1;
            }
        };

        const onPointerDown = (e: PointerEvent) => {
            isPointerDown = true;
            isDragging = false;
            pointerDownX = e.clientX;
            pointerDownY = e.clientY;
            groupRotationAtPointerDown = carouselGroup.rotation.y;
            groupZAtPointerDown = carouselGroup.position.z;
        };

        const onPointerUp = () => {
            isPointerDown = false;
        };

        const onClick = () => {
            // Prevent click if user was dragging the carousel
            if (isDragging) return;

            // Check Raycaster intersection
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object as THREE.Mesh;
                const product = clickedMesh.userData.product as Product;

                // Toggle active product
                if (activeProductRef.current?.id === product.id) {
                    setActiveProduct(null);
                } else {
                    setActiveProduct(product);
                }
            } else {
                setActiveProduct(null);
            }
        };

        // Attach events
        const container = mountRef.current;
        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointerup", onPointerUp);
        container.addEventListener("click", onClick);

        // Resize handler
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Check if we crossed the layout breakpoint
            const newLayout = window.innerWidth > 768 ? "desktop" : "tablet";
            if (newLayout !== currentLayout) {
                currentLayout = newLayout;
                updateLayoutTargets();
                
                // Reset the group transforms, we will lerp individual meshes to their new layout positions
                carouselGroup.rotation.y = 0;
                carouselGroup.position.set(0, 0, 0);
            }
        };
        window.addEventListener("resize", onResize);

        // Animation Loop
        const clock = new THREE.Clock();
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const delta = clock.getDelta();

            // Auto-rotate if not dragging and no active product (only in desktop)
            if (!isPointerDown && !activeProductRef.current) {
                if (currentLayout === "desktop") {
                    carouselGroup.rotation.y += delta * 0.15;
                }
            }

            // Smooth camera parallax
            camera.rotation.x += (targetRotationX - camera.rotation.x) * 5 * delta;
            camera.rotation.y += (targetRotationY - camera.rotation.y) * 5 * delta;

            // Handle hover scaling
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(meshes);

            if (intersects.length > 0 && !isPointerDown && !activeProductRef.current) {
                document.body.style.cursor = "pointer";
                const first = intersects[0].object as THREE.Mesh;
                if (hoveredMesh !== first) {
                    hoveredMesh = first;
                }
            } else {
                document.body.style.cursor = "default";
                hoveredMesh = null;
            }

            // Update meshes based on layout and interaction states
            meshes.forEach((mesh) => {
                // Smooth layout transition (Lerp to target position and rotation)
                mesh.position.lerp(mesh.userData.targetPosition, 5 * delta);
                
                const currentQuat = new THREE.Quaternion().setFromEuler(mesh.rotation);
                const targetQuat = new THREE.Quaternion().setFromEuler(mesh.userData.targetRotation);
                currentQuat.slerp(targetQuat, 5 * delta);
                mesh.rotation.setFromQuaternion(currentQuat);

                const isHovered = mesh === hoveredMesh;
                const isActive = activeProductRef.current?.id === mesh.userData.product.id;

                let targetScale = 1.0;
                if (isActive) targetScale = 1.2;
                else if (isHovered) targetScale = 1.1;

                mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 10 * delta);

                // Emissive highlight on hover/active
                const material = mesh.material as THREE.MeshStandardMaterial;
                if (isActive) {
                    material.emissive.setHex(0x4a5d23);
                    material.emissiveIntensity = 0.5;
                } else if (isHovered) {
                    material.emissive.setHex(0x2e3d16);
                    material.emissiveIntensity = 0.3;
                } else {
                    material.emissive.setHex(0x000000);
                    material.emissiveIntensity = 0;
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            container.removeEventListener("pointermove", onPointerMove);
            container.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", onPointerUp);
            container.removeEventListener("click", onClick);
            window.removeEventListener("resize", onResize);
            document.body.style.cursor = "default";

            cancelAnimationFrame(animationFrameId);

            if (container) {
                container.removeChild(renderer.domElement);
            }

            // Clean up Three.js resources
            meshes.forEach(mesh => {
                mesh.geometry.dispose();
                (mesh.material as THREE.Material).dispose();
            });
            renderer.dispose();
            scene.clear();
        };
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#1f2a0f]">
            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="absolute inset-0 z-0 touch-none" />

            {/* UI Overlay / Header */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none">
                <h1 className="text-3xl sm:text-4xl font-serif text-[#e8e4d4] drop-shadow-lg text-center tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>
                    Matcha 3D Gallery
                </h1>
                <p className="text-center text-[#b8d47b] mt-2 text-xs sm:text-sm tracking-widest uppercase font-semibold">
                    Drag to rotate • Click to view
                </p>
            </div>

            {/* Active Product Glassmorphism Modal */}
            {activeProduct && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-4">
                    <div className="pointer-events-auto bg-[#263413]/85 backdrop-blur-2xl border border-white/25 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_70px_rgba(0,0,0,0.7)] transform transition-all duration-500 scale-100 opacity-100 flex flex-col gap-5">
                        <div className="flex justify-between items-start">
                            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[11px] font-bold text-[#d4e8a8] uppercase tracking-wider">
                                Blend No. 0{activeProduct.id}
                            </span>
                            <button
                                onClick={() => setActiveProduct(null)}
                                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex gap-5 items-center">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-5xl sm:text-6xl shadow-inner shrink-0">
                                {activeProduct.emoji}
                            </div>
                            <div className="flex flex-col text-left">
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f5f2e9] leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                                    {activeProduct.name}
                                </h2>
                                <span className="text-[11px] sm:text-xs font-semibold text-[#b8d47b] mt-1.5 tracking-wide">
                                    CEREMONIAL GRADE
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-white/80 leading-relaxed pt-2 border-t border-white/15 text-left">
                            {activeProduct.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl sm:text-2xl font-bold text-white">
                                    {activeProduct.price.toFixed(2)}€
                                </span>
                                <span className="text-xs text-white/60">/ 50g</span>
                            </div>
                            <button className="px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer">
                                <span>Add to Cart</span>
                                <span>🛒</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}