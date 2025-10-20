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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleNavigate('/entradas/nova')}
            className="flex flex-col items-center justify-center p-6 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <DollarSign className="h-8 w-8 mb-2" />
            <span className="font-medium">Nova Entrada</span>
          </button>
          <button
            onClick={() => handleNavigate('/despesas/nova')}
            className="flex flex-col items-center justify-center p-6 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <Wallet className="h-8 w-8 mb-2" />
            <span className="font-medium">Nova Despesa</span>
          </button>
          <button
            onClick={() => handleNavigate('/metas/nova')}
            className="flex flex-col items-center justify-center p-6 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <Target className="h-8 w-8 mb-2" />
            <span className="font-medium">Nova Meta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChoiceModal;
