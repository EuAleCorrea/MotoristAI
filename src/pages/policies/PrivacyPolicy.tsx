import { Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
 return (
 <div className="min-h-screen pb-24">
 {/* Header */}
 <div className="mb-8">
 <div className="flex items-center gap-3 mb-2">
 <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
 <Shield className="w-6 h-6 text-white" />
 </div>
 <h1 className="text-2xl font-bold text-[var(--ios-text)]">
 Política de Privacidade
 </h1>
 </div>
 <p className="text-[var(--ios-text-secondary)] text-sm">
 Última atualização: Janeiro de 2026
 </p>
 </div>

 {/* Content */}
 <div className="space-y-6">
 <section className="bg-[var(--ios-card)] rounded-2xl p-6 border border-[var(--ios-separator)] ">
 <h2 className="text-lg font-bold text-[var(--ios-text)] mb-3">
 1. Introdução
 </h2>
 <p className="text-[var(--ios-text-secondary)] leading-relaxed">
 A MotoristAI está comprometida em proteger sua privacidade. Esta Política de Privacidade
 explica como coletamos, usamos, divulgamos e protegemos suas informações quando você
 utiliza nosso aplicativo de gestão financeira para motoristas de aplicativo.
 </p>
 </section>

 <section className="bg-[var(--ios-card)] rounded-2xl p-6 border border-[var(--ios-separator)] ">
 <h2 className="text-lg font-bold text-[var(--ios-text)] mb-3">
 2. Informações que Coletamos
 </h2>
 <div className="space-y-3 text-[var(--ios-text-secondary)] leading-relaxed">
 <p><strong>Dados Pessoais:</strong> Nome, e-mail, telefone e informações de login.</p>
 <p><strong>Dados Financeiros:</strong> Registros de receitas, despesas, metas e informações de veículos.</p>
 <p><strong>Dados de Uso:</strong> Informações sobre como você interage com o aplicativo.</p>
 <p><strong>Dados do Dispositivo:</strong> Tipo de dispositivo, sistema operacional e identificadores únicos.</p>
 </div>
 </section>

 <section className="bg-[var(--ios-card)] rounded-2xl p-6 border border-[var(--ios-separator)] ">
 <h2 className="text-lg font-bold text-[var(--ios-text)] mb-3">
 3. Como Usamos suas Informações
 </h2>
 <ul className="list-disc list-inside space-y-2 text-[var(--ios-text-secondary)] leading-relaxed">
 <li>Fornecer e manter nossos serviços</li>
 <li>Personalizar sua experiência no aplicativo</li>
 <li>Processar transações e enviar notificações relacionadas</li>
 <li>Melhorar nossos serviços através de análises</li>
 <li>Comunicar atualizações e ofertas relevantes</li>
 <li>Garantir a segurança e prevenir fraudes</li>
 </ul>
 </section>

 <section className="bg-[var(--ios-card)] rounded-2xl p-6 border border-[var(--ios-separator)] ">
 <h2 className="text-lg font-bold text-[var(--ios-text)] mb-3">
 4. Compartilhamento de Dados
 </h2>
 <p className="text-[var(--ios-text-secondary)] leading-relaxed mb-3">
 Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com:
 </p>
 <ul className="list-disc list-inside space-y-2 text-[var(--ios-text-secondary)] leading-relaxed">
 <li>Prestadores de serviços essenciais para operação do app</li>
 <li>Autoridades legais quando exigido por lei</li>
 <li>Parceiros de negócios com seu consentimento explícito</li>
 </ul>
 </section>

 <section className="bg-[var(--ios-card)] rounded-2xl p-6 border border-[var(--ios-separator)] ">
 <h2 className="text-lg font-bold text-[var(--ios-text)] mb-3">
 5. Segurança dos Dados
 </h2>
 <p className="text-[var(--ios-text-secondary)] leading-relaxed">
 Implementamos medidas de segurança técnicas e organizacionais para proteger suas
 informações, incluindo criptografia de dados, servidores seguros e controles de
 acesso rigorosos. No entanto, nenhum método de transmissão pela Internet é 100% seguro.
 </p>
 </section>

 <section className="bg-[var(--ios-card)] rounded-2xl p-6 border border-[var(--ios-separator)] ">
 <h2 className="text-lg font-bold text-[var(--ios-text)] mb-3">
 6. Seus Direitos
 </h2>
 <p className="text-[var(--ios-text-secondary)] leading-relaxed mb-3">
 Você tem direito a:
 </p>
 <ul className="list-disc list-inside space-y-2 text-[var(--ios-text-secondary)] leading-relaxed">
 <li>Acessar seus dados pessoais</li>
 <li>Corrigir dados incorretos</li>
 <li>Solicitar a exclusão de seus dados</li>
 <li>Exportar seus dados</li>
 <li>Revogar consentimentos dados anteriormente</li>
 </ul>
 </section>

 <section className="bg-[var(--ios-card)] rounded-2xl p-6 border border-[var(--ios-separator)] ">
 <h2 className="text-lg font-bold text-[var(--ios-text)] mb-3">
 7. Contato
 </h2>
 <p className="text-[var(--ios-text-secondary)] leading-relaxed">
 Para questões sobre esta política ou exercer seus direitos, entre em contato:
 </p>
 <div className="mt-3 p-4 bg-[var(--ios-bg)] rounded-xl">
 <p className="text-[var(--ios-text)] ">
 <strong>E-mail:</strong> privacidade@motoristai.com.br
 </p>
 </div>
 </section>
 </div>
 </div>
 );
};

export default PrivacyPolicyPage;
