// components/ActivityFeed.jsx
import React from 'react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      user: 'Dr. Emily Chen',
      action: 'requested 50x N95 Masks',
      time: '2 mins ago',
      reqId: 'REQ-4092',
      department: 'ICU Department',
      priority: 'High Priority',
      priorityColor: 'bg-blue-50 text-blue-700 border-blue-100',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyhkIyEcONWjstcoluyqw8kupMX3OsrvVPCy6x64780A95n9VvRTJHVFhsAuhv4W2IOEI2if1gpwdL8lZW6z28I_5lnvJybuua7uke-lo3CzysjnQ85K-u1UGuS17LDdJjKLd-sqvGtpbWlkbl_dp-a2sY33wvM1pHRjTRHx__DcPp5AKGE2NL-8WuE1XjMFgDdv5gzDZPk76tNyEOAiYwU-fvVT5E0ij7YTo7DxtGut1ahByuVgjiKnSW0gHq9-dfxhEJXaxySxz3',
      status: 'pending',
      statusIcon: 'circle',
      statusColor: 'bg-blue-100 border-primary'
    },
    {
      id: 2,
      user: 'Mark Wilson',
      action: 'approved request',
      time: '15 mins ago',
      reqId: 'REQ-4029',
      department: 'Pediatrics',
      priority: 'Standard',
      priorityColor: 'bg-slate-100 text-slate-700',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9fIwq1KLd2Z3MDfD1lcVNIuBk8Azf_QW8X9rxC0bs4IAJJd7i6Z-auqadK2eXvqz0Is7iTZmcL31dE6JanXdQIa7-vW4lRcUGUhhzzFFLqV9tgBwcXQYg-aYk6q7rNGpu3F8bYxN7CkPFfhmHlGfniuFGqgzSE0XnTpim3AdgEO9a-h_Zb7Mi_lv75b-dfbe8tUxphqFslicjNs8VXyS-GDrNpGRT5WWfB1VXSPDigjwU9Eh-6yCJebj87RJgZiz4VbObC-Lfl-KX',
      status: 'approved',
      statusIcon: 'check',
      statusColor: 'bg-emerald-100 border-emerald-500',
      comment: '"Stock verified. Delivery scheduled for tomorrow morning."'
    },
    {
      id: 3,
      user: 'Pharmacy System',
      action: 'flagged stock shortage',
      time: '1 hour ago',
      reqId: '',
      department: '',
      priority: '',
      priorityColor: '',
      avatar: '',
      status: 'warning',
      statusIcon: 'priority_high',
      statusColor: 'bg-orange-100 border-orange-500',
      message: 'Low inventory warning for <span class="font-semibold text-slate-900">Insulin Glargine</span>. Only 5 units remaining.',
      button: 'Place Restock Order'
    },
    {
      id: 4,
      user: 'John Doe',
      action: 'commented on REQ-3991',
      time: '3 hours ago',
      reqId: 'REQ-3991',
      department: '',
      priority: '',
      priorityColor: '',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw9r4jfEZOu7K6UIW0oRIs_9c7Y38cDEwGLkg_FHiBjR4owy8smqycsZLa42yjAam7J-lrPBEpI4w_2VTAq3AHl326sbvqZA4UYHSCMlvGpTR2UE8z91SVGsKKRWmVJYBBMTDTwd5glEAsxbLAlZZoysELdIGRVanKNgOMos6rb2bY9HzpJkMwhNf6QHDoqXNdFa-OHQJDHmNhpaB5ake6a7Uo5aESmcbyLaBIrY5IQNkmg8_4e0SMxN5W5v3uJZ-S0BPGXxXN8Nm-',
      status: 'default',
      statusIcon: 'circle',
      statusColor: 'bg-slate-100 border-slate-300',
      comment: '"When can we expect the new gloves shipment? We are running low."'
    }
  ];

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm h-full">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Activity Feed
        </h3>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            All Activities
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-colors">
            Urgent
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-colors">
            My Dept
          </button>
        </div>
      </div>
      
      <div className="p-6 overflow-y-auto max-h-[600px]">
        {/* Timeline Container */}
        <div className="relative pl-4 sm:pl-8 border-l border-slate-200 space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="relative">
              {/* Status Indicator */}
              <div className={`absolute -left-[41px] top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${activity.statusColor}`}>
                {activity.statusIcon === 'check' ? (
                  <span className="material-symbols-outlined text-[12px] text-emerald-700 font-bold">check</span>
                ) : activity.statusIcon === 'priority_high' ? (
                  <span className="material-symbols-outlined text-[12px] text-orange-700 font-bold">priority_high</span>
                ) : (
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === 'pending' ? 'bg-primary' : 'bg-slate-400'
                  }`}></div>
                )}
              </div>
              
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {activity.avatar ? (
                  <div 
                    className="size-10 rounded-full bg-slate-200 flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${activity.avatar})` }}
                  ></div>
                ) : (
                  <div className="size-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                    PH
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.user} <span className="text-slate-500 font-normal">{activity.action}</span>
                    </p>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                  
                  {/* Requisition Info */}
                  {activity.reqId && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activity.priorityColor}`}>
                        {activity.reqId}
                      </span>
                      {activity.department && activity.priority && (
                        <span className="text-xs text-slate-500">
                          {activity.department} • {activity.priority}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Message/Content */}
                  {activity.message && (
                    <div 
                      className="text-sm text-slate-600 mt-1"
                      dangerouslySetInnerHTML={{ __html: activity.message }}
                    />
                  )}
                  
                  {activity.comment && (
                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600 italic">
                      {activity.comment}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="mt-2 flex gap-2">
                    {activity.id === 1 && (
                      <>
                        <button className="text-xs text-primary hover:text-primary/80 font-medium">
                          Approve
                        </button>
                        <span className="text-slate-300">•</span>
                        <button className="text-xs text-slate-500 hover:text-slate-700 font-medium">
                          View Details
                        </button>
                      </>
                    )}
                    
                    {activity.button && (
                      <button className="text-xs bg-white border border-slate-300 px-2 py-1 rounded shadow-sm hover:bg-slate-50 transition-colors">
                        {activity.button}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button className="text-sm text-primary font-medium hover:underline">
            View Older Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;