export interface Skill {
  name: string;
  category: string;
  slug: string;
}

export const SKILLS: Skill[] = [
  // Programming Languages
  { name: "Python", category: "Programming Languages", slug: "python" },
  { name: "Java", category: "Programming Languages", slug: "java" },
  { name: "JavaScript", category: "Programming Languages", slug: "javascript" },
  { name: "C++", category: "Programming Languages", slug: "cpp" },
  { name: "Go", category: "Programming Languages", slug: "go" },
  { name: "Rust", category: "Programming Languages", slug: "rust" },
  { name: "Kotlin", category: "Programming Languages", slug: "kotlin" },
  { name: "TypeScript", category: "Programming Languages", slug: "typescript" },

  // Frontend
  { name: "React", category: "Frontend", slug: "react" },
  { name: "Angular", category: "Frontend", slug: "angular" },
  { name: "Vue.js", category: "Frontend", slug: "vuejs" },
  { name: "Next.js", category: "Frontend", slug: "nextjs" },
  { name: "HTML/CSS", category: "Frontend", slug: "html-css" },

  // Backend
  { name: "Node.js", category: "Backend", slug: "nodejs" },
  { name: "Django", category: "Backend", slug: "django" },
  { name: "Spring Boot", category: "Backend", slug: "spring-boot" },
  { name: "FastAPI", category: "Backend", slug: "fastapi" },
  { name: "Flask", category: "Backend", slug: "flask" },

  // Data & Analytics
  { name: "SQL", category: "Data & Analytics", slug: "sql" },
  { name: "Power BI", category: "Data & Analytics", slug: "power-bi" },
  { name: "Tableau", category: "Data & Analytics", slug: "tableau" },
  { name: "Apache Spark", category: "Data & Analytics", slug: "apache-spark" },
  { name: "Pandas", category: "Data & Analytics", slug: "pandas" },

  // Cloud & DevOps
  { name: "AWS", category: "Cloud & DevOps", slug: "aws" },
  { name: "Docker", category: "Cloud & DevOps", slug: "docker" },
  { name: "Kubernetes", category: "Cloud & DevOps", slug: "kubernetes" },
  { name: "GCP", category: "Cloud & DevOps", slug: "gcp" },
  { name: "Azure", category: "Cloud & DevOps", slug: "azure" },

  // Mobile
  { name: "React Native", category: "Mobile", slug: "react-native" },
  { name: "Flutter", category: "Mobile", slug: "flutter" },
  { name: "Swift", category: "Mobile", slug: "swift" },
  { name: "Kotlin Mobile", category: "Mobile", slug: "kotlin-mobile" },

  // Testing & QA
  { name: "Selenium", category: "Testing & QA", slug: "selenium" },
  { name: "Playwright", category: "Testing & QA", slug: "playwright" },
  { name: "Jest", category: "Testing & QA", slug: "jest" },
  { name: "Cypress", category: "Testing & QA", slug: "cypress" },
  { name: "JUnit", category: "Testing & QA", slug: "junit" },
  { name: "Postman", category: "Testing & QA", slug: "postman" },
  { name: "LoadRunner", category: "Testing & QA", slug: "loadrunner" },
];

export const CATEGORIES = Array.from(new Set(SKILLS.map((s) => s.category))).sort();

export function getSkillBySlug(slug: string): Skill | undefined {
  return SKILLS.find((s) => s.slug === slug);
}

export function getSkillsByCategory(category: string): Skill[] {
  return SKILLS.filter((s) => s.category === category);
}
