export async function webSearch(query: string) {
    return [{
        source: "web",
        title: "Web result for " + query,
        url: "https://example.com/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Web Author",
        summary: "This is a simulated web search result for the query.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}