import { Tabs, Button } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '../context';
import CustomTable from '../components/customTable';

const { TabPane } = Tabs;

const Home = () => {
    const [activeKey, setActiveKey] = useState<string>('1');
    const [temasData, setTemasData] = useState([]);
    const [redacoesData, setRedacoesData] = useState([]);
    const { isLoggedIn, tipoUsuario } = useAuth(); 

    const handleTabChange = (key: string) => {
        setActiveKey(key);
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
        { title: 'Professor', dataIndex: 'nome_professor', key: 'nome_professor' },
        { title: 'Tema', dataIndex: 'tema', key: 'tema' },
        { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
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
        { title: 'Título', dataIndex: 'titulo_redacao', key: 'titulo_redacao' },
        { title: 'Nota 1', dataIndex: 'nota1', key: 'nota1' },
        { title: 'Nota 2', dataIndex: 'nota2', key: 'nota2' },
        { title: 'Nota 3', dataIndex: 'nota3', key: 'nota3' },
        { title: 'Nota 4', dataIndex: 'nota4', key: 'nota4' },
        { title: 'Nota 5', dataIndex: 'nota5', key: 'nota5' },
    ];

    return (
        <div style={{ padding: '0 20px', width: '100vw' }}>
                <Tabs activeKey={activeKey} onChange={handleTabChange} style={{ flex: 1 }}>
                    <TabPane tab="Home" key="1">
                        Content of Tab Pane 1
                    </TabPane>
                    <TabPane tab="Temas" key="2">
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
                    <TabPane tab="Redações" key="3">
                        {isLoggedIn && tipoUsuario === 'aluno' &&
                            <CustomTable
                                dataSource={redacoesData}
                                columns={redacaoColumns}
                            />
                        }
                    </TabPane>
                </Tabs>
        </div>
    );
};

export default Home;








