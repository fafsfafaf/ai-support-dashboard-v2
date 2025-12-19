
import React from 'react';
import { Customer, Order } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Mail, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface RightPanelProps {
    customer?: Customer;
    orders?: Order[];
}

export const RightPanel: React.FC<RightPanelProps> = ({ customer, orders }) => {
    if (!customer) return null;

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white">
            {/* Header: Avatar & Name */}
            <div className="p-6 pb-2 flex items-center gap-4">
                <Avatar
                    fallback={`${customer.firstName[0]}${customer.lastName[0]}`}
                    className="h-12 w-12 bg-[#D61F69] text-white text-lg font-medium"
                />
                <h2 className="text-lg font-bold text-gray-900">{customer.firstName} {customer.lastName}</h2>
            </div>

            {/* Kundeninfos Section */}
            <div className="px-6 py-4">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Kundeninfos</h3>
                <div className="border border-gray-200 rounded-2xl p-4 space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-900">{customer.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Lifetime Value</span>
                        <span className="font-medium text-gray-900">{customer.ltv} EUR</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Bestellungen</span>
                        <span className="font-medium text-gray-900">{customer.orderCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Kunde seit</span>
                        <span className="font-medium text-gray-900">{customer.since || '15.12.2025'}</span>
                    </div>
                </div>
            </div>

            <h3 className="font-semibold text-gray-900 text-sm pl-1">Recent Orders</h3>
            {orders && orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-100">
                        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <span className="font-medium text-sm">#{order.id}</span>
                            <span className="text-xs text-gray-400">{order.date}</span>
                        </div>
                        <div className="p-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded border capitalize",
                                    order.status === 'PAID' ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-100 text-gray-700"
                                )}>
                                    {order.status.toLowerCase()}
                                </span>
                                <span className="font-semibold text-sm">€{order.total}</span>
                            </div>
                            <div className="space-y-1">
                                {order.items.slice(0, 2).map((item, i) => (
                                    <div key={i} className="flex gap-2 items-center text-xs text-gray-600">
                                        <div className="h-6 w-6 bg-gray-200 rounded shrink-0" />
                                        <span className="truncate">{item.productName}</span>
                                        <span className="text-gray-400">x{item.quantity}</span>
                                    </div>
                                ))}
                                {order.items.length > 2 && <div className="text-xs text-gray-400 pl-8">+ {order.items.length - 2} more</div>}
                            </div>
                        </div>
                    </div>

                ))
            ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center text-gray-400 border border-gray-200 border-dashed bg-white">
                    <Package size={24} className="mb-2 opacity-50" />
                    <p className="text-sm">No orders found</p>
                </div>
            )}
        </div >
    );
};
