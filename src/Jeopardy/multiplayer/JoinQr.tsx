import { useEffect, useRef } from "react";
import QRCode from "qrcode";

// QR that opens the join form with the code prefilled. Built from location.origin
// so it also works on localhost / --host during class tests.
export default function JoinQr({ code, size = 220 }: { code: string; size?: number }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const url = `${location.origin}/join?code=${code}`;

    useEffect(() => {
        if (canvas.current) QRCode.toCanvas(canvas.current, url, { width: size, margin: 1 }).catch(console.error);
    }, [url, size]);

    return <canvas ref={canvas} width={size} height={size} className="bg-white" aria-label={`QR code for ${url}`} />;
}
