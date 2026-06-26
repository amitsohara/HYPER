export async function governmentSearch(query: string) {
    return [{
        source: "government",
        title: "Gov data on " + query,
        url: "https://data.gov/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Agency",
        summary: "This is a simulated government data result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}