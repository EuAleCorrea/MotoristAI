import { ScrollText } from 'lucide-react';

const TermsOfUsePage = () => {
    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                        <ScrollText className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Termos de Uso
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Última atualização: Janeiro de 2026
                </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        1. Aceitação dos Termos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Ao acessar e usar o MotoristAI, você concorda em cumprir estes Termos de Uso.
                        Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
                        Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam
                        ou usam o serviço.
                    </p>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        2. Descrição do Serviço
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        O MotoristAI é uma plataforma de gestão financeira desenvolvida especificamente
                        para motoristas de aplicativo. O serviço permite o registro de receitas, despesas,
                        controle de metas e análise de performance financeira.
                    </p>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        3. Conta do Usuário
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>Você deve ter 18 anos ou mais para usar este serviço</li>
                        <li>Você é responsável por manter a confidencialidade de sua conta e senha</li>
                        <li>Você concorda em fornecer informações verdadeiras e precisas</li>
                        <li>Você é responsável por todas as atividades realizadas em sua conta</li>
                        <li>Você deve notificar imediatamente sobre qualquer uso não autorizado</li>
                    </ul>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        4. Uso Aceitável
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        Você concorda em não usar o serviço para:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>Violar qualquer lei ou regulamento aplicável</li>
                        <li>Transmitir material prejudicial, fraudulento ou enganoso</li>
                        <li>Interferir ou interromper o funcionamento do serviço</li>
                        <li>Tentar acessar sistemas ou redes sem autorização</li>
                        <li>Coletar informações de outros usuários sem consentimento</li>
                    </ul>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        5. Propriedade Intelectual
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        O serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão
                        propriedade exclusiva do MotoristAI. O serviço é protegido por direitos autorais,
                        marcas registradas e outras leis. Nossos logotipos e nomes comerciais não podem
                        ser usados sem consentimento prévio por escrito.
                    </p>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        6. Limitação de Responsabilidade
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        O MotoristAI não se responsabiliza por decisões financeiras tomadas com base nas
                        informações fornecidas pelo aplicativo. O serviço é uma ferramenta de auxílio e
                        não substitui aconselhamento financeiro profissional. Não garantimos que o serviço
                        será ininterrupto, seguro ou livre de erros.
                    </p>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        7. Modificações
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento.
                        Se uma revisão for significativa, tentaremos fornecer aviso com pelo menos 30 dias
                        de antecedência. O uso continuado do serviço após as alterações constitui aceitação
                        dos novos termos.
                    </p>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        8. Rescisão
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, por qualquer
                        motivo, incluindo violação destes Termos. Após a rescisão, seu direito de usar o
                        serviço cessará imediatamente.
                    </p>
                </section>

                <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        9. Contato
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Para questões sobre estes termos, entre em contato:
                    </p>
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>E-mail:</strong> juridico@motoristai.com.br
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TermsOfUsePage;
