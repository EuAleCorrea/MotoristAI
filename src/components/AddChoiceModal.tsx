import { DollarSign, Wallet, X, Target } from 'lucide-react';
import { useModalStore } from '../store/modalStore';
import { useNavigate } from 'react-router-dom';

const AddChoiceModal = () => {
    const { closeModal } = useModalStore();
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
        closeModal();
    };

    const actions = [
        {
            label: 'Nova Entrada',
            path: '/entradas/nova',
            icon: DollarSign,
            description: 'Registrar um ganho ou receita',
            bg: 'rgba(52, 199, 89, 0.12)',
            fg: 'var(--sys-green)',
            id: 'action-new-income',
        },
        {
            label: 'Nova Despesa',
            path: '/despesas/nova',
            icon: Wallet,
            description: 'Registrar um gasto',
            bg: 'rgba(255, 59, 48, 0.12)',
            fg: 'var(--sys-red)',
            id: 'action-new-expense',
        },
        {
            label: 'Nova Meta',
            path: '/metas/nova',
            icon: Target,
            description: 'Definir uma meta de faturamento',
            bg: 'rgba(255, 149, 0, 0.12)',
            fg: 'var(--sys-orange)',
            id: 'action-new-goal',
        },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
            style={{ background: 'rgba(0, 0, 0, 0.32)' }}
            onClick={closeModal}
        >
            <div
                className="w-full max-w-lg animate-sheet-up pb-safe"
                style={{
                    backgroundColor: 'var(--ios-card)',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-9 h-1 rounded-full" style={{ backgroundColor: 'var(--ios-text-tertiary)', opacity: 0.3 }} />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-3">
                    <h2 className="text-ios-title3 font-semibold" style={{ color: 'var(--ios-text)', letterSpacing: '-0.43px' }}>
                        Adicionar
                    </h2>
                    <button
                        id="add-choice-close-btn"
                        onClick={closeModal}
                        className="w-11 h-11 flex items-center justify-center rounded-full"
                        style={{ color: 'var(--ios-text-tertiary)' }}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Action list */}
                <div className="px-4 pb-6 space-y-2">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            id={action.id}
                            onClick={() => handleNavigate(action.path)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl active:opacity-70 transition-opacity duration-100"
                            style={{ backgroundColor: 'var(--ios-fill)' }}
                        >
                            <div
                                className="flex items-center justify-center w-11 h-11 rounded-ios flex-shrink-0"
                                style={{ background: action.bg }}
                            >
                                <action.icon className="h-5 w-5" style={{ color: action.fg }} />
                            </div>
                            <div className="text-left min-w-0">
                                <p className="text-ios-body font-medium truncate" style={{ color: 'var(--ios-text)', letterSpacing: '-0.43px' }}>
                                    {action.label}
                                </p>
                                <p className="text-ios-caption1 truncate" style={{ color: 'var(--ios-text-secondary)' }}>
                                    {action.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddChoiceModal;
