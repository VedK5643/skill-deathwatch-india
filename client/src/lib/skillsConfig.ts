export interface Skill {
  name: string;
  category: string;
  slug: string;
}

// Single source of truth — mirrors scripts/skills_config.json exactly.
// Category names MUST match what the Python script writes to Supabase.
export const SKILLS: Skill[] = [
  // Programming Languages
  { name: "Python",       category: "Programming Languages", slug: "python"       },
  { name: "Java",         category: "Programming Languages", slug: "java"         },
  { name: "JavaScript",   category: "Programming Languages", slug: "javascript"   },
  { name: "C++",          category: "Programming Languages", slug: "cpp"          },
  { name: "Go",           category: "Programming Languages", slug: "go"           },
  { name: "Rust",         category: "Programming Languages", slug: "rust"         },
  { name: "Kotlin",       category: "Programming Languages", slug: "kotlin"       },
  { name: "TypeScript",   category: "Programming Languages", slug: "typescript"   },

  // Frontend
  { name: "React",        category: "Frontend",             slug: "react"        },
  { name: "Angular",      category: "Frontend",             slug: "angular"      },
  { name: "Vue.js",       category: "Frontend",             slug: "vuejs"        },
  { name: "Next.js",      category: "Frontend",             slug: "nextjs"       },
  { name: "HTML/CSS",     category: "Frontend",             slug: "html-css"     },

  // Backend
  { name: "Node.js",      category: "Backend",              slug: "nodejs"       },
  { name: "Django",       category: "Backend",              slug: "django"       },
  { name: "Spring Boot",  category: "Backend",              slug: "spring-boot"  },
  { name: "FastAPI",      category: "Backend",              slug: "fastapi"      },
  { name: "Flask",        category: "Backend",              slug: "flask"        },

  // Data & Analytics
  { name: "SQL",          category: "Data & Analytics",     slug: "sql"          },
  { name: "Power BI",     category: "Data & Analytics",     slug: "power-bi"     },
  { name: "Tableau",      category: "Data & Analytics",     slug: "tableau"      },
  { name: "Excel",        category: "Data & Analytics",     slug: "excel"        },
  { name: "Pandas",       category: "Data & Analytics",     slug: "pandas"       },
  { name: "Spark",        category: "Data & Analytics",     slug: "spark"        },
  { name: "Snowflake",    category: "Data & Analytics",     slug: "snowflake"    },
  { name: "BigQuery",     category: "Data & Analytics",     slug: "bigquery"     },
  { name: "Apache Kafka", category: "Data & Analytics",     slug: "apache-kafka" },
  { name: "GraphQL",      category: "Data & Analytics",     slug: "graphql"      },

  // DevOps & Cloud
  { name: "AWS",            category: "DevOps & Cloud",     slug: "aws"            },
  { name: "Azure",          category: "DevOps & Cloud",     slug: "azure"          },
  { name: "GCP",            category: "DevOps & Cloud",     slug: "gcp"            },
  { name: "Docker",         category: "DevOps & Cloud",     slug: "docker"         },
  { name: "Kubernetes",     category: "DevOps & Cloud",     slug: "kubernetes"     },
  { name: "Terraform",      category: "DevOps & Cloud",     slug: "terraform"      },
  { name: "Jenkins",        category: "DevOps & Cloud",     slug: "jenkins"        },
  { name: "Prometheus",     category: "DevOps & Cloud",     slug: "prometheus"     },
  { name: "Grafana",        category: "DevOps & Cloud",     slug: "grafana"        },
  { name: "GitHub Actions", category: "DevOps & Cloud",     slug: "github-actions" },
  { name: "Linux",          category: "DevOps & Cloud",     slug: "linux"          },

  // Testing
  { name: "Selenium",   category: "Testing", slug: "selenium"   },
  { name: "Playwright", category: "Testing", slug: "playwright" },
  { name: "Cypress",    category: "Testing", slug: "cypress"    },
  { name: "JUnit",      category: "Testing", slug: "junit"      },
  { name: "Postman",    category: "Testing", slug: "postman"    },

  // AI/ML
  { name: "TensorFlow",   category: "AI/ML", slug: "tensorflow"   },
  { name: "PyTorch",      category: "AI/ML", slug: "pytorch"      },
  { name: "Scikit-learn", category: "AI/ML", slug: "scikit-learn" },
  { name: "LangChain",    category: "AI/ML", slug: "langchain"    },
  { name: "Hugging Face", category: "AI/ML", slug: "hugging-face" },
  { name: "OpenAI",       category: "AI/ML", slug: "openai"       },

  // Cybersecurity
  { name: "Cybersecurity", category: "Cybersecurity", slug: "cybersecurity" },
  { name: "DevSecOps",     category: "Cybersecurity", slug: "devsecops"     },

  // Blockchain
  { name: "Solidity", category: "Blockchain", slug: "solidity" },
];

export const CATEGORIES = Array.from(new Set(SKILLS.map((s) => s.category))).sort();

export function getSkillBySlug(slug: string): Skill | undefined {
  return SKILLS.find((s) => s.slug === slug);
}

export function getSkillsByCategory(category: string): Skill[] {
  return SKILLS.filter((s) => s.category === category);
}
