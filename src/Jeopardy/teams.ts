export type Team = { name: string; score: number };

export function makeTeams(count: number): Team[] {
    return Array.from({ length: count }, (_, i) => ({ name: `Team ${i + 1}`, score: 0 }));
}
