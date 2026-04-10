/**
 * Skills Configuration
 *
 * Edit this file to add, remove, or modify your skills.
 * Skills are grouped by category for better organization.
 */

export interface Skill {
  name: string;
  level?: number; // Optional: 1-100 for progress bar visualization
  icon?: string; // Optional: emoji or icon name
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
  color?: "primary" | "secondary" | "accent"; // Optional: color theme
}

export const skillsConfig: SkillCategory[] = [
  {
    title: "Machine Learning & AI",
    color: "primary",
    skills: [
      { name: "LLMs & Foundation Models", level: 95, icon: "🤖" },
      { name: "Pre-training & Fine-tuning", level: 95, icon: "⚡" },
      { name: "RLHF & ORPO", level: 92, icon: "🎯" },
      { name: "Prompt Engineering", level: 95, icon: "📝" },
      { name: "Multi-Agent Systems", level: 90, icon: "🤝" },
      { name: "RAG & Vector Search", level: 93, icon: "🔍" },
      { name: "Transformers", level: 95, icon: "🔄" },
      { name: "NLP / NLU / NER", level: 92, icon: "💬" },
    ],
  },
  {
    title: "Deep Learning & Computer Vision",
    color: "secondary",
    skills: [
      { name: "PyTorch", level: 95, icon: "🔥" },
      { name: "TensorFlow / Keras", level: 88, icon: "🧠" },
      { name: "JAX", level: 85, icon: "⚙️" },
      { name: "U-Net / ResNet", level: 90, icon: "🏗️" },
      { name: "Attention Mechanisms", level: 95, icon: "👁️" },
      { name: "Image Segmentation", level: 88, icon: "🖼️" },
      { name: "Multimodal AI", level: 92, icon: "🎨" },
    ],
  },
  {
    title: "MLOps & Inference",
    color: "accent",
    skills: [
      { name: "vLLM", level: 95, icon: "⚡" },
      { name: "SGLang", level: 92, icon: "🚀" },
      { name: "Triton Inference Server", level: 95, icon: "🏎️" },
      { name: "TensorRT / ONNX", level: 88, icon: "⚙️" },
      { name: "BentoML / KServe", level: 85, icon: "📦" },
      { name: "DeepSpeed", level: 90, icon: "💨" },
      { name: "MLflow", level: 90, icon: "📊" },
      { name: "W&B / LangSmith", level: 88, icon: "📈" },
      { name: "LangFuse", level: 85, icon: "🔬" },
    ],
  },
  {
    title: "Infrastructure & DevOps",
    color: "primary",
    skills: [
      { name: "Docker", level: 95, icon: "🐳" },
      { name: "Kubernetes", level: 92, icon: "☸️" },
      { name: "Helm / ArgoCD", level: 88, icon: "⚓" },
      { name: "CI/CD Pipelines", level: 90, icon: "🔄" },
      { name: "Prometheus / Grafana", level: 88, icon: "📊" },
      { name: "OpenTelemetry / Jaeger", level: 85, icon: "🔍" },
    ],
  },
  {
    title: "Data Engineering & Big Data",
    color: "secondary",
    skills: [
      { name: "Apache Airflow", level: 90, icon: "🌊" },
      { name: "Prefect / Ray", level: 85, icon: "⚡" },
      { name: "Kafka / Redis Streams", level: 88, icon: "🚀" },
      { name: "PostgreSQL / MongoDB", level: 90, icon: "🗄️" },
      { name: "ClickHouse / Vertica", level: 85, icon: "⚡" },
      { name: "Elasticsearch", level: 88, icon: "🔍" },
      { name: "MinIO / S3", level: 90, icon: "☁️" },
      { name: "Vector DBs (FAISS, Chroma, Pinecone)", level: 92, icon: "🧭" },
      { name: "PySpark / Hadoop", level: 85, icon: "🔥" },
      { name: "GreenPlum", level: 80, icon: "🌿" },
    ],
  },
  {
    title: "Backend & Architecture",
    color: "accent",
    skills: [
      { name: "FastAPI", level: 95, icon: "⚡" },
      { name: "gRPC", level: 88, icon: "🔌" },
      { name: "Microservices Architecture", level: 92, icon: "🏛️" },
      { name: "High-Load Systems", level: 95, icon: "🚀" },
      { name: "OAuth2 / JWT", level: 90, icon: "🔐" },
      { name: "API Gateway", level: 88, icon: "🚪" },
      { name: "Fault Tolerance (DLQ, exponential backoff)", level: 90, icon: "🛡️" },
    ],
  },
  {
    title: "Leadership & Soft Skills",
    color: "primary",
    skills: [
      { name: "Technical Leadership", level: 95, icon: "👨‍💼" },
      { name: "Cross-Functional Team Management", level: 92, icon: "🤝" },
      { name: "Full-Cycle Product Delivery", level: 95, icon: "🎯" },
      { name: "Research-to-Production Pipeline", level: 95, icon: "🔬" },
      { name: "Mentorship & Knowledge Sharing", level: 90, icon: "📚" },
    ],
  },
];
