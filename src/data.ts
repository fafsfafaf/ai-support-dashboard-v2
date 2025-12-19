
import React from 'react';
import { ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { Organization, Customer, Ticket, SecurityLog, Order, IntegrationProvider, Agent, Return } from './types';

export const ORGANIZATIONS: Organization[] = [
    { id: 'org_1', name: 'Resolvia Demo', role: 'Admin', initials: 'R', color: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
    { id: 'org_2', name: 'Pheroma', role: 'Admin', initials: 'P', color: 'bg-gradient-to-br from-purple-400 to-pink-500' },
    { id: 'org_3', name: 'DS Commerce LTD', role: 'Admin', initials: 'D', color: 'bg-gradient-to-br from-blue-600 to-indigo-700' },
    { id: 'org_4', name: 'AMDOR', role: 'Admin', initials: 'A', color: 'bg-gradient-to-br from-slate-600 to-slate-800' },
    { id: 'org_5', name: 'Sivara', role: 'Admin', initials: 'S', color: 'bg-gradient-to-br from-rose-400 to-red-500' },
];

export const INITIAL_AGENTS: Agent[] = [
    { id: 'u1', name: 'Erkan Yusufoglu', email: 'erkan@resolvia.ai', initials: 'EY', color: 'bg-indigo-600', activeSince: '15.01.2023' },
    { id: 'u2', name: 'Sarah Smith', email: 'sarah@resolvia.ai', initials: 'SS', color: 'bg-pink-600', activeSince: '01.03.2023' },
    { id: 'u3', name: 'Mike Johnson', email: 'mike@resolvia.ai', initials: 'MJ', color: 'bg-cyan-600', activeSince: '20.06.2023' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { 
      id: 'c1', 
      firstName: 'Erkan', 
      lastName: 'Yusufoglu', 
      email: 'rechnung@erkanadali.de', 
      ltv: 249.50, 
      orderCount: 2, 
      returnCount: 3, 
      since: '09.10.2023',
      address: {
          name: 'Erkan Yusufoglu',
          street: 'Musterstraße 12',
          city: 'Berlin',
          zip: '10115',
          country: 'Deutschland'
      }
  },
  { 
      id: 'c2', 
      firstName: 'Andy', 
      lastName: 'Müller', 
      email: 'andy@example.com', 
      ltv: 120.00, 
      orderCount: 1, 
      returnCount: 0, 
      since: '11.11.2023',
      address: {
          name: 'Andy Müller',
          street: 'Beispielweg 1',
          city: 'Hamburg',
          zip: '20095',
          country: 'Deutschland'
      }
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-1005',
    merchantId: 'mrc_demo_123',
    customerId: 'c2',
    subject: 'Instagram Kommentar von @Andy',
    status: 'closed',
    priority: 'MEDIUM',
    assignedTo: 'u1',
    tags: ['Support-Archiv'],
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2023-11-20T23:00:00Z',
    channel: 'INSTAGRAM',
    isUnread: false,
    messages: [
      { id: 'm1', sender: 'CUSTOMER', content: 'Wann kommt das wieder rein?', timestamp: '2023-11-20T10:00:00Z' }
    ]
  },
  {
    id: 'TKT-1004',
    merchantId: 'mrc_demo_123',
    customerId: 'c2',
    subject: 'WhatsApp Chat mit Andy',
    status: 'closed',
    priority: 'MEDIUM',
    assignedTo: 'u2',
    tags: ['Retoure'],
    createdAt: '2023-11-20T09:00:00Z',
    updatedAt: '2023-11-20T09:30:00Z',
    channel: 'WHATSAPP',
    isUnread: true,
    messages: [
      { id: 'm1', sender: 'CUSTOMER', content: 'Hallo, ich habe eine Frage zur Größe.', timestamp: '2023-11-20T09:00:00Z' }
    ]
  },
  {
    id: 'TKT-MI7YP7DB',
    merchantId: 'mrc_demo_123',
    customerId: 'c1',
    subject: 'ICH WERDE EUCH ANZEIGEN!!!!',
    status: 'under_review',
    priority: 'HIGH',
    tags: ['Prüfung'],
    createdAt: '2023-11-05T09:00:00Z',
    updatedAt: '2023-11-21T09:30:00Z',
    isUnread: true,
    messages: [
      { id: 'm3', sender: 'CUSTOMER', content: 'Das ist Betrug! Ich will mein Geld zurück!', timestamp: '2023-11-05T09:00:00Z' }
    ],
    draft: {
        content: "Sehr geehrter Herr Yusufoglu, bitte entschuldigen Sie die Unannehmlichkeiten. Wir prüfen Ihren Fall sofort.",
        timestamp: '2023-11-21T09:35:00Z',
        author: 'AI'
    }
  },
  {
    id: 'TKT-MI6MM5F9',
    merchantId: 'mrc_demo_123',
    customerId: 'c1',
    subject: 'Wo bleibt endlich meine Bestellung? Langsam nervt mich das ganze',
    status: 'closed',
    priority: 'HIGH',
    assignedTo: 'u1',
    tags: ['KI Gelöst'],
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-11-20T23:00:00Z',
    isUnread: false,
    messages: [
      { id: 'm1', sender: 'CUSTOMER', content: 'Guten Abend,\n\nWo bleibt meine Bestellung? Ich warte schon echt lange...', timestamp: '2023-10-25T10:00:00Z' },
      { id: 'm2', sender: 'AI', content: 'Guten Abend Erkan...', timestamp: '2023-10-25T10:01:00Z' }
    ]
  },
   {
    id: 'TKT-MI6MI62D',
    merchantId: 'mrc_demo_123',
    customerId: 'c1',
    subject: 'Was würdet ihr mir empfehlen?',
    status: 'resolved_ai',
    priority: 'LOW',
    tags: ['KI Gelöst', 'Support-Archiv'],
    createdAt: '2023-11-19T14:00:00Z',
    updatedAt: '2023-11-19T14:05:00Z',
    isUnread: false,
    messages: [
      { id: 'm4', sender: 'CUSTOMER', content: 'Ich suche eine Brille für den Strand.', timestamp: '2023-11-19T14:00:00Z' }
    ]
  },
];

export const SECURITY_LOGS: SecurityLog[] = [
    { id: 'log_1', event: 'Erfolgreicher Login', status: 'SUCCESS', user: 'Admin (Erkan)', ip: '84.152.12.9', timestamp: '2023-11-21T10:45:00', location: 'Berlin, DE' },
    { id: 'log_2', event: 'API Key erstellt', status: 'SUCCESS', user: 'System', ip: '127.0.0.1', timestamp: '2023-11-21T09:30:00', location: 'Server' },
    { id: 'log_3', event: 'Fehlgeschlagener Login', status: 'FAILED', user: 'Unknown', ip: '45.22.19.112', timestamp: '2023-11-20T23:15:00', location: 'Moscow, RU' },
    { id: 'log_4', event: 'Export Kundendaten', status: 'WARNING', user: 'Admin (Erkan)', ip: '84.152.12.9', timestamp: '2023-11-20T14:20:00', location: 'Berlin, DE' },
    { id: 'log_5', event: 'Shopify Sync', status: 'SUCCESS', user: 'System (Automated)', ip: '127.0.0.1', timestamp: '2023-11-20T12:00:00', location: 'Server' },
];

export const DEMO_ORDERS: Order[] = [
    {
        id: 'ORD-2023-1001',
        customerId: 'c1',
        date: '2023-11-20',
        status: 'PAID',
        shippingStatus: 'SHIPPED',
        total: 129.90,
        subtotal: 139.90,
        discount: 10.00,
        discountCode: 'WELCOME10',
        shippingCost: 0,
        items: [
            { 
                id: 'item1', 
                productName: 'Sonnenbrille Time Sand', 
                sku: 'SUN-TIME-SAND', 
                quantity: 1, 
                price: 79.90, 
                originalPrice: 79.90, 
                imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=200&h=200' 
            },
            { 
                id: 'item2', 
                productName: 'Brillenetui Leder', 
                sku: 'ACC-CASE-LEATHER', 
                quantity: 1, 
                price: 50.00, 
                originalPrice: 60.00, 
                imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=200&h=200' 
            }
        ],
        trackingNumber: '00340434663119156062',
        shippingAddress: {
            name: 'Erkan Yusufoglu',
            street: 'Musterstraße 12',
            city: 'Berlin',
            zip: '10115',
            country: 'Deutschland'
        }
    }
];

export const DEMO_RETURNS: Return[] = [
    {
        id: 'RET-2023-001',
        orderId: 'ORD-2023-1001',
        customerId: 'c1',
        status: 'REGISTERED',
        createdAt: '2023-11-21T10:00:00Z',
        updatedAt: '2023-11-21T10:00:00Z',
        refundAmount: 79.90,
        items: [
             { 
                id: 'ri_1', 
                productName: 'Sonnenbrille Time Sand', 
                sku: 'SUN-TIME-SAND', 
                quantity: 1, 
                reason: 'Gefällt nicht',
                condition: 'Neu',
                price: 79.90,
                imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=200&h=200' 
            }
        ],
        customerComment: "Die Brille steht mir leider nicht."
    },
    {
        id: 'RET-2023-002',
        orderId: 'ORD-2023-0988',
        customerId: 'c2',
        status: 'RECEIVED',
        createdAt: '2023-11-18T14:30:00Z',
        updatedAt: '2023-11-20T09:15:00Z',
        refundAmount: 120.00,
        items: [
             { 
                id: 'ri_2', 
                productName: 'Winterjacke Nordic', 
                sku: 'JKT-NORDIC-L', 
                quantity: 1, 
                reason: 'Zu groß',
                condition: 'Geöffnet',
                price: 120.00,
                imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=200&h=200' 
            }
        ],
        trackingNumber: 'DHL-8837192837'
    },
    {
        id: 'RET-2023-003',
        orderId: 'ORD-2023-0950',
        customerId: 'c1',
        status: 'COMPLETED',
        createdAt: '2023-11-10T09:00:00Z',
        updatedAt: '2023-11-15T16:00:00Z',
        refundAmount: 45.00,
        items: [
             { 
                id: 'ri_3', 
                productName: 'T-Shirt Basic White', 
                sku: 'TSH-BASIC-W-M', 
                quantity: 2, 
                reason: 'Qualität ungenügend',
                condition: 'Neu',
                price: 22.50,
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200&h=200' 
            }
        ]
    }
];

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
    { code: 'shopify', name: 'Shopify', description: 'Sync orders and customers', icon: React.createElement(ShoppingBag) },
    { code: 'dhl', name: 'DHL', description: 'Shipping status updates', icon: React.createElement(Truck) },
    { code: 'stripe', name: 'Stripe', description: 'Payment information', icon: React.createElement(CreditCard) },
];

export const EMOJIS = ['😀', '😂', '🥲', '😍', '🤔', '👍', '👎', '🙏', '🔥', '🎉', '👋', '👀', '❤️', '✅', '❌', '😭', '🤯', '😱'];
export const TEMPLATES = [
  { title: "Rückerstattung genehmigt", content: "Hallo Erkan,<br><br>ich habe gute Nachrichten! Deine Rückerstattung wurde soeben genehmigt. Das Geld sollte innerhalb von 2-3 Werktagen auf deinem Konto eingehen.<br><br>Falls du noch Fragen hast, melde dich gerne.<br><br>Beste Grüße,<br>Support Team" },
  { title: "Verärgerter Kunde (Deeskalation)", content: "Hallo Erkan,<br><br>es tut mir sehr leid zu hören, dass du mit deiner Erfahrung unzufrieden bist. Das entspricht nicht unserem Standard.<br><br>Ich werde mich persönlich um dein Anliegen kümmern und sicherstellen, dass wir eine schnelle Lösung finden.<br><br>Beste Grüße,<br>Support Team" },
  { title: "Versandstatus Update", content: "Hallo Erkan,<br><br>vielen Dank für deine Geduld. Ich habe den Status deiner Sendung geprüft und kann bestätigen, dass das Paket morgen zugestellt wird.<br><br>Hier ist der Tracking-Link zur Verfolgung.<br><br>Liebe Grüße,<br>Support Team" }
];
