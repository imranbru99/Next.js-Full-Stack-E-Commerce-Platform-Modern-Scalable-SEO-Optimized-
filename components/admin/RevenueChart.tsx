"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

export default function RevenueChart({ data, type = "daily" }: { data: any[], type?: "daily" | "monthly" }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === "daily" ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#000" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#000" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorRev)" 
            />
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} />
            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', fontWeight: 900 }}/>
            <Bar dataKey="revenue" fill="#000" radius={[10, 10, 0, 0]} barSize={40} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}