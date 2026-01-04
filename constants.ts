
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', icon: 'fa-utensils', color: 'bg-orange-500' },
  { id: '2', name: 'Moradia', icon: 'fa-house', color: 'bg-blue-500' },
  { id: '3', name: 'Transporte', icon: 'fa-car', color: 'bg-purple-500' },
  { id: '4', name: 'Saúde', icon: 'fa-heart-pulse', color: 'bg-red-500' },
  { id: '5', name: 'Educação', icon: 'fa-graduation-cap', color: 'bg-emerald-500' },
  { id: '6', name: 'Lazer', icon: 'fa-clapperboard', color: 'bg-pink-500' },
  { id: '7', name: 'Trabalho', icon: 'fa-briefcase', color: 'bg-indigo-500' },
  { id: '8', name: 'Outros', icon: 'fa-tags', color: 'bg-gray-500' },
];

export const INITIAL_TRANSACTIONS = [
  { id: '1', description: 'Salário Mensal', amount: 5000, date: new Date().toISOString(), category: 'Trabalho', type: 'income' },
  { id: '2', description: 'Aluguel', amount: 1500, date: new Date().toISOString(), category: 'Moradia', type: 'expense' },
  { id: '3', description: 'Supermercado', amount: 450, date: new Date().toISOString(), category: 'Alimentação', type: 'expense' },
];
