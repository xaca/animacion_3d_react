import HowToPlay from "./HowToPlay";
import { primaryButton, Screen } from "./ui";

type Props = {
    onHost: () => void;
    onJoin: () => void;
};

export default function HomeScreen({ onHost, onJoin }: Props) {
    return (
        <Screen>
            <h1 className="text-4xl md:text-6xl font-bold">
                Tingo Tango <span className="inline-block w-5 h-5 md:w-8 md:h-8 rounded-full bg-red-500 align-baseline" aria-hidden />
            </h1>
            <p className="text-xl opacity-80 -mt-3">¿Dónde está la bolita? · by Coding with Friends</p>
            <div className="flex flex-col gap-4 w-full max-w-sm">
                <button className={primaryButton} onClick={onHost}>
                    Dirigir el juego
                </button>
                <button className={primaryButton} onClick={onJoin}>
                    Unirme a un juego
                </button>
            </div>
            <p className="opacity-80 max-w-md">El profesor en la pantalla grande. Los estudiantes entran desde su celular.</p>
            <HowToPlay />
        </Screen>
    );
}
