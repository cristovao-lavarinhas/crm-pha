import Link from "next/link";
import { 
  HeartPulseIcon, 
  BarChart3Icon, 
  UsersIcon, 
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <HeartPulseIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">CRM Farmacêutico</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/produtos" className="text-gray-700 hover:text-blue-600 transition-colors">
                Produtos
              </Link>
              <Link href="/vendas" className="text-gray-700 hover:text-blue-600 transition-colors">
                Vendas
              </Link>
              <Link href="/clientes" className="text-gray-700 hover:text-blue-600 transition-colors">
                Clientes
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema CRM para Farmácias
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gerencie sua farmácia com eficiência: controle de estoque, vendas, 
            clientes e relatórios inteligentes em uma única plataforma.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <PackageIcon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gestão de Estoque
            </h3>
            <p className="text-gray-600">
              Controle completo do estoque com alertas de validade, 
              lotes e quantidades mínimas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <ShoppingCartIcon className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sistema de Vendas
            </h3>
            <p className="text-gray-600">
              PDV integrado com múltiplas formas de pagamento e 
              emissão automática de cupons.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <UsersIcon className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gestão de Clientes
            </h3>
            <p className="text-gray-600">
              Cadastro completo de clientes com histórico de compras 
              e perfil de consumo.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <BarChart3Icon className="h-12 w-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Relatórios e Analytics
            </h3>
            <p className="text-gray-600">
              Dashboards com métricas em tempo real e 
              relatórios personalizáveis para tomada de decisão.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <TrendingUpIcon className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Inteligência Artificial
            </h3>
            <p className="text-gray-600">
              Previsão de demanda, recomendações de compra e 
              insights automáticos para seu negócio.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <HeartPulseIcon className="h-12 w-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Compliance Farmacêutico
            </h3>
            <p className="text-gray-600">
              Atende todas as regulamentações do setor farmacêutico 
              com segurança e auditoria completa.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Pronto para revolucionar sua farmácia?
          </h3>
          <p className="text-blue-100 mb-6">
            Comece hoje mesmo com nossa plataforma completa de gestão farmacêutica.
          </p>
          <Link 
            href="/dashboard"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Começar Agora
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HeartPulseIcon className="h-6 w-6" />
              <span className="font-semibold">CRM Farmacêutico</span>
            </div>
            <p className="text-gray-400">
              © 2025 CRM Farmacêutico. Desenvolvido com ❤️ para o setor farmacêutico.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
