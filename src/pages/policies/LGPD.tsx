import { ShieldCheck, CheckCircle } from 'lucide-react';

const LGPDPage = () => {
    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        LGPD
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Lei Geral de Proteção de Dados • Lei nº 13.709/2018
                </p>
            </div>

            {/* Intro Banner */}
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20
                            border border-emerald-100 dark:border-emerald-800/30">
                <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    🛡️ O MotoristAI está em total conformidade com a Lei Geral de Proteção de Dados (LGPD).
                    Aqui você encontra informações sobre como protegemos seus dados e seus direitos como titular.
                </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        O que é a LGPD?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira que
                        regula as atividades de tratamento de dados pessoais. Ela estabelece regras sobre
                        coleta, armazenamento, tratamento e compartilhamento de dados pessoais, impondo
                        mais proteção e penalidades para o não cumprimento.
                    </p>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        Seus Direitos como Titular
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        A LGPD garante a você os seguintes direitos:
                    </p>
                    <div className="grid gap-3">
                        {[
                            { title: 'Confirmação', desc: 'Confirmar se seus dados estão sendo tratados' },
                            { title: 'Acesso', desc: 'Acessar todos os seus dados pessoais' },
                            { title: 'Correção', desc: 'Corrigir dados incompletos ou desatualizados' },
                            { title: 'Anonimização', desc: 'Solicitar anonimização de dados desnecessários' },
                            { title: 'Portabilidade', desc: 'Transferir seus dados para outro serviço' },
                            { title: 'Eliminação', desc: 'Solicitar a exclusão de seus dados pessoais' },
                            { title: 'Informação', desc: 'Saber com quem seus dados são compartilhados' },
                            { title: 'Revogação', desc: 'Revogar o consentimento a qualquer momento' },
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white">{item.title}:</span>
                                    <span className="text-gray-600 dark:text-gray-300 ml-1">{item.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        Bases Legais para Tratamento
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        O MotoristAI trata seus dados com base nas seguintes hipóteses legais:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li><strong>Consentimento:</strong> Quando você autoriza expressamente</li>
                        <li><strong>Execução de contrato:</strong> Para fornecer o serviço contratado</li>
                        <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços</li>
                        <li><strong>Cumprimento legal:</strong> Para atender obrigações legais</li>
                    </ul>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        Medidas de Segurança
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        Implementamos medidas técnicas e administrativas para proteger seus dados:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>Criptografia de dados em trânsito e em repouso</li>
                        <li>Controles de acesso rigorosos</li>
                        <li>Monitoramento contínuo de segurança</li>
                        <li>Backups regulares e seguros</li>
                        <li>Treinamento da equipe em proteção de dados</li>
                    </ul>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        Encarregado de Dados (DPO)
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Nosso Encarregado de Proteção de Dados está disponível para esclarecer dúvidas
                        e receber solicitações relacionadas aos seus direitos:
                    </p>
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Nome:</strong> Equipe de Proteção de Dados MotoristAI
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>E-mail:</strong> dpo@motoristai.com.br
                        </p>
                    </div>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        Como Exercer seus Direitos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        Para exercer qualquer um dos seus direitos previstos na LGPD:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>Entre em contato pelo e-mail <strong>dpo@motoristai.com.br</strong></li>
                        <li>Informe qual direito deseja exercer</li>
                        <li>Forneça informações para confirmar sua identidade</li>
                        <li>Aguarde nossa resposta em até 15 dias</li>
                    </ol>
                </section>
            </div>

            {/* Footer Note */}
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800
                            border border-gray-200 dark:border-gray-700">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    📋 Você também pode registrar reclamações junto à <strong>ANPD</strong> (Autoridade Nacional de Proteção de Dados)
                    em caso de violação de seus direitos.
                </p>
            </div>
        </div>
    );
};

export default LGPDPage;
