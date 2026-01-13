
const testGet = async () => {
    try {
        console.log("Testing GET /api/founders...");
        const res = await fetch('http://localhost:5000/api/founders');
        if (res.ok) {
            const data = await res.json();
            console.log("GET SUCCESS. Data:", JSON.stringify(data, null, 2));
        } else {
            console.error("GET FAILED:", res.status, await res.text());
        }
    } catch (e) {
        console.error("GET ERROR:", e);
    }
};
testGet();
