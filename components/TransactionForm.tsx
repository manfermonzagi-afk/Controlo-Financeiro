
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { parseNaturalLanguageTransaction } from '../services/geminiService';

interface Props {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<Props> = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [aiInput, setAiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      type,
      category,
    });

    setDescription('');
    setAmount('');
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsProcessing(true);
    const parsed = await parseNaturalLanguageTransaction(aiInput);
    if (parsed) {
      setDescription(parsed.description || '');
      setAmount(parsed.amount?.toString() || '');
      setType((parsed.type as TransactionType) || 'expense');
      setCategory(parsed.category || CATEGORIES[0].name);
      setShowAiInput(false);
      setAiInput('');
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Nova Transação</h2>
        <button 
          onClick={() => setShowAiInput(!showAiInput)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${showAiInput ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
        >
          {showAiInput ? 'Formulário Manual' : 'Usar IA (Texto)'}
        </button>
      </div>

      {showAiInput ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 italic">Diga algo como: "Gastei 50 reais no McDonald's hoje"</p>
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[100px]"
            placeholder="O que você comprou?"
          />
          <button
            onClick={handleAiParse}
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                Processando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Adicionar com IA
              </>
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ex: Supermercado"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-900 transition-colors shadow-lg shadow-slate-200"
          >
            Adicionar Transação
          </button>
        </form>
      )}
    </div>
  );
};

export default TransactionForm;
