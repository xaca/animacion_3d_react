import { useEffect, useMemo, useRef, useState } from "react";
import { MAX_UPLOAD_QUESTIONS, MIN_UPLOAD_QUESTIONS, parseUpload, slug, type UploadTopicContent } from "./contentValidation";
import { customTopicId, deleteCustomTopic, uploadTopic, useCustomTopics } from "./customTopics";
import Tabs from "./Tabs";

// "Variables Java" and "Java Variables" are the same words in another order: same token
// set → almost surely the same topic typed differently (would create a duplicate)
const tokenKey = (name: string) => slug(name).split("-").filter(Boolean).sort().join("|");

type Props = {
    onClose: () => void;
    onDeleted?: (id: string) => void; // the room may be pointing at the deleted topic
};

type Tab = "json" | "detalles" | "subidos";

// Example the "📄 Plantilla" button downloads: a valid list of placeholder questions
// (length-balanced so it passes the validator), ready to edit
function buildTemplate(): UploadTopicContent {
    return {
        name: "Mi Tema Nuevo",
        tagline: "Describe tu tema en una línea",
        questions: Array.from({ length: MIN_UPLOAD_QUESTIONS }, (_, i) => ({
            question: `Edítame: pregunta número ${i + 1}`,
            answer: `Respuesta correcta ${i + 1}`,
            wrong: [`Opción incorrecta A ${i + 1}`, `Opción incorrecta B ${i + 1}`, `Opción incorrecta C ${i + 1}`],
        })),
    };
}

function downloadTemplate() {
    const blob = new Blob([JSON.stringify(buildTemplate(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-tingo.json";
    a.click();
    URL.revokeObjectURL(url);
}

// 📥 Subir tema (JSON), copied from Jeopardy's uploader and adapted: a fixed-height tabbed
// wizard (no page scroll): 1·JSON (paste or pick, validated live) → 2·Detalles (name,
// description) → Subir, which lands on 📚 Subidos (delete). Rules only accept shape-valid
// `custom-` docs, so there is no permission dance anywhere.
export default function UploadTopicModal({ onClose, onDeleted }: Props) {
    const [tab, setTab] = useState<Tab>("json");
    const [raw, setRaw] = useState("");
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
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
    const { content, questions, errors } = useMemo(() => {
        if (!raw.trim()) return { content: null, questions: [], errors: [] as string[] };
        try {
            const parsed = JSON.parse(raw) as UploadTopicContent;
            const { questions: qs, errors: errs } = parseUpload(parsed);
            return { content: errs.length === 0 ? parsed : null, questions: qs, errors: errs };
        } catch (e) {
            return { content: null, questions: [], errors: [`JSON inválido: ${e instanceof Error ? e.message : e}`] };
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
            const result = await uploadTopic(questions, { id: content.id, name: name.trim(), tagline: tagline.trim() });
            setNote(`✅ "${name.trim()}" subido con ${result.count} preguntas — ya aparece en los temas`);
            setRaw("");
            setTab("subidos");
        } catch (e) {
            console.error("Upload failed", e);
            setNote("❌ No se pudo subir. Revisa la conexión (y que las reglas nuevas estén desplegadas).");
        } finally {
            setBusy(false);
        }
    }

    async function remove(id: string, topicName: string) {
        if (!confirm(`¿Borrar "${topicName}" y todas sus preguntas?`)) return;
        try {
            await deleteCustomTopic(id);
            onDeleted?.(id);
        } catch (e) {
            console.error("Delete failed", e);
            alert("No se pudo borrar. Revisa la conexión.");
        }
    }

    function startOver() {
        setRaw("");
        setName("");
        setTagline("");
        setNote("");
        setTab("json");
    }

    const input = "bg-white text-slate-900 rounded-lg px-3 py-2 w-full";
    const ready = content !== null && name.trim().length > 0;
    const categoryNames = [...new Set(questions.map((q) => q.category))];

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
                className="bg-slate-800 text-white w-full max-w-3xl h-[min(40rem,92dvh)] rounded-2xl p-5 text-left shadow-2xl border border-white/10 flex flex-col gap-3"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="shrink-0 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold">📥 Subir tema</h2>
                    <Tabs
                        label="Pasos para subir un tema"
                        items={[
                            { value: "json" as const, label: content !== null ? "✓ JSON" : "1 · JSON" },
                            { value: "detalles" as const, label: "2 · Detalles", disabled: content === null },
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
                                <label className="bg-white text-slate-900 font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-yellow-300">
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
                                placeholder={`{ "name": "Mi Tema", "questions": [ … ] }\n\nCada pregunta: { "question", "answer", "wrong": [3 incorrectas], "code"? }\nEntre ${MIN_UPLOAD_QUESTIONS} y ${MAX_UPLOAD_QUESTIONS} preguntas. También sirve un JSON de Jeopardy (con "categories").`}
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
                                ✓ JSON válido: {questions.length} preguntas
                                {categoryNames.length > 1 && ` · ${categoryNames.length} categorías (en Tingo se mezclan todas)`}
                            </p>
                            {replaces && (
                                <p className="shrink-0 bg-yellow-300 text-black font-bold rounded-lg px-3 py-2 text-sm">
                                    ⚠️ Ya existe <b>{replaces.name}</b>: al subir se <u>reemplazará</u> con estas {questions.length} preguntas (no se duplica).
                                </p>
                            )}
                            {lookalike && (
                                <p className="shrink-0 bg-orange-500/90 text-black font-bold rounded-lg px-3 py-2 text-sm">
                                    🤔 Ya tienes <b>{lookalike.name}</b>, muy parecido. Con este nombre se creará un tema <u>NUEVO</u> (quedarían los dos).{" "}
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
                                            <b>{t.name}</b>
                                            {t.tagline && <span className="block text-xs opacity-60 truncate">{t.tagline}</span>}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => remove(t.id, t.name)}
                                            className="shrink-0 opacity-70 hover:opacity-100 cursor-pointer"
                                            aria-label={`Borrar ${t.name}`}
                                        >
                                            🗑
                                        </button>
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
                            className="bg-white text-slate-900 font-bold text-xl px-6 py-2 rounded-lg cursor-pointer hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
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
                            className="bg-white text-slate-900 font-bold text-xl px-6 py-2 rounded-lg cursor-pointer hover:bg-yellow-300"
                        >
                            ➕ Subir otro tema
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
