// Sample papers data
const samplePapers = [
    {
        title: "Deep Learning Approaches in Medical Image Analysis",
        authors: ["Sarah Johnson", "Michael Chen", "David Smith"],
        abstract: "This comprehensive review explores the latest developments in deep learning applications for medical image analysis, focusing on diagnostic accuracy and clinical implementation challenges.",
        publicationDate: "2025-02-15",
        doi: "10.1234/dl.med.2025.001",
        categories: ["computer-science", "medicine"],
        keywords: ["deep learning", "medical imaging", "AI", "healthcare"],
        language: "en",
        citation: "Johnson, S., Chen, M., & Smith, D. (2025). Deep Learning Approaches in Medical Image Analysis. Journal of Medical AI, 15(2), 123-145.",
        funding: "National Science Foundation Grant #12345",
        paperUrl: "https://arxiv.org/pdf/sample1.pdf",
        uploadedBy: "system",
        uploadDate: Date.now() - 1000000,
        views: 150,
        downloads: 75
    },
    {
        title: "Quantum Computing: A New Era in Cryptography",
        authors: ["Alex Wong", "Lisa Patel"],
        abstract: "This paper discusses the implications of quantum computing on modern cryptographic systems and proposes new quantum-resistant encryption methods.",
        publicationDate: "2025-01-20",
        doi: "10.1234/qc.crypto.2025.002",
        categories: ["computer-science", "mathematics", "physics"],
        keywords: ["quantum computing", "cryptography", "encryption", "security"],
        language: "en",
        citation: "Wong, A., & Patel, L. (2025). Quantum Computing: A New Era in Cryptography. Quantum Information Processing, 24(1), 45-67.",
        funding: "IBM Quantum Research Grant",
        paperUrl: "https://arxiv.org/pdf/sample2.pdf",
        uploadedBy: "system",
        uploadDate: Date.now() - 2000000,
        views: 200,
        downloads: 120
    },
    {
        title: "Climate Change Impact on Marine Ecosystems",
        authors: ["Maria Garcia", "John Peterson", "Emma Wilson"],
        abstract: "A detailed analysis of how rising ocean temperatures and acidification are affecting marine biodiversity and ecosystem stability.",
        publicationDate: "2025-03-01",
        doi: "10.1234/env.marine.2025.003",
        categories: ["biology", "environmental-science"],
        keywords: ["climate change", "marine biology", "ecosystem", "conservation"],
        language: "en",
        citation: "Garcia, M., Peterson, J., & Wilson, E. (2025). Climate Change Impact on Marine Ecosystems. Marine Biology Review, 40(3), 289-310.",
        funding: "Ocean Conservation Foundation",
        paperUrl: "https://arxiv.org/pdf/sample3.pdf",
        uploadedBy: "system",
        uploadDate: Date.now() - 3000000,
        views: 180,
        downloads: 95
    },
    {
        title: "Social Media's Influence on Political Discourse",
        authors: ["Thomas Brown", "Rachel Kim"],
        abstract: "An examination of how social media platforms shape political discussions and influence public opinion in modern democracies.",
        publicationDate: "2025-02-28",
        doi: "10.1234/soc.pol.2025.004",
        categories: ["social-sciences", "political-science"],
        keywords: ["social media", "politics", "public opinion", "democracy"],
        language: "en",
        citation: "Brown, T., & Kim, R. (2025). Social Media's Influence on Political Discourse. Journal of Digital Society, 12(4), 178-195.",
        funding: "Digital Democracy Institute",
        paperUrl: "https://arxiv.org/pdf/sample4.pdf",
        uploadedBy: "system",
        uploadDate: Date.now() - 4000000,
        views: 250,
        downloads: 140
    },
    {
        title: "Sustainable Urban Development Strategies",
        authors: ["James Anderson", "Sofia Rodriguez", "Wei Chen"],
        abstract: "This research presents innovative approaches to sustainable urban planning, incorporating green technologies and community-centered design principles.",
        publicationDate: "2025-03-05",
        doi: "10.1234/urban.sus.2025.005",
        categories: ["engineering", "environmental-science", "social-sciences"],
        keywords: ["urban planning", "sustainability", "green technology", "community development"],
        language: "en",
        citation: "Anderson, J., Rodriguez, S., & Chen, W. (2025). Sustainable Urban Development Strategies. Urban Planning Review, 30(1), 67-89.",
        funding: "Sustainable Cities Initiative",
        paperUrl: "https://arxiv.org/pdf/sample5.pdf",
        uploadedBy: "system",
        uploadDate: Date.now(),
        views: 120,
        downloads: 60
    }
];

// Function to add sample papers to Firebase
async function addSamplePapers() {
    try {
        const papersRef = firebase.database().ref('papers');
        
        // Add each paper
        for (const paper of samplePapers) {
            await papersRef.push(paper);
        }
        
        console.log('Sample papers added successfully');
    } catch (error) {
        console.error('Error adding sample papers:', error);
    }
}

// Add papers when script is loaded
addSamplePapers();
