// components/AdminDashboard.jsx
import React from 'react';
import DashboardSidebar from '../../components/Admin/DashboardSidebar';
import DashboardHeader from '../../components/Admin/DashboardHeader';
import StatsOverview from '../../components/Admin/StatsOverview';
import ActivityFeed from '../../components/Admin/ActivityFeed';
import DepartmentChart from '../../components/Admin/DepartmentChart';
import PendingRequests from '../../components/Admin/PendingRequests';
import Footer from '../../components/Admin/Footer';

const AdminDashboard = () => {
  return (
    <div className="bg-background-light text-slate-900 overflow-hidden h-screen">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Top Navbar */}
          <DashboardHeader />
          
          {/* Dashboard Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto bg-background-light p-8">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
              {/* Stats Overview */}
              <StatsOverview />
              
              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-0">
                {/* Activity Feed (Left 2 Columns) */}
                <div className="lg:col-span-2">
                  <ActivityFeed />
                </div>
                
                {/* Right Column: Charts & Performance */}
                <div className="flex flex-col gap-6">
                  {/* Chart Card */}
                  <DepartmentChart />
                  
                  {/* Bottlenecks List */}
                  <PendingRequests />
                </div>
              </div>
              
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;