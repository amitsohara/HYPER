async function testLearning() {
    console.log("Testing learning loop...");
    try {
        const res = await fetch("http://localhost:3000/api/learning/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mission_id: "test_mission_001",
                report: "Create a new startup with AI. The startup uses AI to do cool things."
            })
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

testLearning().catch(console.error);
