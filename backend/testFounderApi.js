
const testFounderAPI = async () => {
    try {
        // Test GET
        console.log("Testing GET /api/founders...");
        const getRes = await fetch('http://localhost:5000/api/founders');
        if (getRes.ok) {
            const data = await getRes.json();
            console.log("GET Response:", JSON.stringify(data, null, 2));
        } else {
            console.error("GET Failed:", getRes.status, getRes.statusText);
        }

        // Test POST (Simulate Initialize)
        console.log("\nTesting POST /api/founders (Simulating sync)...");
        const payload = {
            key: 'main',
            image: '/images/founders_updated.png'
        };
        const postRes = await fetch('http://localhost:5000/api/founders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (postRes.ok) {
            const saved = await postRes.json();
            console.log("POST Response:", JSON.stringify(saved, null, 2));
        } else {
            console.error("POST Failed:", postRes.status, await postRes.text());
        }

    } catch (error) {
        console.error("Test Error:", error);
    }
};

testFounderAPI();
