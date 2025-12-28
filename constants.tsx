
import { Category, Account } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Salário', icon: 'payments', color: '#078838', type: 'INCOME' },
  { id: '2', name: 'Freelance', icon: 'work', color: '#137fec', type: 'INCOME' },
  { id: '3', name: 'Alimentação', icon: 'restaurant', color: '#f59e0b', type: 'EXPENSE' },
  { id: '3-1', name: 'Supermercado', icon: 'shopping_cart', color: '#f59e0b', type: 'EXPENSE', parentId: '3' },
  { id: '3-2', name: 'Restaurantes', icon: 'lunch_dining', color: '#f59e0b', type: 'EXPENSE', parentId: '3' },
  { id: '4', name: 'Transporte', icon: 'directions_car', color: '#3b82f6', type: 'EXPENSE' },
  { id: '4-1', name: 'Combustível', icon: 'local_gas_station', color: '#3b82f6', type: 'EXPENSE', parentId: '4' },
  { id: '4-2', name: 'Uber/App', icon: 'hail', color: '#3b82f6', type: 'EXPENSE', parentId: '4' },
  { id: '4-3', name: 'Oficina', icon: 'build', color: '#3b82f6', type: 'EXPENSE', parentId: '4' },
  { id: '5', name: 'Casa', icon: 'home', color: '#8b5cf6', type: 'EXPENSE' },
  { id: '5-1', name: 'Aluguel', icon: 'apartment', color: '#8b5cf6', type: 'EXPENSE', parentId: '5' },
  { id: '5-2', name: 'Luz', icon: 'lightbulb', color: '#eab308', type: 'EXPENSE', parentId: '5' },
  { id: '5-3', name: 'Água', icon: 'water_drop', color: '#3b82f6', type: 'EXPENSE', parentId: '5' },
  { id: '5-4', name: 'Internet', icon: 'wifi', color: '#8b5cf6', type: 'EXPENSE', parentId: '5' },
  { id: '5-5', name: 'Manutenção', icon: 'construction', color: '#8b5cf6', type: 'EXPENSE', parentId: '5' },
  { id: '6', name: 'Saúde', icon: 'health_and_safety', color: '#ef4444', type: 'EXPENSE' },
  { id: '6-1', name: 'Farmácia', icon: 'medication', color: '#ef4444', type: 'EXPENSE', parentId: '6' },
  { id: '6-2', name: 'Médico', icon: 'medical_services', color: '#ef4444', type: 'EXPENSE', parentId: '6' },
  { id: '7', name: 'Educação', icon: 'school', color: '#10b981', type: 'EXPENSE' },
  { id: '8', name: 'Lazer', icon: 'sports_esports', color: '#ec4899', type: 'EXPENSE' },
  { id: '9', name: 'Tecnologia', icon: 'computer', color: '#6366f1', type: 'EXPENSE' },
  { id: '10', name: 'Outros', icon: 'more_horiz', color: '#94a3b8', type: 'EXPENSE' },
];

export const MOCK_TRANSACTIONS: any[] = [
  { id: 'm1', description: 'Salário Mensal', amount: 5000, type: 'INCOME', categoryId: '1', accountId: 'a1', date: new Date().toISOString().split('T')[0], isFixed: true },
  { id: 'm2', description: 'Supermercado', amount: 450.50, type: 'EXPENSE', categoryId: '3-1', accountId: 'a1', date: new Date().toISOString().split('T')[0], isFixed: false },
  { id: 'm3', description: 'Gasolina', amount: 220, type: 'EXPENSE', categoryId: '4-1', accountId: 'a1', date: new Date().toISOString().split('T')[0], isFixed: false },
  { id: 'm4', description: 'Aluguel', amount: 1500, type: 'EXPENSE', categoryId: '5-1', accountId: 'a1', date: new Date().toISOString().split('T')[0], isFixed: true },
  { id: 'm5', description: 'Jantar', amount: 85.90, type: 'EXPENSE', categoryId: '3-2', accountId: 'a2', date: new Date().toISOString().split('T')[0], isFixed: false },
];

