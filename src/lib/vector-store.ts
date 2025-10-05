/**
 * Vector Store Configuration
 * 
 * Provides vector database utilities for AI/ML operations, embeddings, and similarity search.
 * This is a placeholder implementation that can be extended with actual vector database functionality.
 */

export interface VectorDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

export interface SearchResult {
  document: VectorDocument;
  score: number;
  distance?: number;
}

export interface VectorStoreConfig {
  dimensions?: number;
  metric?: 'cosine' | 'euclidean' | 'dot';
  indexType?: 'flat' | 'hnsw' | 'ivf';
}

/**
 * Mock Vector Store for development/testing
 */
export class MockVectorStore {
  private documents = new Map<string, VectorDocument>();
  private config: VectorStoreConfig;

  constructor(config: VectorStoreConfig = {}) {
    this.config = {
      dimensions: 1536, // OpenAI embedding dimensions
      metric: 'cosine',
      indexType: 'flat',
      ...config,
    };
  }

  /**
   * Add document to vector store
   */
  async addDocument(document: VectorDocument): Promise<void> {
    // Generate mock embedding if not provided
    if (!document.embedding) {
      document.embedding = this.generateMockEmbedding();
    }
    
    this.documents.set(document.id, document);
  }

  /**
   * Add multiple documents
   */
  async addDocuments(documents: VectorDocument[]): Promise<void> {
    for (const doc of documents) {
      await this.addDocument(doc);
    }
  }

  /**
   * Search for similar documents
   */
  async search(query: string | number[], limit = 10): Promise<SearchResult[]> {
    const queryEmbedding = Array.isArray(query) ? query : this.generateMockEmbedding();
    const results: SearchResult[] = [];

    for (const [id, document] of this.documents) {
      if (!document.embedding) continue;

      const similarity = this.calculateCosineSimilarity(queryEmbedding, document.embedding);
      results.push({
        document,
        score: similarity,
        distance: 1 - similarity,
      });
    }

    // Sort by similarity score (descending)
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  /**
   * Get document by ID
   */
  async getDocument(id: string): Promise<VectorDocument | null> {
    return this.documents.get(id) || null;
  }

  /**
   * Delete document
   */
  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  /**
   * Update document
   */
  async updateDocument(id: string, updates: Partial<VectorDocument>): Promise<boolean> {
    const existing = this.documents.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates };
    if (updates.content && !updates.embedding) {
      updated.embedding = this.generateMockEmbedding();
    }

    this.documents.set(id, updated);
    return true;
  }

  /**
   * Get collection stats
   */
  async getStats(): Promise<{ count: number; dimensions: number }> {
    return {
      count: this.documents.size,
      dimensions: this.config.dimensions || 1536,
    };
  }

  /**
   * Clear all documents
   */
  async clear(): Promise<void> {
    this.documents.clear();
  }

  /**
   * Generate mock embedding for testing
   */
  private generateMockEmbedding(): number[] {
    const dimensions = this.config.dimensions || 1536;
    const embedding = new Array(dimensions);
    
    for (let i = 0; i < dimensions; i++) {
      embedding[i] = (Math.random() - 0.5) * 2; // Random values between -1 and 1
    }
    
    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// Global vector store instance
let vectorStore: MockVectorStore | null = null;

/**
 * Get vector store instance
 */
export function getVectorStore(config?: VectorStoreConfig): MockVectorStore {
  if (!vectorStore) {
    vectorStore = new MockVectorStore(config);
  }
  return vectorStore;
}

/**
 * Vector store utilities
 */
export const vectorStore = {
  /**
   * Initialize vector store
   */
  init(config?: VectorStoreConfig): MockVectorStore {
    return getVectorStore(config);
  },

  /**
   * Add document with automatic embedding generation
   */
  async addDocument(content: string, metadata?: Record<string, any>): Promise<string> {
    const store = getVectorStore();
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await store.addDocument({
      id,
      content,
      metadata,
    });
    
    return id;
  },

  /**
   * Search for similar content
   */
  async searchSimilar(query: string, limit = 10): Promise<SearchResult[]> {
    const store = getVectorStore();
    return await store.search(query, limit);
  },

  /**
   * Get store statistics
   */
  async getStats() {
    const store = getVectorStore();
    return await store.getStats();
  },
};

export default {
  VectorStore: MockVectorStore,
  getVectorStore,
  vectorStore,
};