
import React from 'react';

export type UserRole = 'OWNER' | 'ADMIN' | 'AGENT';
export type TicketStatus = 'open' | 'waiting' | 'closed' | 'resolved_ai' | 'under_review' | 'on_hold';
export type OrderStatus = 'PAID' | 'UNPAID' | 'PART_REFUNDED' | 'CANCELED' | 'SHIPPED';
export type ReturnStatus = 'REGISTERED' | 'RECEIVED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type SortOption = 'DATE_DESC' | 'DATE_ASC' | 'UPDATED_DESC' | 'PRIORITY_DESC' | 'MANUAL';

export interface TicketMessage {
    id: string;
    sender: 'CUSTOMER' | 'AGENT' | 'AI';
    content: string;
    timestamp: string;
    isInternal?: boolean;
}

export interface TicketDraft {
    content: string;
    timestamp: string;
    author: 'AI' | 'AGENT';
}

export interface Ticket {
    id: string;
    merchantId: string;
    customerId: string;
    subject: string;
    status: TicketStatus;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    messages: TicketMessage[];
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    channel?: 'EMAIL' | 'WHATSAPP' | 'INSTAGRAM' | 'SHOP';
    assignedTo?: string;
    isUnread?: boolean;
    draft?: TicketDraft;
}

export interface Address {
    name: string;
    street: string;
    city: string;
    zip: string;
    country: string;
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    ltv: number;
    orderCount: number;
    returnCount: number;
    since: string;
    isBlocked?: boolean;
    address?: Address;
}

export interface Agent {
    id: string;
    name: string;
    email: string;
    initials: string;
    avatar?: string;
    color?: string;
    activeSince?: string;
}

export interface OrderLineItem {
    id: string;
    productName: string;
    variant?: string;
    sku: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    imageUrl?: string;
}

export interface Order {
    id: string;
    customerId: string;
    date: string;
    status: OrderStatus;
    shippingStatus: 'SHIPPED' | 'DELIVERED' | 'PROCESSING';
    total: number;
    subtotal: number;
    discount: number;
    discountCode?: string;
    shippingCost: number;
    items: OrderLineItem[];
    trackingNumber?: string;
    shippingAddress: Address;
}

export interface ReturnItem {
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    reason: string;
    condition: string;
    price: number;
    imageUrl?: string;
}

export interface Return {
    id: string;
    orderId: string;
    customerId: string;
    status: ReturnStatus;
    createdAt: string;
    updatedAt: string;
    items: ReturnItem[];
    refundAmount: number;
    trackingNumber?: string;
    customerComment?: string;
}

export interface Organization {
    id: string;
    name: string;
    role: string;
    initials: string;
    color: string;
}

export interface SecurityLog {
    id: string;
    event: string;
    status: 'SUCCESS' | 'FAILED' | 'WARNING';
    user: string;
    ip: string;
    timestamp: string;
    location: string;
}

export interface IntegrationProvider {
    code: string;
    name: string;
    description: string;
    icon: React.ReactNode;
}
