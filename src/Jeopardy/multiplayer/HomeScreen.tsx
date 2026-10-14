import HowToPlay from "./HowToPlay";
import { primaryButton, Screen } from "./ui";

type Props = {
    onHost: () => void;
    onJoin: () => void;
};

export default function HomeScreen({ onHost, onJoin }: Props) {
    return (
        <Screen>
            <h1 className="text-4xl md:text-6xl font-bold">Do you know your English?</h1>
            <div className="flex flex-col gap-4 w-full max-w-sm">
                <button className={primaryButton} onClick={onHost}>
                    Host a game
                </button>
                <button className={primaryButton} onClick={onJoin}>
                    Join a game
                </button>
                {/* One-screen local mode is hidden for now; still reachable at /local */}
            </div>
            <p className="opacity-80 max-w-md">
                Host on the big screen. Players join from their phones.
            </p>
            <HowToPlay />
        </Screen>
    );
}
