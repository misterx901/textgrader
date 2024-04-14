import { Tabs, Button, Modal, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '../context';
import CustomTable from '../components/customTable';
import ModalDetalhesTema from '@/components/modalDetalhesTema';

const { TabPane } = Tabs;

export interface Tema {
    id_tema: string;
    nome_professor: string;
    tema: string;
    descricao: string;
}

const Home = () => {
    const [activeKey, setActiveKey] = useState<string>('1');
    const [temasData, setTemasData] = useState<Tema[]>([]); 
    const [redacoesData, setRedacoesData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTema, setSelectedTema] = useState<Tema | null>(null);
    const { isLoggedIn, tipoUsuario } = useAuth(); 

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

    const openModal = (tema: any) => {
        setSelectedTema(tema);
        setModalVisible(true);
    };

    useEffect(() => {
        const fetchTemas = async () => {
            try {
                const response = await fetch('http://localhost:5000/temas');
                const data = await response.json();
                setTemasData(data);
            } catch (error) {
                console.error('Erro ao buscar os temas:', error);
            }
        };

        fetchTemas();
    }, []);

    useEffect(() => {
        const fetchRedacoes = async () => {
            try {
                const response = await fetch('http://localhost:5000/redacoes');
                const data = await response.json();
                setRedacoesData(data);
            } catch (error) {
                console.error('Erro ao buscar as redações:', error);
            }
        };

        fetchRedacoes();
    }, []);

    const deleteTema = () => {
        console.log('tema deletado')
    }

    const temasColumns = [
        { title: 'Professor', dataIndex: 'nome_professor', key: 'nome_professor', ellipsis: true },
        { 
            title: 'Tema', 
            dataIndex: 'tema', 
            key: 'tema', 
            render: (text: string, record: Tema) => 
                <Tooltip title="Ver detalhes do tema">
                    <Button type="link" onClick={() => openModal(record)}>{text}</Button>
                </Tooltip>, ellipsis: true 
        },
        { title: 'Descrição', dataIndex: 'descricao', key: 'descricao', ellipsis: true },
        {
            title: 'Ações',
            key: 'acoes',
            render: () => (
                tipoUsuario === 'professor' ? (
                    <Button type="link" onClick={deleteTema} danger icon={<DeleteOutlined />} />
                ) : 
                (
                    <Link href={`/redacao`}>
                        <PlusOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
                        Inserir Nova Redação
                    </Link>
                )
            ),
        },
    ];

    const redacaoColumns = [
        { title: 'Título', dataIndex: 'titulo_redacao', key: 'titulo_redacao', ellipsis: true },
        { title: 'Nota 1', dataIndex: 'nota1', key: 'nota1', align: 'center', ellipsis: true },
        { title: 'Nota 2', dataIndex: 'nota2', key: 'nota2', align: 'center', ellipsis: true },
        { title: 'Nota 3', dataIndex: 'nota3', key: 'nota3', align: 'center', ellipsis: true },
        { title: 'Nota 4', dataIndex: 'nota4', key: 'nota4', align: 'center', ellipsis: true },
        { title: 'Nota 5', dataIndex: 'nota5', key: 'nota5', align: 'center', ellipsis: true },
        { title: 'Nota Professor', dataIndex: 'nota_professor', key: 'nota_professor', align: 'center', ellipsis: true },
    ];

    return (
        <div style={{ padding: '0 20px 0 20px', width: '100vw' }}>
                <Tabs activeKey={activeKey} onChange={handleTabChange} style={{ flex: 1 }}>
                    <TabPane tab="Temas" key="1">
                        {tipoUsuario === 'professor' && (
                        <div style={{ margin: '20px 0px 20px 0px' }}>
                            <Link href="/tema">
                                <PlusOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
                                Adicionar Tema
                            </Link>
                        </div>
                        )}
                        {isLoggedIn &&
                            <CustomTable
                                dataSource={temasData}
                                columns={temasColumns}
                            />
                        }
                    </TabPane>
                    <TabPane tab="Redações" key="2">
                        {isLoggedIn &&
                            <CustomTable
                                dataSource={redacoesData}
                                columns={redacaoColumns}
                            />
                        }
                    </TabPane>
                </Tabs>

                <ModalDetalhesTema // Renderizando o componente do modal
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    tema={selectedTema}
                />
        </div>
    );
};

export default Home;








