import { useEffect, useMemo, useRef, useState } from "react";
import { slug, validateTopic, type UploadTopicContent } from "../../contentValidation";
import { GROUPS } from "../../topics";
import { customTopicId, deleteCustomTopic, setTopicIsNew, uploadTopic, useCustomTopics } from "../customTopics";
import Tabs from "../Tabs";

// "Variables C#" and "C# Variables" are the same words in another order: same token set
// → almost surely the same topic typed differently (would create a duplicate)
const tokenKey = (name: string) => slug(name).split("-").filter(Boolean).sort().join("|");

type Props = {
    onClose: () => void;
};

type Tab = "json" | "detalles" | "subidos";

// Example the "📄 Plantilla" button downloads: a full valid skeleton (5 categories ×
// 5 levels × 2 questions) with placeholder texts that pass the validator, ready to edit.
function buildTemplate(): UploadTopicContent {
    const categories: UploadTopicContent["categories"] = {};
    for (let c = 1; c <= 5; c++) {
        categories[`Categoría ${c}`] = Array.from({ length: 5 }, (_, level) =>
            Array.from({ length: 2 }, (_, i) => ({
                question: `Edítame: pregunta ${i + 1} del nivel ${level + 1} (categoría ${c})`,
                answer: `Respuesta correcta ${c}-${level + 1}-${i + 1}`,
                wrong: [`Opción incorrecta A ${c}${level}${i}`, `Opción incorrecta B ${c}${level}${i}`, `Opción incorrecta C ${c}${level}${i}`],
            }))
        );
    }
    return { name: "Mi Tema Nuevo", tagline: "Describe tu tema en una línea", group: "coding", categories };
}

