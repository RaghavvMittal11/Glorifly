const syllabusData = {
    physics: [
        {
            title: "Mechanics",
            subtopics: [
                "Kinematics",
                "Laws of Motion",
                "Work, Energy and Power",
                "Rotational Motion",
                "Gravitation"
            ]
        },
        {
            title: "Waves and Thermodynamics",
            subtopics: [
                "Simple Harmonic Motion",
                "Waves",
                "Heat and Thermodynamics",
                "Kinetic Theory of Gases"
            ]
        },
        {
            title: "Electricity and Magnetism",
            subtopics: [
                "Electrostatics",
                "Current Electricity",
                "Magnetic Effects of Current",
                "Electromagnetic Induction",
                "Alternating Current"
            ]
        },
        {
            title: "Modern Physics",
            subtopics: [
                "Photoelectric Effect",
                "Nuclear Physics",
                "Semiconductor Electronics",
                "Communication Systems"
            ]
        }
    ],
    chemistry: [
        {
            title: "Physical Chemistry",
            subtopics: [
                "States of Matter",
                "Atomic Structure",
                "Chemical Bonding",
                "Chemical Thermodynamics",
                "Solutions and Colligative Properties"
            ]
        },
        {
            title: "Organic Chemistry",
            subtopics: [
                "Basic Organic Chemistry",
                "Hydrocarbons",
                "Organic Compounds with Functional Groups",
                "Biomolecules",
                "Polymers"
            ]
        },
        {
            title: "Inorganic Chemistry",
            subtopics: [
                "Periodic Table",
                "Chemical Bonding and Molecular Structure",
                "s-Block Elements",
                "p-Block Elements",
                "d and f Block Elements"
            ]
        }
    ],
    mathematics: [
        {
            title: "Algebra",
            subtopics: [
                "Complex Numbers",
                "Matrices and Determinants",
                "Sequences and Series",
                "Quadratic Equations",
                "Binomial Theorem"
            ]
        },
        {
            title: "Calculus",
            subtopics: [
                "Functions and Limits",
                "Differentiation",
                "Applications of Derivatives",
                "Indefinite Integration",
                "Definite Integration"
            ]
        },
        {
            title: "Coordinate Geometry",
            subtopics: [
                "Straight Lines",
                "Circles",
                "Parabola",
                "Ellipse",
                "Hyperbola"
            ]
        },
        {
            title: "Vector and 3D Geometry",
            subtopics: [
                "Vectors",
                "3D Coordinate System",
                "Planes and Straight Lines",
                "Spheres"
            ]
        }
    ]
};

function createTopicElement(topic) {
    const topicDiv = document.createElement('div');
    topicDiv.className = 'topic';
    
    const content = `
        <h3>${topic.title}</h3>
        <div class="topic-content">
            <ul>
                ${topic.subtopics.map(subtopic => `<li>${subtopic}</li>`).join('')}
            </ul>
        </div>
    `;
    
    topicDiv.innerHTML = content;
    
    topicDiv.addEventListener('click', () => {
        topicDiv.classList.toggle('active');
    });
    
    return topicDiv;
}

function populateSubjects() {
    // Populate Physics
    const physicsContainer = document.getElementById('physics-topics');
    syllabusData.physics.forEach(topic => {
        physicsContainer.appendChild(createTopicElement(topic));
    });

    // Populate Chemistry
    const chemistryContainer = document.getElementById('chemistry-topics');
    syllabusData.chemistry.forEach(topic => {
        chemistryContainer.appendChild(createTopicElement(topic));
    });

    // Populate Mathematics
    const mathematicsContainer = document.getElementById('mathematics-topics');
    syllabusData.mathematics.forEach(topic => {
        mathematicsContainer.appendChild(createTopicElement(topic));
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    populateSubjects();
});