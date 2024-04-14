import { Modal } from 'antd';
import { Tema } from '@/pages/home';

interface TemaDetalhes {
    open: boolean;
    onCancel: () => void;
    tema: Tema | null; // Assumindo que o tipo Tema é definido e pode ser nulo
}

const ModalDetalhesTema: React.FC<TemaDetalhes> = ({ open, onCancel, tema }) => {
    return (
        <Modal
            title="Detalhes do Tema"
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            {/* Exibindo informações do tema selecionado, se existir */}
            {tema && (
                <div>
                    <p><b>Professor</b>: {tema.nome_professor}</p>
                    <p><b>Tema</b>: {tema.tema}</p>
                    <p><b>Descrição</b>: {tema.descricao}</p>
                </div>
            )}
        </Modal>
    );
};

export default ModalDetalhesTema;
