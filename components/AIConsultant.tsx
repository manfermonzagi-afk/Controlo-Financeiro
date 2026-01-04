
import React, { useEffect, useState } from 'react';
import { Transaction, AIInsight } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface Props {
  transactions: Transaction[];
}

const AIConsultant: React.FC<Props> = ({ transactions }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const result = await getFinancialInsights(transactions);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch automatically if we don't have one or if it's the first render
    if (!insight && transactions.length > 0) {
      fetchInsight();
    }
  }, [transactions.length]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-[-20px] right-[-20px] opacity-10">
        <i className="fa-solid fa-brain text-9xl"></i>
      </div>

      <div className="relative flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fa-solid fa-sparkles text-sm"></i>
          </div>
          <h2 className="text-xl font-bold">Consultor Financia AI</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-white/70 animate-pulse">Analisando suas finanças...</p>
          </div>
        ) : insight ? (
          <div className="space-y-4">
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-white text-indigo-700`}>
              Prioridade {insight.priority}
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">{insight.title}</h3>
              <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                {insight.message}
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Sugestão</p>
              <p className="text-sm font-medium italic">"{insight.suggestion}"</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <p className="text-indigo-200 text-sm mb-4">Adicione transações para começar a receber conselhos inteligentes baseados nos seus gastos.</p>
          </div>
        )}
      </div>

      <button 
        onClick={fetchInsight}
        disabled={loading || transactions.length === 0}
        className="mt-6 w-full py-2 bg-white text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50"
      >
        Atualizar Insights
      </button>
    </div>
  );
};

export default AIConsultant;
