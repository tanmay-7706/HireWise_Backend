const mockJDs = [
    {
        id: 'jd-001',
        category: 'Software Engineering - Frontend',
        title: 'Senior Frontend Engineer',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA / Remote',
        type: 'Full-time',
        description: `We're looking for a Senior Frontend Engineer to join our product team and help build the next generation of our SaaS platform.

## About the Role
You'll be responsible for developing high-quality, responsive web applications using modern frontend technologies. You'll collaborate with designers, backend engineers, and product managers to create exceptional user experiences.

## Responsibilities
- Build and maintain complex web applications using React and TypeScript
- Develop reusable component libraries and design systems
- Optimize application performance and ensure cross-browser compatibility
- Collaborate with UX/UI designers to implement pixel-perfect interfaces
- Write clean, maintainable code with comprehensive test coverage
- Participate in code reviews and mentor junior developers
- Stay updated with the latest frontend technologies and best practices

## Required Skills
- 5+ years of professional frontend development experience
- Expert knowledge of React, TypeScript, and modern JavaScript (ES6+)
- Strong understanding of HTML5, CSS3, and responsive design
- Experience with state management (Redux, Zustand, or similar)
- Proficiency in build tools (Webpack, Vite) and package managers
- Experience with RESTful APIs and GraphQL
- Strong understanding of web performance optimization
- Excellent problem-solving and communication skills

## Nice to Have
- Experience with Next.js or other React frameworks
- Knowledge of testing frameworks (Jest, React Testing Library, Cypress)
- Familiarity with CI/CD pipelines
- Contributions to open-source projects
- Experience with accessibility standards (WCAG)

## What We Offer
- Competitive salary ($140k-$180k)
- Equity package
- Remote-first culture
- Unlimited PTO
- Health, dental, and vision insurance
- Learning & development budget`,
        skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'GraphQL', 'Webpack', 'Jest', 'Next.js'],
        createdAt: new Date('2024-01-15')
    },

    {
        id: 'jd-002',
        category: 'Software Engineering - Backend',
        title: 'Backend Engineer - Python',
        company: 'DataFlow Inc',
        location: 'New York, NY / Hybrid',
        type: 'Full-time',
        description: `Join our backend team to build scalable, high-performance APIs and microservices that power millions of users.

## About the Role
As a Backend Engineer, you'll design and implement robust backend systems, optimize database queries, and ensure system reliability at scale.

## Responsibilities
- Design and develop RESTful APIs and microservices using Python
- Build and optimize database schemas (PostgreSQL, MongoDB)
- Implement caching strategies and improve system performance
- Write clean, testable code following best practices
- Collaborate with frontend teams on API contracts
- Monitor system performance and troubleshoot production issues
- Participate in on-call rotation for production support

## Required Skills
- 3+ years of backend development experience
- Strong proficiency in Python and frameworks (Django, FastAPI, or Flask)
- Experience with relational databases (PostgreSQL, MySQL)
- Understanding of RESTful API design principles
- Knowledge of Docker and containerization
- Experience with cloud platforms (AWS, GCP, or Azure)
- Familiarity with message queues (RabbitMQ, Kafka)
- Strong understanding of data structures and algorithms

## Nice to Have
- Experience with NoSQL databases (MongoDB, Redis)
- Knowledge of Kubernetes and microservices architecture
- Experience with GraphQL
- Understanding of CI/CD pipelines (Jenkins, GitHub Actions)
- Familiarity with monitoring tools (Prometheus, Grafana)

## What We Offer
- Salary range: $120k-$160k
- Stock options
- Flexible work arrangements
- Professional development opportunities
- Comprehensive benefits package`,
        skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Redis', 'Kafka', 'Kubernetes'],
        createdAt: new Date('2024-01-20')
    },

    {
        id: 'jd-003',
        category: 'Data Science',
        title: 'Machine Learning Engineer',
        company: 'AI Innovations Lab',
        location: 'Boston, MA / Remote',
        type: 'Full-time',
        description: `We're seeking a Machine Learning Engineer to develop and deploy ML models that solve real-world problems at scale.

## About the Role
You'll work on cutting-edge ML projects, from research to production deployment, collaborating with data scientists and engineers.

## Responsibilities
- Design, develop, and deploy machine learning models
- Build data pipelines for training and inference
- Optimize model performance and reduce latency
- Implement A/B testing frameworks for model evaluation
- Monitor model performance in production
- Research and implement state-of-the-art ML techniques
- Collaborate with cross-functional teams on ML strategy

## Required Skills
- 3+ years of ML engineering experience
- Strong programming skills in Python
- Experience with ML frameworks (TensorFlow, PyTorch, Scikit-learn)
- Proficiency in data manipulation (Pandas, NumPy)
- Understanding of ML algorithms and statistical methods
- Experience deploying models to production
- Knowledge of cloud ML services (AWS SageMaker, Google AI Platform)
- Strong mathematical and analytical skills

## Nice to Have
- PhD or Master's in Computer Science, Statistics, or related field
- Experience with NLP or Computer Vision
- Knowledge of MLOps practices
- Experience with distributed training
- Publications in ML conferences
- Experience with deep learning architectures (Transformers, CNNs, RNNs)

## What We Offer
- Competitive salary ($130k-$190k)
- Research time for exploration
- Conference attendance budget
- Latest hardware and tools
- Collaborative research environment`,
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'AWS', 'MLOps', 'NLP', 'Deep Learning'],
        createdAt: new Date('2024-01-25')
    },

    {
        id: 'jd-004',
        category: 'Product Management',
        title: 'Senior Product Manager',
        company: 'InnovateTech',
        location: 'Seattle, WA / Remote',
        type: 'Full-time',
        description: `Lead product strategy and execution for our flagship B2B SaaS platform serving enterprise customers.

## About the Role
As a Senior Product Manager, you'll own the product roadmap, define features, and work cross-functionally to deliver customer value.

## Responsibilities
- Define product vision and strategy aligned with business goals
- Develop and maintain product roadmaps
- Conduct user research and gather customer feedback
- Write detailed product requirements and user stories
- Prioritize features based on impact and effort
- Collaborate with engineering, design, and marketing teams
- Analyze product metrics and make data-driven decisions
- Present product updates to stakeholders and executives

## Required Skills
- 5+ years of product management experience in B2B SaaS
- Strong analytical and problem-solving skills
- Experience with product analytics tools (Mixpanel, Amplitude)
- Excellent communication and presentation skills
- Proven track record of shipping successful products
- Understanding of agile methodologies
- Ability to balance user needs with business objectives
- Technical background or ability to work with engineering teams

## Nice to Have
- MBA or technical degree
- Experience with product-led growth strategies
- Knowledge of UX design principles
- Experience in enterprise software
- Background in data analysis or engineering
- Familiarity with SQL for data querying

## What We Offer
- Salary range: $150k-$200k
- Performance bonuses
- Equity package
- Remote flexibility
- Impact on product direction`,
        skills: ['Product Management', 'Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Roadmap Planning', 'Stakeholder Management', 'SQL', 'A/B Testing'],
        createdAt: new Date('2024-01-18')
    },

    {
        id: 'jd-005',
        category: 'DevOps',
        title: 'Senior DevOps Engineer',
        company: 'CloudScale Systems',
        location: 'Austin, TX / Remote',
        type: 'Full-time',
        description: `Join our infrastructure team to build and maintain scalable cloud infrastructure supporting millions of users worldwide.

## About the Role
You'll be responsible for designing CI/CD pipelines, managing cloud infrastructure, and ensuring high availability of our services.

## Responsibilities
- Design and implement CI/CD pipelines using GitHub Actions, Jenkins
- Manage cloud infrastructure on AWS (EC2, S3, RDS, Lambda)
- Implement infrastructure as code using Terraform
- Monitor system health and performance
- Implement security best practices
- Automate deployment and scaling processes
- Troubleshoot production issues and perform root cause analysis
- Collaborate with development teams on infrastructure requirements

## Required Skills
- 4+ years of DevOps/SRE experience
- Strong experience with AWS services
- Proficiency in Infrastructure as Code (Terraform, CloudFormation)
- Experience with containerization (Docker, Kubernetes)
- Knowledge of CI/CD tools (Jenkins, GitHub Actions, CircleCI)
- Scripting skills (Python, Bash, or Go)
- Understanding of networking and security concepts
- Experience with monitoring tools (Prometheus, Grafana, Datadog)

## Nice to Have
- Kubernetes certifications (CKA, CKAD)
- AWS certifications (Solutions Architect, DevOps Engineer)
- Experience with GitOps (ArgoCD, Flux)
- Knowledge of service mesh (Istio, Linkerd)
- Experience with chaos engineering

## What We Offer
- Competitive salary ($140k-$180k)
- Remote work options
- Certification reimbursement
- On-call compensation
- Latest tools and technologies`,
        skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Jenkins', 'Python', 'Bash', 'Prometheus', 'Grafana'],
        createdAt: new Date('2024-01-22')
    },

    {
        id: 'jd-006',
        category: 'UI/UX Design',
        title: 'Lead UX Designer',
        company: 'DesignFirst Studio',
        location: 'Los Angeles, CA / Hybrid',
        type: 'Full-time',
        description: `Shape the user experience of our consumer-facing products used by millions of users globally.

## About the Role
As Lead UX Designer, you'll conduct user research, create wireframes and prototypes, and work closely with product and engineering teams.

## Responsibilities
- Lead end-to-end UX design process from research to delivery
- Conduct user interviews, surveys, and usability testing
- Create user personas, journey maps, and information architecture
- Design wireframes, mockups, and interactive prototypes
- Collaborate with UI designers on visual design
- Work with engineers to ensure design feasibility
- Present design concepts to stakeholders
- Maintain and evolve design systems

## Required Skills
- 5+ years of UX design experience
- Expert proficiency in Figma, Sketch, or Adobe XD
- Strong portfolio demonstrating UX process and outcomes
- Experience with user research methodologies
- Understanding of accessibility standards (WCAG 2.1)
- Knowledge of interaction design principles
- Excellent communication and presentation skills
- Ability to balance user needs with business goals

## Nice to Have
- Experience with design systems
- Knowledge of front-end development (HTML, CSS)
- Familiarity with analytics tools (Hotjar, Google Analytics)
- Experience in mobile app design (iOS, Android)
- Motion design skills (After Effects, Principle)
- Background in psychology or human-computer interaction

## What We Offer
- Salary range: $120k-$160k
- Creative freedom
- Latest design tools
- Conference and workshop budget
- Remote-friendly culture`,
        skills: ['UX Design', 'Figma', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Information Architecture', 'Accessibility', 'Design Systems'],
        createdAt: new Date('2024-01-16')
    },

    {
        id: 'jd-007',
        category: 'Full Stack',
        title: 'Full Stack Developer (MERN)',
        company: 'StartupVentures',
        location: 'Denver, CO / Remote',
        type: 'Full-time',
        description: `Build end-to-end features for our rapidly growing startup, working on both frontend and backend.

## About the Role
Join our small but mighty engineering team where you'll have significant ownership and impact on product development.

## Responsibilities
- Develop full-stack features using MERN stack
- Build RESTful APIs and integrate with frontend
- Create responsive, user-friendly interfaces
- Write automated tests for code quality
- Participate in sprint planning and standups
- Deploy and monitor applications
- Collaborate with designers and product managers
- Contribute to technical architecture decisions

## Required Skills
- 3+ years of full-stack development experience
- Strong proficiency in JavaScript/TypeScript
- Experience with React and modern frontend development
- Backend development with Node.js and Express
- Database design with MongoDB
- Understanding of RESTful API design
- Version control with Git
- Problem-solving and debugging skills

## Nice to Have
- Experience with Next.js or similar frameworks
- Knowledge of GraphQL
- Familiarity with cloud platforms (AWS, Heroku)
- Experience with Redis caching
- Understanding of authentication (JWT, OAuth)
- Mobile development experience (React Native)

## What We Offer
- Competitive salary ($100k-$140k)
- Early-stage equity
- Fast-paced startup environment
- Opportunity to wear multiple hats
- Flexible work schedule`,
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'RESTful APIs', 'Git', 'Next.js', 'GraphQL'],
        createdAt: new Date('2024-01-19')
    }
];

// Helper functions
function getAllMockJDs() {
    return mockJDs;
}

function getMockJDById(id) {
    return mockJDs.find(jd => jd.id === id);
}

function getJDsByCategory(category) {
    return mockJDs.filter(jd => jd.category === category);
}

function getAllCategories() {
    return [...new Set(mockJDs.map(jd => jd.category))];
}

module.exports = {
    mockJDs,
    getAllMockJDs,
    getMockJDById,
    getJDsByCategory,
    getAllCategories
};
