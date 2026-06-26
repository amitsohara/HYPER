export async function newsSearch(query: string) {
    return [{
        source: "news",
        title: "News about " + query,
        url: "https://news.google.com/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Journalist",
        summary: "This is a simulated news result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}