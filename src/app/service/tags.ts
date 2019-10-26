export function csvToArray(csvList: string): string[] {
    if (!csvList) {
        return undefined;
    }
    return csvList.split(/\s*,\s*/).filter(tag => tag.length > 0);
}
