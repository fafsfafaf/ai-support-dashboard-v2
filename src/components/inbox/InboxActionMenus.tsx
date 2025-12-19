
import React from 'react';
import { Agent, TicketStatus } from '@/types';

export const AssigneeMenu = ({ agents, currentAssigneeId, onAssign, onAddAgent, onClose }: any) => {
    return (
        <div className="bg-white border text-xs shadow-lg rounded-lg p-2 min-w-[200px]">
            <div className="px-2 py-1 text-gray-500 font-bold">Assign to...</div>
            {agents?.map((agent: Agent) => (
                <button
                    key={agent.id}
                    onClick={() => onAssign(agent.id)}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                >
                    {agent.name}
                </button>
            ))}
            <button onClick={() => onAssign(null)} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-500">Unassign</button>
        </div>
    );
};

export const SortMenu = ({ currentSort, onSortChange, onClose }: any) => {
    return (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">Sort by</div>
            <button onClick={() => onSortChange('DATE_DESC')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50">Newest first</button>
            <button onClick={() => onSortChange('DATE_ASC')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50">Oldest first</button>
        </div>
    );
};

export const FilterMenu = ({ activeStatus, onStatusChange, onClose }: any) => {
    return (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase">Filter</div>
            <button onClick={() => onStatusChange(null)} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50">All Statuses</button>
            <button onClick={() => onStatusChange('open')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50">Open</button>
            <button onClick={() => onStatusChange('closed')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50">Closed</button>
        </div>
    );
};
