export function generateCitation(evidence: any) {
    evidence.citation = `[${evidence.source.toUpperCase()}] ${evidence.title} - ${evidence.url} (${evidence.date})`;
    return evidence;
}