export function scoreCredibility(evidence: any) {
    let score = 50;
    if (evidence.source === "government") score = 95;
    else if (evidence.source === "research_paper") score = 90;
    else if (evidence.source === "patent") score = 85;
    else if (evidence.source === "github") score = 75;
    else if (evidence.source === "news") score = 70;
    else if (evidence.source === "web") score = 60;

    evidence.credibility_score = score;
    evidence.freshness_score = 80;
    return evidence;
}