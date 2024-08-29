import { Modal, Input, Button, message } from 'antd';
import { useState } from 'react';
import { Tema } from '@/pages/home';
import { useAuth } from '@/context';

interface TemaDetalhes {
    open: boolean;
    onCancel: () => void;
    tema: Tema | null; 
    onTemaEditado: (temaEditado: Tema) => void;
}

const ModalDetalhesTema: React.FC<TemaDetalhes> = ({ open, onCancel, tema, onTemaEditado }) => {
    const [temaEditado, setTemaEditado] = useState<string>('');
    const [descricaoEditada, setDescricaoEditada] = useState<string>('');
    const { tipoUsuario } = useAuth(); 

    const handleEditarTema = async () => {
        try {
            if (tema && (descricaoEditada !== '' || temaEditado !== '')) {
                const response = await fetch(`http://localhost:5000/temas/${tema.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        tema: temaEditado !== '' ? temaEditado : tema.tema, 
                        descricao: descricaoEditada !== '' ? descricaoEditada : tema.descricao,
                        nome_professor: tema.nome_professor
                     })
                });
                if (response.ok) {
                    message.success('Tema atualizado com sucesso!');
                    onCancel();
                    onTemaEditado({
                        ...tema,
                        tema: temaEditado !== '' ? temaEditado : tema.tema,
                        descricao: descricaoEditada !== '' ? descricaoEditada : tema.descricao
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar o tema:', error);
            message.error('Erro ao atualizar o tema. Por favor, tente novamente.');
        }
    };

    return (
        <Modal
            title= {tipoUsuario === 'aluno' ? 'Detalhes do Tema' : 'Editar Tema'}
            open={open}
            onCancel={onCancel}
            footer={null}
        >

            {tema && tipoUsuario === 'aluno' ? (
                <div>
                    <p><b>Professor</b>: {tema.nome_professor}</p>
                    <p><b>Tema</b>: {tema.tema}</p>
                    <p><b>Descrição</b>: {tema.descricao}</p>
                </div>
            ) : tema && (
                <div>
                    <label style={{marginBottom: '10px'}}><b>Professor</b>:</label>
                    <Input style={{marginBottom: '10px'}} value={tema.nome_professor} disabled />
                    <label style={{marginBottom: '10px'}}><b>Tema</b>:</label>
                    <Input style={{marginBottom: '10px'}} defaultValue={tema.tema} onChange={(e) => setTemaEditado(e.target.value)} />
                    <label style={{marginBottom: '10px'}}><b>Descrição</b>:</label>
                    <Input.TextArea style={{marginBottom: '10px'}} defaultValue={tema.descricao} onChange={(e) => setDescricaoEditada(e.target.value)} />
                    <Button onClick={handleEditarTema}>Editar</Button>
                </div>
            )}
        </Modal>
    );
};

export default ModalDetalhesTema;