import type { Category } from "./questions";

type Props = {
    board: Category[];
    onSelect?: (categoryIndex: number, tileIndex: number) => void;
};

// Fills its parent's height: the tile rows stretch so all five fit without scrolling
export default function Board({ board, onSelect }: Props) {
    const rows = board[0]?.tiles.length ?? 0;
    const columns = { gridTemplateColumns: `repeat(${board.length}, 1fr)` };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="grid shrink-0" style={columns}>
                {board.map((category) => (
                    <h2 key={category.name} className="text-white text-center text-xl md:text-2xl py-2 px-2 leading-tight">
                        {category.name}
                    </h2>
                ))}
            </div>

            <div className="grid gap-2 bg-black p-2 flex-1 min-h-0" style={{ ...columns, gridTemplateRows: `repeat(${rows}, minmax(3rem, 1fr))` }}>
                {Array.from({ length: rows }).flatMap((_, row) =>
                    board.map((category, col) => {
                        const tile = category.tiles[row];
                        return (
                            <button
                                key={`${col}-${row}`}
                                disabled={tile.used || !onSelect}
                                onClick={() => onSelect?.(col, row)}
                                className="bg-[#2a3698] text-white font-bold text-2xl md:text-4xl enabled:hover:bg-[#3a48b8] enabled:cursor-pointer transition-colors"
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
