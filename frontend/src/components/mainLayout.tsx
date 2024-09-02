import { ReactNode, useState } from 'react';
import { Layout, Menu, Dropdown, Space, Tooltip } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '../context';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { isLoggedIn, tipoUsuario, nomeUsuario } = useAuth(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const items = [
        {
            key: '1',
            label: isLoggedIn ? <span>Seja bem-vindo, {nomeUsuario}</span> : <Link href="/login">Entrar</Link>  
        },
    ];

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                >
                    <Menu.Item>
                        <Link href="/">
                            TextGrader
                        </Link>
                    </Menu.Item>
                    {isLoggedIn === false ? (
                        <Tooltip title="Você precisa fazer login para acessar essa página">
                            <div onClick={(e) => e.preventDefault()}>
                                <Menu.Item disabled>
                                    Home
                                </Menu.Item>
                            </div>
                        </Tooltip>
                    ) : (
                        <Menu.Item>
                            <Link href="/home">
                                Home
                            </Link>
                        </Menu.Item>
                    )}
                    <Menu.Item>
                        <Link href="/sobre">
                            Sobre
                        </Link>
                    </Menu.Item>
                    <Menu.Item style={{ marginLeft: isLoggedIn ? '720px' : '830px' }}>
                        <Dropdown
                            menu={{ items }}
                            onOpenChange={handleMenuClick}
                            overlayStyle={{ marginTop: '8px' }}
                        >
                            <Space onClick={handleMenuClick}>
                                {isLoggedIn === true ? `Entrou como ${tipoUsuario}` : 'Login'}
                                {isMenuOpen ? <CaretDownOutlined /> : <CaretUpOutlined />}
                            </Space>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '20px 0' }}>{children}</Content>
            <Footer style={{ textAlign: 'center', gap: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ©2023 Created by
                <a href="https://github.com/cassiofb-dev" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Cassio,</a>
                <a href="https://github.com/juliemoura" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Julie,</a>
                <a href="https://github.com/Gustavo-Pettine" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Pettine</a> 
                and Improved by
                <a href="https://github.com/misterx901" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Felipe,</a>
                <a href="https://github.com/LucassAbm" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Lucas,</a>
                <a href="https://github.com/Lucca-1999" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Lucca,</a> 
                <a href="https://github.com/VitorBelloni" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Vitor</a>
            </Footer>
        </Layout>
    );
};

export default MainLayout;