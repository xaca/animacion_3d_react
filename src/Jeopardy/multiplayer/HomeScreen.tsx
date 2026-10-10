import { primaryButton, Screen } from "./ui";

type Props = {
    onHost: () => void;
    onJoin: () => void;
    onLocal: () => void;
};

export default function HomeScreen({ onHost, onJoin, onLocal }: Props) {
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
                <button className={primaryButton} onClick={onLocal}>
                    Play on one screen
                </button>
            </div>
            <p className="opacity-80 max-w-md">
                Host on the big screen. Players join from their phones.
            </p>
        </Screen>
    );
}
