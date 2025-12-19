
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
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
            <div className="bg-white border-b border-gray-100">
                <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                    <Avatar fallback={customer.firstName[0] + customer.lastName[0]} className="bg-amber-100 text-amber-700" />
                    <div>
                        <h3 className="font-semibold text-gray-900">{customer.firstName} {customer.lastName}</h3>
                        <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">Active Customer</span>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400 mt-0.5" />
                            <span>{customer.address.city}, {customer.address.country}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-gray-50 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400">Lifetime Value</div>
                            <div className="font-semibold text-gray-900">€{customer.ltv}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400">Orders</div>
                            <div className="font-semibold text-gray-900">{customer.orderCount}</div>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50 h-8">Block User</Button>
                    <Button variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50 h-8">Block User</Button>
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
