
import React from 'react';
import { Transaction, FinancialSummary } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { CATEGORIES } from '../constants';

interface Props {
  transactions: Transaction[];
  summary: FinancialSummary;
}

const Dashboard: React.FC<Props> = ({ transactions, summary }) => {
  // Prep data for category chart
  const categoryData = CATEGORIES.map(cat => {
    const total = transactions
      .filter(t => t.category === cat.name && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: cat.name, value: total, color: cat.color };
  }).filter(c => c.value > 0);

  // Prep data for monthly overview (simplified as recent transactions)
  const recentData = transactions.slice(-10).map(t => ({
    name: t.description.substring(0, 10),
    amount: t.amount,
    type: t.type
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fa-solid fa-wallet text-4xl text-indigo-600"></i>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Saldo Atual</p>
          <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
            {formatCurrency(summary.balance)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fa-solid fa-arrow-up text-4xl text-emerald-600"></i>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Receitas</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.income)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fa-solid fa-arrow-down text-4xl text-red-600"></i>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Despesas</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.expenses)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Gastos por Categoria</h3>
          <div className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} className={entry.color.replace('bg-', 'fill-')} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Sem despesas registradas ainda.
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                <span className="text-slate-600 truncate">{cat.name}: {formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Fluxo Recente</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)} 
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {recentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
