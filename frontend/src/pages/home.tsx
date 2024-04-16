import { Tabs, Button, Modal, Tooltip, message, Select, Space } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '../context';
import CustomTable from '../components/customTable';
import ModalDetalhesTema from '@/components/modalDetalhesTema';

const { TabPane } = Tabs;
const { Option } = Select;

export interface Tema {
    id: string;
    nome_professor: string;
    tema: string;
    descricao: string;
}

export interface Redacao {
    titulo_redacao: string;
    nota1: number;
    nota2: number;
    nota3: number;
    nota4: number;
    nota5: number;
    nota_professor: number;
    id_tema: string;
    id: string;
}

const Home = () => {
    const [activeKey, setActiveKey] = useState<string>('1');
    const [temasData, setTemasData] = useState<Tema[]>([]); 
    const [redacoesData, setRedacoesData] = useState<Redacao[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTema, setSelectedTema] = useState<Tema | null>(null);
    const [filter, setFilter] = useState<string>('todos');
    const { isLoggedIn, tipoUsuario, nomeUsuario } = useAuth(); 

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

    const handleDeleteTema = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/temas/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTemasData(temasData.filter(tema => tema.id !== id));
                message.success('Tema deletado com sucesso!');
            } 
        } catch (error) {
            console.error('Erro ao deletar o tema:', error);
            message.error('Erro ao deletar o tema. Por favor, tente novamente.');
        }
    };

    const handleTemaEditado = (temaEditado: Tema) => {
        setTemasData(temasData.map(tema => (tema.id === temaEditado.id ? temaEditado : tema)));
    };

    const handleFilterTemas = () => {
        return temasData.filter(tema => tema.nome_professor === nomeUsuario);
    };

    const handleFilterRedacoes = () => {
        if (filter === 'meus') {
            return redacoesData.filter(redacao => {
                return temasData.find(tema => tema.id === redacao.id_tema && tema.nome_professor === nomeUsuario);
            });
        }
        return redacoesData;
    };

    const temasColumns = [
        { title: 'Professor', dataIndex: 'nome_professor', key: 'nome_professor', ellipsis: true },
        { 
            title: 'Tema', 
            dataIndex: 'tema', 
            key: 'tema', 
            render: (text: string, record: Tema) => 
                <Tooltip title={tipoUsuario === 'aluno' ? "Detalhes do tema" : "Editar tema"}>
                    <Button type="link" onClick={() => openModal(record)}>{text}</Button>
                </Tooltip>, ellipsis: true 
        },
        { title: 'Descrição', dataIndex: 'descricao', key: 'descricao', ellipsis: true },
        {
            title: 'Ações',
            key: 'acoes',
            render: (record: Tema) => (
                tipoUsuario === 'professor' ? (
                    <Tooltip title="Deletar tema">
                        <Button type="link" onClick={() => handleDeleteTema(record.id)} danger icon={<DeleteOutlined />} />
                    </Tooltip>
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
                        <Space style={{ marginBottom: 16 }}>
                            {tipoUsuario === 'professor' && (
                                <Link href="/tema">
                                    <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }}>
                                        Adicionar Tema
                                    </Button>
                                </Link>
                            )}
                            {tipoUsuario === 'professor' && (
                                <Select defaultValue="todos" style={{ width: 140 }} onChange={value => setFilter(value)}>
                                    <Option value="todos">Todos os Temas</Option>
                                    <Option value="meus">Meus Temas</Option>
                                </Select>
                            )}
                        </Space>
                        {isLoggedIn &&
                            <CustomTable
                                dataSource={filter === 'meus' ? handleFilterTemas() : temasData}
                                columns={temasColumns}
                            />
                        }
                    </TabPane>
                    <TabPane tab="Redações" key="2">
                        <Space style={{ marginBottom: 16 }}>
                            {tipoUsuario === 'professor' && (
                                <Select defaultValue="todos" style={{ width: 200 }} onChange={value => setFilter(value)}>
                                    <Option value="todos">Todas as Redações</Option>
                                    <Option value="meus">Redações dos meus temas</Option>
                                </Select>
                            )}
                        </Space>
                        {isLoggedIn &&
                            <CustomTable
                                dataSource={handleFilterRedacoes()}
                                columns={redacaoColumns}
                            />
                        }
                    </TabPane>
                </Tabs>

                <ModalDetalhesTema 
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    tema={selectedTema}
                    onTemaEditado={handleTemaEditado}
                />
        </div>
    );
};

export default Home;