function downloadTemplate() {
    const blob = new Blob([JSON.stringify(buildTemplate(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-tema.json";
    a.click();
    URL.revokeObjectURL(url);
}

// 📥 Subir tema (JSON) as a fixed-height, tabbed wizard (no page scroll): 1·JSON (paste or
// pick, validated live with the seed's validator) → 2·Detalles (group, name, ✨) → Subir,
// which lands on 📚 Subidos (toggle ✨ / delete). Rules only accept shape-valid `custom-`
// docs, so there is no permission dance anywhere.
export default function UploadTopicModal({ onClose }: Props) {
    const [tab, setTab] = useState<Tab>("json");
    const [raw, setRaw] = useState("");
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
    const [group, setGroup] = useState(GROUPS[0].id);
    const [isNew, setIsNew] = useState(true);
    const [busy, setBusy] = useState(false);
    const [note, setNote] = useState("");
    const uploaded = useCustomTopics();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        addEventListener("keydown", onKey);
        return () => removeEventListener("keydown", onKey);
    }, [onClose]);

    // Live validation of whatever is pasted
    const { content, errors, count } = useMemo(() => {
        if (!raw.trim()) return { content: null, errors: [] as string[], count: 0 };
        try {
            const parsed = JSON.parse(raw) as UploadTopicContent;
            const errs = validateTopic(parsed, parsed.name ?? parsed.id ?? "tema");
            const n = Object.values(parsed.categories ?? {})
                .flat(2)
                .filter(Boolean).length;
            return { content: errs.length === 0 ? parsed : null, errors: errs, count: n };
        } catch (e) {
            return { content: null, errors: [`JSON inválido: ${e instanceof Error ? e.message : e}`], count: 0 };
        }
    }, [raw]);

    // The moment the JSON turns valid, move on to the details (paste → one less click)
    const wasValid = useRef(false);
    useEffect(() => {
        if (content !== null && !wasValid.current && tab === "json") setTab("detalles");
        wasValid.current = content !== null;
    }, [content, tab]);

    function applyJson(text: string) {
        setRaw(text);
        setNote("");
        try {
            const parsed = JSON.parse(text) as UploadTopicContent;
            if (parsed.name) setName(parsed.name);
            if (parsed.tagline) setTagline(parsed.tagline);
            if (parsed.group && GROUPS.some((g) => g.id === parsed.group)) setGroup(parsed.group);
        } catch {
            // the validator will say it
        }
    }

    async function pickFile(file: File | undefined) {
        if (!file) return;
        applyJson(await file.text());
    }

    async function upload() {
        if (!content || !name.trim() || busy) return;
        setBusy(true);
        setNote("");
        try {
            const result = await uploadTopic(content, { name: name.trim(), tagline: tagline.trim(), group, isNew });
            setNote(`✅ "${name.trim()}" subido con ${result.count} preguntas — ya está en su categoría`);
            setRaw("");
            setTab("subidos");
        } catch (e) {
            console.error("Upload failed", e);
            setNote("❌ No se pudo subir. Revisa la conexión (y que las reglas nuevas estén desplegadas).");
        } finally {
            setBusy(false);
        }
    }

    function startOver() {
        setRaw("");
        setName("");
        setTagline("");
        setNote("");
        setTab("json");
    }

    const input = "bg-white text-black rounded-lg px-3 py-2 w-full";
    const ready = content !== null && name.trim().length > 0;
    const categoryNames = content ? Object.keys(content.categories) : [];

    // Same id the upload will use (the JSON's id wins over the typed name, like uploadTopic)
    const targetId = content && name.trim() ? customTopicId(content.id || name.trim()) : null;
    const replaces = targetId !== null ? (uploaded.find((t) => t.id === targetId) ?? null) : null;
    // Same words in a different order/casing but another id: about to create a duplicate
    const lookalike =
        targetId !== null && replaces === null && name.trim()
            ? (uploaded.find((t) => t.id !== targetId && tokenKey(t.name) === tokenKey(name)) ?? null)
            : null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
            {/* Fixed height, internal layout: header + tabs + panel + footer — the modal never scrolls */}
            <div
                className="bg-[#2a3698] text-white w-full max-w-3xl h-[min(40rem,92dvh)] rounded-xl p-5 text-left shadow-2xl flex flex-col gap-3"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="shrink-0 flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold">📥 Subir tema</h2>
                    <Tabs
                        label="Pasos para subir un tema"
                        items={[
                            { value: "json" as const, label: "1 · JSON", done: content !== null },
                            { value: "detalles" as const, label: "2 · Detalles", done: ready && tab !== "detalles", disabled: content === null },
                            { value: "subidos" as const, label: `📚 Subidos (${uploaded.length})` },
                        ]}
                        value={tab}
                        onChange={(t) => setTab(t)}
                    />
                    <button type="button" onClick={onClose} className="text-2xl opacity-70 hover:opacity-100 cursor-pointer" aria-label="Cerrar">
                        ✕
                    </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col gap-3">
                    {tab === "json" && (
                        <>
                            <div className="shrink-0 flex flex-wrap items-center gap-3">
                                <label className="bg-white text-[#2a3698] font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-yellow-300">
                                    📂 Elegir archivo…
                                    <input type="file" accept=".json,application/json" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
                                </label>
                                <span className="opacity-70 text-sm">o pega el JSON abajo</span>
                                <button type="button" className="ml-auto underline opacity-80 hover:opacity-100 cursor-pointer text-sm" onClick={downloadTemplate}>
                                    📄 Descargar plantilla
                                </button>
                            </div>
                            <textarea
                                value={raw}
                                onChange={(e) => applyJson(e.target.value)}
                                placeholder={'{ "name": "Mi Tema", "categories": { … } }\n\nFormato: 5 categorías × 5 niveles × mínimo 2 preguntas.\nCada pregunta: { question, answer, wrong[3], code? }'}
                                spellCheck={false}
                                className={`min-h-0 w-full bg-black/30 border rounded-lg p-3 font-mono text-xs text-white ${
                                    raw.trim() && errors.length > 0 ? "flex-[1] border-red-400/60" : "flex-1 border-white/20"
                                }`}
                            />
                            {raw.trim() && errors.length > 0 && (
                                <div className="flex-[1] min-h-0 overflow-y-auto bg-red-900/50 border border-red-400/50 rounded-lg p-3 text-sm">
                                    <p className="font-bold mb-1">
                                        {errors.length} problema{errors.length === 1 ? "" : "s"} por corregir:
                                    </p>
                                    <ul className="list-disc ml-5 space-y-0.5">
                                        {errors.map((e, i) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}

                    {tab === "detalles" && content && (
                        <>
                            <p className="shrink-0 text-green-300 font-bold">
                                ✓ JSON válido: {count} preguntas · {categoryNames.length} categorías
                            </p>
                            <p className="shrink-0 text-sm opacity-75 -mt-2">{categoryNames.join(" · ")}</p>
                            {replaces && (
                                <p className="shrink-0 bg-yellow-300 text-black font-bold rounded-lg px-3 py-2 text-sm">
                                    ⚠️ Ya existe <b>{replaces.name}</b>: al subir se <u>reemplazará</u> con estas {count} preguntas (no se duplica).
                                </p>
                            )}
                            {lookalike && (
                                <p className="shrink-0 bg-orange-500/90 text-black font-bold rounded-lg px-3 py-2 text-sm">
                                    🤔 Ya tienes <b>{lookalike.name}</b>, muy parecido. Con este nombre se creará un tema <u>NUEVO</u> (quedarían los dos).
                                    {" "}
                                    <button type="button" className="underline cursor-pointer" onClick={() => setName(lookalike.name)}>
                                        Usar "{lookalike.name}" y reemplazarlo
                                    </button>
                                </p>
                            )}
                            <div className="grid sm:grid-cols-2 gap-3 content-start flex-1 min-h-0">
                                <label className="flex flex-col gap-1 text-sm">
                                    Nombre del tema (la tarjeta)
                                    <input className={input} maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="Mi Tema" autoFocus />
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    Descripción corta
                                    <input className={input} maxLength={120} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="De qué va el tema" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    Categoría (grupo donde aparece)
                                    <select className={input} value={group} onChange={(e) => setGroup(e.target.value)}>
                                        {GROUPS.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label
                                    className={`flex items-center gap-3 rounded-lg px-3 mt-5 py-2 cursor-pointer border-2 ${
                                        isNew ? "bg-yellow-300 text-black border-black font-bold" : "bg-white/10 border-white/20"
                                    }`}
                                >
                                    <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="w-5 h-5" />
                                    ✨ Marcar como Nuevo
                                </label>
                            </div>
                        </>
                    )}

                    {tab === "subidos" &&
                        (uploaded.length === 0 ? (
                            <p className="opacity-70">Todavía no has subido temas. Empieza en la pestaña 1 · JSON.</p>
                        ) : (
                            <ul className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
                                {uploaded.map((t) => (
                                    <li key={t.id} className="flex items-center justify-between gap-3 bg-white/10 rounded-lg px-3 py-2 text-sm">
                                        <span className="min-w-0">
                                            <b>{t.name}</b> <span className="opacity-70">· {GROUPS.find((g) => g.id === t.group)?.name ?? t.group}</span>
                                            {t.tagline && <span className="block text-xs opacity-60 truncate">{t.tagline}</span>}
                                        </span>
                                        <span className="flex items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setTopicIsNew(t.id, !t.isNew).catch(() => alert("No se pudo cambiar. Revisa la conexión."))}
                                                title="Prende o apaga la insignia ✨ Nuevo"
                                                className={`px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer ${
                                                    t.isNew ? "bg-yellow-300 text-black" : "bg-white/20 hover:bg-white/30"
                                                }`}
                                            >
                                                ✨ {t.isNew ? "Nuevo" : "normal"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    confirm(`¿Borrar "${t.name}" y todas sus preguntas?`) &&
                                                    deleteCustomTopic(t.id).catch(() => alert("No se pudo borrar. Revisa la conexión."))
                                                }
                                                className="opacity-70 hover:opacity-100 cursor-pointer"
                                                aria-label={`Borrar ${t.name}`}
                                            >
                                                🗑
                                            </button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ))}
                </div>

                {/* One contextual main action per tab, always visible */}
                <div className="shrink-0 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
                    <p className="text-sm text-yellow-300 min-h-5 flex-1">{note}</p>
                    {tab === "json" && (
                        <button
                            type="button"
                            disabled={content === null}
                            onClick={() => setTab("detalles")}
                            className="bg-white text-[#2a3698] font-bold text-xl px-6 py-2 rounded-lg cursor-pointer hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continuar →
                        </button>
                    )}
                    {tab === "detalles" && (
                        <button
                            type="button"
                            disabled={!ready || busy}
                            onClick={upload}
                            className="bg-yellow-300 text-black font-bold text-xl px-6 py-2 rounded-lg cursor-pointer hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {busy ? "Subiendo…" : replaces ? "🔁 Reemplazar tema" : "⬆ Subir tema"}
                        </button>
                    )}
                    {tab === "subidos" && (
                        <button
                            type="button"
                            onClick={startOver}
                            className="bg-white text-[#2a3698] font-bold text-xl px-6 py-2 rounded-lg cursor-pointer hover:bg-yellow-300"
                        >
                            ➕ Subir otro tema
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
