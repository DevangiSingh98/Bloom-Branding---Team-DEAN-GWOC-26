// import fetch from 'node-fetch'; // Using native fetch

const testApi = async () => {
    try {
        console.log('Fetching from http://localhost:5000/api/brands...');
        const response = await fetch('http://localhost:5000/api/brands');

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return;
        }

        const brands = await response.json();
        console.log(`Received ${brands.length} brands.`);

        brands.forEach((b, i) => {
            const hasLogo = !!b.logo;
            const logoLen = b.logo ? b.logo.length : 0;
            console.log(`Brand ${i + 1}: ID=${b._id}, HasLogo=${hasLogo}, LogoLength=${logoLen}`);
        });

    } catch (error) {
        console.error('Fetch failed:', error.message);
    }
};

testApi();
