
import { KBSnippet, KBFile, KBWebsite, KBQA, KBStats } from '../types/knowledgeBase';

// Mock Data
let snippets: KBSnippet[] = [
    { id: '1', agentId: '1', title: 'Newsletter-Abmeldung', content: 'Kunde möchte sich vom Newsletter abmelden. Antwort: - wenn ein Kunde...', sizeBytes: 149, createdAt: '2025-11-06T10:00:00Z', updatedAt: '2025-11-06T10:00:00Z' },
    { id: '2', agentId: '1', title: 'Rechnungsanfrage', content: 'Kunde fragt nach Rechnung. Antwort: - wenn ein Kunde nach der Rechnung...', sizeBytes: 120, createdAt: '2025-11-06T11:00:00Z', updatedAt: '2025-11-06T11:00:00Z' },
    { id: '3', agentId: '1', title: 'Stornierung vor Versand', content: 'Kunde möchte stornieren und die Bestellung wurde noch nicht versendet...', sizeBytes: 406, createdAt: '2025-11-06T12:00:00Z', updatedAt: '2025-11-06T12:00:00Z' },
    { id: '4', agentId: '1', title: 'Sehstärke, unterschiedliche Größen', content: 'Kunde fragt, ob man Brillen mit Sehstärke oder in unterschiedlichen...', sizeBytes: 596, createdAt: '2025-11-06T13:00:00Z', updatedAt: '2025-11-06T13:00:00Z' },
    { id: '5', agentId: '1', title: 'Scam-Mails etc.', content: 'Mails, die nichts mit unseren Kunden zu tun haben. Antwort: - leite alle Mails vo...', sizeBytes: 249, createdAt: '2025-11-06T14:00:00Z', updatedAt: '2025-11-06T14:00:00Z' },
    { id: '6', agentId: '1', title: 'Rückerstattung Zeitfrage', content: 'Kunde erkundigt sich, wann die versprochene Rückerstattung eintreffe...', sizeBytes: 594, createdAt: '2025-11-06T15:00:00Z', updatedAt: '2025-11-06T15:00:00Z' },
    { id: '7', agentId: '1', title: 'Retoure/Umtausch anmelden', content: 'Kunde möchte eine Bestellung zurücksenden oder eine Retoure...', sizeBytes: 729, createdAt: '2025-11-06T16:00:00Z', updatedAt: '2025-11-06T16:00:00Z' },
];

let websites: KBWebsite[] = [
    { id: '1', agentId: '1', url: 'https://resolvia.demo/faq', status: 'ready', pagesCount: 1, sizeBytes: 2830, createdAt: '2025-11-05T09:00:00Z' }
];

let qas: KBQA[] = [
    { id: '1', agentId: '1', question: 'Wie sind die Öffnungszeiten?', answer: 'Unser Support ist Montag bis Freitag von 9:00 bis 17:00 Uhr erreichbar.', sizeBytes: 85, createdAt: '2025-11-07T09:00:00Z', updatedAt: '2025-11-07T09:00:00Z' }
];

let files: KBFile[] = [];

let needsTraining = true;
const MAX_SIZE_BYTES = 400 * 1024; // 400 KB

export const kbService = {
    // Stats
    getStats: async (): Promise<KBStats> => {
        const snippetSize = snippets.reduce((acc, s) => acc + s.sizeBytes, 0);
        const fileSize = files.reduce((acc, f) => acc + f.sizeBytes, 0);
        const websiteSize = websites.reduce((acc, w) => acc + w.sizeBytes, 0);
        const qaSize = qas.reduce((acc, q) => acc + q.sizeBytes, 0);

        return {
            snippetCount: snippets.length,
            snippetSize,
            fileCount: files.length,
            fileSize,
            websiteCount: websites.length,
            websiteSize,
            qaCount: qas.length,
            qaSize,
            totalSize: snippetSize + fileSize + websiteSize + qaSize,
            limitSize: MAX_SIZE_BYTES,
            needsTraining
        };
    },

    // Snippets
    getSnippets: async () => [...snippets],
    createSnippet: async (title: string, content: string) => {
        const newSnippet: KBSnippet = {
            id: Date.now().toString(),
            agentId: '1',
            title,
            content,
            sizeBytes: new Blob([content]).size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        snippets = [newSnippet, ...snippets];
        needsTraining = true;
        return newSnippet;
    },
    updateSnippet: async (id: string, title: string, content: string) => {
        snippets = snippets.map(s => s.id === id ? {
            ...s,
            title,
            content,
            sizeBytes: new Blob([content]).size,
            updatedAt: new Date().toISOString()
        } : s);
        needsTraining = true;
    },
    deleteSnippet: async (id: string) => {
        snippets = snippets.filter(s => s.id !== id);
        needsTraining = true;
    },

    // Websites
    getWebsites: async () => [...websites],
    addWebsite: async (url: string) => {
        const newSite: KBWebsite = {
            id: Date.now().toString(),
            agentId: '1',
            url,
            status: 'pending',
            pagesCount: 0,
            sizeBytes: 0,
            createdAt: new Date().toISOString()
        };
        websites = [newSite, ...websites];

        // Simulate crawl
        setTimeout(() => {
            websites = websites.map(w => w.id === newSite.id ? { ...w, status: 'ready', pagesCount: 5, sizeBytes: 15000, lastCrawledAt: new Date().toISOString() } : w);
            needsTraining = true;
        }, 2000);

        return newSite;
    },
    deleteWebsite: async (id: string) => {
        websites = websites.filter(w => w.id !== id);
        needsTraining = true;
    },

    // Files
    getFiles: async () => [...files],
    uploadFile: async (file: File) => {
        const newFile: KBFile = {
            id: Date.now().toString(),
            agentId: '1',
            filename: file.name,
            storagePath: `/kb/${file.name}`,
            mimeType: file.type,
            sizeBytes: file.size,
            createdAt: new Date().toISOString()
        };
        files = [newFile, ...files];
        needsTraining = true;
        return newFile;
    },
    deleteFile: async (id: string) => {
        files = files.filter(f => f.id !== id);
        needsTraining = true;
    },

    // Q&A
    getQAs: async () => [...qas],
    createQA: async (question: string, answer: string) => {
        const newQA: KBQA = {
            id: Date.now().toString(),
            agentId: '1',
            question,
            answer,
            sizeBytes: new Blob([question, answer]).size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        qas = [newQA, ...qas];
        needsTraining = true;
        return newQA;
    },
    updateQA: async (id: string, question: string, answer: string) => {
        qas = qas.map(q => q.id === id ? {
            ...q,
            question,
            answer,
            sizeBytes: new Blob([question, answer]).size,
            updatedAt: new Date().toISOString()
        } : q);
        needsTraining = true;
    },
    deleteQA: async (id: string) => {
        qas = qas.filter(q => q.id !== id);
        needsTraining = true;
    },

    // Training
    trainAgent: async () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                needsTraining = false;
                resolve();
            }, 3000);
        });
    }
};
