
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, FinancialSummary } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import AIConsultant from './components/AIConsultant';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('financia_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('financia_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const summary: FinancialSummary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [...prev, tx]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-coins text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Financia AI</h1>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest leading-none">Smart Control</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Saldo Total</p>
              <p className={`text-lg font-bold ${summary.balance >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.balance)}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <i className="fa-solid fa-user"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column - Form & AI Insights */}
          <div className="xl:col-span-4 space-y-8">
            <TransactionForm onAdd={addTransaction} />
            <div className="hidden xl:block h-[400px]">
              <AIConsultant transactions={transactions} />
            </div>
          </div>

          {/* Right Column - Dashboard & List */}
          <div className="xl:col-span-8 space-y-8">
            <Dashboard transactions={transactions} summary={summary} />
            
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 h-[600px]">
              <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            </div>

            {/* Mobile Consultant (only shows on small screens when needed) */}
            <div className="xl:hidden">
               <AIConsultant transactions={transactions} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-200 mt-auto">
        <p>&copy; {new Date().getFullYear()} Financia AI. Desenvolvido com Gemini 3.</p>
      </footer>
    </div>
  );
};

export default App;
