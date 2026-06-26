export async function githubSearch(query: string) {
    return [{
        source: "github",
        title: "GitHub repo for " + query,
        url: "https://github.com/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Developer",
        summary: "This is a simulated GitHub result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}