export async function patentSearch(query: string) {
    return [{
        source: "patent",
        title: "Patent for " + query,
        url: "https://patents.google.com/?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Inventor",
        summary: "This is a simulated patent result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}