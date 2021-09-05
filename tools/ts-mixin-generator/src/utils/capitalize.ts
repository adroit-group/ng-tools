export function capitalize(word: string = ''): string {
    const [firstLetter, ...rest] = word;
    return firstLetter.toUpperCase().concat(...rest);
}