export const INSTITUTIONS = [
  { id: 'nubank', name: 'Nubank', color: '#820ad1', logo: '/banks/Bancos-em-SVG-main/Nu Pagamentos S.A/nubank-branco.svg' },
  { id: 'bb', name: 'Banco do Brasil', color: '#facc15', logo: '/banks/Bancos-em-SVG-main/Banco do Brasil S.A/banco-do-brasil-sem-fundo.svg' },
  { id: 'itau', name: 'Itaú', color: '#ec6d08', logo: '/banks/Bancos-em-SVG-main/Itaú Unibanco S.A/itau.svg' },
  { id: 'bradesco', name: 'Bradesco', color: '#cc092f', logo: '/banks/Bancos-em-SVG-main/Bradesco S.A/bradesco.svg' },
  { id: 'inter', name: 'Inter', color: '#ff7a00', logo: '/banks/Bancos-em-SVG-main/Banco Inter S.A/inter.svg' },
  { id: 'santander', name: 'Santander', color: '#cc0000', logo: '/banks/Bancos-em-SVG-main/Banco Santander Brasil S.A/banco-santander-logo.svg' },
  { id: 'caixa', name: 'Caixa Econômica', color: '#005ca9', logo: '/banks/Bancos-em-SVG-main/Caixa Econômica Federal/caixa-economica-federal-1.svg' },
  { id: 'c6', name: 'C6 Bank', color: '#242424', logo: '/banks/Bancos-em-SVG-main/Banco C6 S.A/c6 bank- branco.svg' },
  { id: 'picpay', name: 'PicPay', color: '#21c25e', logo: '/banks/Bancos-em-SVG-main/PicPay/Logo-PicPay.svg' },
  { id: 'neon', name: 'Neon', color: '#00d1ff', logo: '/banks/Bancos-em-SVG-main/Neon/header-logo-neon.svg' },
  { id: 'next', name: 'Next', color: '#00ab63', logo: '/banks/Bancos-em-SVG-main/Bradesco S.A/bradesco.svg' }, // Next é Bradesco (using Bradesco logo for now as placeholder or need specific)
  { id: 'original', name: 'Banco Original', color: '#00d664', logo: '/banks/Bancos-em-SVG-main/Banco Original S.A/Banco Original S.A.svg' }, // Need to check filename
  { id: 'sicoob', name: 'Sicoob', color: '#003641', logo: '/banks/Bancos-em-SVG-main/Sicoob/Sicoob.svg' }, // Checking defaults
  { id: 'sicredi', name: 'Sicredi', color: '#6ebe44', logo: '/banks/Bancos-em-SVG-main/Sicredi/Sicredi.svg' }, // Checking defaults
  { id: 'mercadopago', name: 'Mercado Pago', color: '#009ee3', logo: '/banks/Bancos-em-SVG-main/Mercado Pago/Mercado Pago.svg' },
  { id: 'xp', name: 'XP Investimentos', color: '#000000', logo: '/banks/Bancos-em-SVG-main/XP Investimentos/XP Investimentos.svg' },
  { id: 'btg', name: 'BTG Pactual', color: '#001e61', logo: '/banks/Bancos-em-SVG-main/Banco BTG Pacutal/Banco BTG Pacutal.svg' }, // Likely typo in folder name 'Pacutal'
  { id: 'pagseguro', name: 'PagBank', color: '#96c12e', logo: '/banks/Bancos-em-SVG-main/PagSeguro Internet S.A/PagSeguro Internet S.A.svg' },
  { id: 'outros', name: 'Outros', color: '#64748b', logo: '' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'a1', name: 'Carteira', type: 'WALLET', balance: 0, color: '#137fec', status: 'ACTIVE' },
  { id: 'a2', name: 'Nubank', type: 'BANK', balance: 0, color: '#8b5cf6', status: 'ACTIVE', institution: 'nubank' },
];

// Helper simplificado, pois agora a info está dentro de INSTITUTIONS
export const getBankMeta = (institutionId: string) => {
  const institution = INSTITUTIONS.find(i => i.id === institutionId);
  if (institution) {
    return {
      color: institution.color,
      logo: institution.logo
    };
  }
  return null;
};



export const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'USD', symbol: '$', name: 'Dólar Americano' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];
