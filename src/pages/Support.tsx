import { MessageCircle, Mail, Phone, ArrowRight, ExternalLink } from 'lucide-react';

const SupportPage = () => {
 const whatsappNumber = '5551999999999'; // Número do WhatsApp do suporte
 const whatsappMessage = encodeURIComponent('Olá! Preciso de ajuda com o MotoristAI.');
 const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

 const emailAddress = 'suporte@motoristai.com.br';
 const emailSubject = encodeURIComponent('Preciso de ajuda - MotoristAI');
 const emailLink = `mailto:${emailAddress}?subject=${emailSubject}`;

 const handleWhatsAppClick = () => {
 window.open(whatsappLink, '_blank');
 };

 const handleEmailClick = () => {
 window.location.href = emailLink;
 };

 return (
 <div className="min-h-screen pb-24">
 {/* Header */}
 <div className="mb-8">
 <div className="flex items-center gap-3 mb-2">
 <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
 <MessageCircle className="w-6 h-6 text-white" />
 </div>
 <h1 className="text-2xl font-bold text-[var(--ios-text)]">
 Falar com o Suporte
 </h1>
 </div>
 <p className="text-[var(--ios-text-secondary)]">
 Estamos aqui para ajudar você!
 </p>
 </div>

 {/* Main Content */}
 <div className="space-y-4">
 {/* WhatsApp Card */}
 <button
 onClick={handleWhatsAppClick}
 className="w-full p-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 
 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40
 transform hover:scale-[1.02] transition-all duration-300"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 rounded-xl bg-[var(--ios-card)]/20">
 <MessageCircle className="w-7 h-7 text-white" />
 </div>
 <div className="text-left">
 <h3 className="text-lg font-bold text-white">
 WhatsApp
 </h3>
 <p className="text-white/80 text-sm">
 Resposta rápida • Atendimento humanizado
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span className="px-3 py-1 rounded-full bg-[var(--ios-card)]/20 text-white text-xs font-medium">
 Recomendado
 </span>
 <ArrowRight className="w-5 h-5 text-white" />
 </div>
 </div>
 </button>

 {/* Email Card */}
 <button
 onClick={handleEmailClick}
 className="w-full p-5 rounded-2xl bg-[var(--ios-card)] 
 border border-[var(--ios-separator)] 
 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600
 transform hover:scale-[1.01] transition-all duration-300"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 rounded-xl bg-blue-100 ">
 <Mail className="w-7 h-7 text-[var(--sys-blue)] " />
 </div>
 <div className="text-left">
 <h3 className="text-lg font-semibold text-[var(--ios-text)]">
 E-mail
 </h3>
 <p className="text-[var(--ios-text-secondary)] text-sm">
 {emailAddress}
 </p>
 </div>
 </div>
 <ExternalLink className="w-5 h-5 text-[var(--ios-text-tertiary)]" />
 </div>
 </button>

 {/* Phone Card */}
 <div className="p-5 rounded-2xl bg-[var(--ios-card)] 
 border border-[var(--ios-separator)] shadow-sm">
 <div className="flex items-center gap-4">
 <div className="p-3 rounded-xl bg-[rgba(175,82,222,0.12)] ">
 <Phone className="w-7 h-7 text-[var(--sys-purple)] " />
 </div>
 <div>
 <h3 className="text-lg font-semibold text-[var(--ios-text)]">
 Telefone
 </h3>
 <p className="text-[var(--ios-text-secondary)] text-sm">
 Em breve disponível
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Info Section */}
 <div className="mt-8 p-5 rounded-2xl bg-[var(--ios-fill)] 
 border border-[var(--ios-separator)]">
 <h4 className="font-semibold text-[var(--ios-text)] mb-3">
 🕐 Horário de Atendimento
 </h4>
 <div className="space-y-2 text-sm text-[var(--ios-text-secondary)] ">
 <p>
 <span className="font-medium">Segunda a Sexta:</span> 08:00 às 18:00
 </p>
 <p>
 <span className="font-medium">Sábado:</span> 09:00 às 13:00
 </p>
 <p className="text-[var(--ios-text-secondary)] text-xs mt-3">
 * Mensagens enviadas fora do horário serão respondidas no próximo dia útil.
 </p>
 </div>
 </div>

 {/* FAQ Link */}
 <div className="mt-6 p-4 rounded-2xl bg-[var(--ios-fill)] 
 border border-[var(--ios-separator)] ">
 <p className="text-center text-sm text-[var(--sys-green)] ">
 💡 Confira também nossas <a href="/faq" className="font-semibold underline hover:no-underline">Perguntas Frequentes</a> para respostas rápidas!
 </p>
 </div>
 </div>
 );
};

export default SupportPage;
