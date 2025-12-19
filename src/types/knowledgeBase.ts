
export type KnowledgeSourceType = 'TEXT' | 'FILE' | 'WEBSITE' | 'QA';

export interface KBSnippet {
    id: string;
    agentId: string;
    title: string;
    content: string;
    sizeBytes: number;
    createdAt: string;
    updatedAt: string;
}

export interface KBFile {
    id: string;
    agentId: string;
    filename: string;
    storagePath: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
}

export interface KBWebsite {
    id: string;
    agentId: string;
    url: string;
    status: 'pending' | 'crawling' | 'ready' | 'failed';
    pagesCount: number;
    sizeBytes: number;
    lastCrawledAt?: string;
    createdAt: string;
}

export interface KBQA {
    id: string;
    agentId: string;
    question: string;
    answer: string;
    sizeBytes: number;
    createdAt: string;
    updatedAt: string;
    id_?: string; // Optional ID for tracking
}

export interface KBTraining {
    id: string;
    agentId: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    startedAt: string;
    finishedAt?: string;
    error?: string;
}

export interface KBStats {
    snippetCount: number;
    snippetSize: number;
    fileCount: number;
    fileSize: number;
    websiteCount: number;
    websiteSize: number;
    qaCount: number;
    qaSize: number;
    totalSize: number;
    limitSize: number;
    needsTraining: boolean;
}
