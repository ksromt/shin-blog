import { Brain, Cpu, Wrench, Lightbulb } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface KnowledgeEntry {
  id: string
  /** i18n key under the "Snippets" namespace for entry title */
  titleKey: string
  /** i18n key under the "Snippets" namespace for entry description */
  descKey: string
  tags: string[]
  links?: { label: string; url: string }[]
}

export interface KnowledgeCategory {
  id: string
  /** i18n key under the "Snippets" namespace for category name */
  nameKey: string
  /** i18n key under the "Snippets" namespace for category description */
  descKey: string
  icon: LucideIcon
  entries: KnowledgeEntry[]
}

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: 'llm-rag',
    nameKey: 'catLlmRag',
    descKey: 'catLlmRagDesc',
    icon: Brain,
    entries: [
      {
        id: 'rag-fundamentals',
        titleKey: 'ragFundamentalsTitle',
        descKey: 'ragFundamentalsDesc',
        tags: ['RAG', 'LLM', 'Vector DB'],
        links: [
          { label: 'LangChain RAG Docs', url: 'https://python.langchain.com/docs/tutorials/rag/' },
        ],
      },
      {
        id: 'vector-embeddings',
        titleKey: 'vectorEmbeddingsTitle',
        descKey: 'vectorEmbeddingsDesc',
        tags: ['Embeddings', 'ChromaDB', 'FAISS'],
      },
      {
        id: 'chunking-strategies',
        titleKey: 'chunkingStrategiesTitle',
        descKey: 'chunkingStrategiesDesc',
        tags: ['Chunking', 'Preprocessing', 'RAG'],
      },
    ],
  },
  {
    id: 'model-finetuning',
    nameKey: 'catFineTuning',
    descKey: 'catFineTuningDesc',
    icon: Cpu,
    entries: [
      {
        id: 'lora-qlora',
        titleKey: 'loraQloraTitle',
        descKey: 'loraQloraDesc',
        tags: ['LoRA', 'QLoRA', 'PEFT'],
      },
      {
        id: 'training-data-prep',
        titleKey: 'trainingDataPrepTitle',
        descKey: 'trainingDataPrepDesc',
        tags: ['Dataset', 'Preprocessing'],
      },
    ],
  },
  {
    id: 'llm-skills',
    nameKey: 'catLlmSkills',
    descKey: 'catLlmSkillsDesc',
    icon: Wrench,
    entries: [
      {
        id: 'prompt-engineering',
        titleKey: 'promptEngineeringTitle',
        descKey: 'promptEngineeringDesc',
        tags: ['Prompting', 'CoT', 'Few-shot'],
      },
      {
        id: 'function-calling',
        titleKey: 'functionCallingTitle',
        descKey: 'functionCallingDesc',
        tags: ['Tools', 'Agents', 'Function Calling'],
      },
    ],
  },
  {
    id: 'dev-notes',
    nameKey: 'catDevNotes',
    descKey: 'catDevNotesDesc',
    icon: Lightbulb,
    entries: [
      {
        id: 'nextjs-patterns',
        titleKey: 'nextjsPatternsTitle',
        descKey: 'nextjsPatternsDesc',
        tags: ['Next.js', 'React', 'SSR'],
      },
      {
        id: 'rust-ownership',
        titleKey: 'rustOwnershipTitle',
        descKey: 'rustOwnershipDesc',
        tags: ['Rust', 'Memory Safety'],
      },
    ],
  },
]
