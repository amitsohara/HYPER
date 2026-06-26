export async function researchSearch(query: string) {
    return [{
        source: "research_paper",
        title: "Research paper on " + query,
        url: "https://arxiv.org/search?query=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Researcher",
        summary: "This is a simulated research paper result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}