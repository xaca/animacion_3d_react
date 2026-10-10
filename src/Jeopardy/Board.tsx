import type { Category } from "./questions";

type Props = {
    board: Category[];
    onSelect?: (categoryIndex: number, tileIndex: number) => void;
};

export default function Board({ board, onSelect }: Props) {
    const rows = board[0]?.tiles.length ?? 0;

    return (
        <div className="flex flex-col w-full">
            <div className="grid" style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}>
                {board.map((category) => (
                    <h2 key={category.name} className="text-white text-center text-2xl md:text-3xl py-2 truncate px-2">
                        {category.name}
                    </h2>
                ))}
            </div>

            <div
                className="grid gap-2 bg-black p-2"
                style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}
            >
                {Array.from({ length: rows }).flatMap((_, row) =>
                    board.map((category, col) => {
                        const tile = category.tiles[row];
                        return (
                            <button
                                key={`${col}-${row}`}
                                disabled={tile.used || !onSelect}
                                onClick={() => onSelect?.(col, row)}
                                className="bg-[#2a3698] text-white font-bold text-xl md:text-2xl h-16 md:h-20 enabled:hover:bg-[#3a48b8] enabled:cursor-pointer transition-colors"
                            >
                                {tile.used ? "" : tile.value}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
