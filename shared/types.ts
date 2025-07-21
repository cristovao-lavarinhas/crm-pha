// Tipos compartilhados entre frontend e backend
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  farmaciaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  FARMACEUTICO = 'FARMACEUTICO',
  VENDEDOR = 'VENDEDOR',
  GERENTE = 'GERENTE'
}

export interface Farmacia {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  responsavelTecnico: string;
  crf: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  codigoEan: string;
  principioAtivo: string;
  concentracao: string;
  forma: string;
  apresentacao: string;
  laboratorio: string;
  categoria: string;
  preco: number;
  prescricaoObrigatoria: boolean;
  controlado: boolean;
  generico: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Estoque {
  id: string;
  produtoId: string;
  farmaciaId: string;
  lote: string;
  quantidade: number;
  quantidadeMinima: number;
  dataVencimento: Date;
  precoCompra: number;
  precoVenda: number;
  produto?: Produto;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cliente {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  dataNascimento?: Date;
  farmaciaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Venda {
  id: string;
  farmaciaId: string;
  clienteId?: string;
  vendedorId: string;
  total: number;
  desconto: number;
  formaPagamento: FormaPagamento;
  status: StatusVenda;
  observacoes?: string;
  itens: ItemVenda[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemVenda {
  id: string;
  vendaId: string;
  produtoId: string;
  estoqueId: string;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  produto?: Produto;
}

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  PIX = 'PIX',
  CONVENIO = 'CONVENIO'
}

export enum StatusVenda {
  PENDENTE = 'PENDENTE',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA'
}

export interface DashboardData {
  vendas: {
    hoje: number;
    mes: number;
    variacao: number;
  };
  produtos: {
    total: number;
    vencendoEm30Dias: number;
    estoquebaixo: number;
  };
  clientes: {
    total: number;
    novosNoMes: number;
  };
  receita: {
    hoje: number;
    mes: number;
    variacao: number;
  };
}

// DTOs para API
export interface CreateProdutoDto {
  nome: string;
  descricao?: string;
  codigoEan: string;
  principioAtivo: string;
  concentracao: string;
  forma: string;
  apresentacao: string;
  laboratorio: string;
  categoria: string;
  preco: number;
  prescricaoObrigatoria: boolean;
  controlado: boolean;
  generico: boolean;
}

export interface CreateEstoqueDto {
  produtoId: string;
  lote: string;
  quantidade: number;
  quantidadeMinima: number;
  dataVencimento: Date;
  precoCompra: number;
  precoVenda: number;
}

export interface CreateVendaDto {
  clienteId?: string;
  vendedorId: string;
  formaPagamento: FormaPagamento;
  observacoes?: string;
  itens: {
    produtoId: string;
    estoqueId: string;
    quantidade: number;
    precoUnitario: number;
    desconto: number;
  }[];
}

// Respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
