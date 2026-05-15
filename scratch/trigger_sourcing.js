const axios = require('axios');

async function runTrace() {
    try {
        console.log("--- STARTING TRACE ---");
        
        // 1. Create Job Spec
        console.log("1. Creating Job Spec...");
        const jobResponse = await axios.post('http://localhost:3000/api/jobs', {
            job_title: "Associate Software Engineer",
            location: "Lahore",
            seniority: ["associate"],
            industry: ["information_technology"],
            company_size: ["11,50"],
            email_required: false,
            per_page: 25
        });
        
        const jobId = jobResponse.data.data._id;
        console.log("Job Created. ID:", jobId);

        // 2. Trigger Search
        console.log("2. Triggering Search...");
        const searchResponse = await axios.post('http://localhost:3000/api/recruitment/search', {
            jobId: jobId
        });

        console.log("--- TRACE COMPLETED ---");
        console.log("FIND CANDIDATES RAW RESPONSE:", JSON.stringify(searchResponse.data, null, 2));

    } catch (error) {
        console.error("TRACE FAILED:", error.response?.data || error.message);
    }
}

runTrace();
