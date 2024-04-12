// import '@/styles/globals.css';
// import 'antd/dist/reset.css';
// import { Header, Content, Footer } from 'antd/lib/layout/layout';
// import type { AppProps } from 'next/app';
// import { Dropdown, Layout, Menu, MenuProps, Space } from 'antd';
// import { DownOutlined } from '@ant-design/icons';
// import Link from 'next/link';
// import { AuthProvider, useAuth } from '../context';

// export default function App({ Component, pageProps }: AppProps) {
//   const { isLoggedIn, tipoUsuario } = useAuth(); 

//   const items: MenuProps['items'] = [
//     {
//       key: '1',
//       label: <Link href="/login">Entrar</Link>
//     },
//   ];


//   return (
//     <AuthProvider>
//       <Layout style={{ minHeight: "100vh" }}>
//         <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
//           <Menu
//             theme="dark"
//             mode="horizontal"
//             defaultSelectedKeys={['2']}
//           >
//             <Menu.Item>
//               <Link href="/">
//                 TextGrader
//               </Link>
//             </Menu.Item>
//             <Menu.Item disabled={isLoggedIn === false}>
//               <Link href="/redacao">
//                 Home
//               </Link>
//             </Menu.Item>
//             <Menu.Item>
//               <Link href="/sobre">
//                 Sobre
//               </Link>
//             </Menu.Item>
//             <Menu.Item style={{marginLeft: '830px'}}>
//               <Dropdown menu={{items}}>
//                 <Space>
//                   {isLoggedIn === true ? `Entrou como ${tipoUsuario}` : 'Login'}
//                   <DownOutlined />
//                 </Space>
//               </Dropdown>
//             </Menu.Item>
//           </Menu>
//         </Header>
//         <Content style={{ padding: '20px 0' }} ><Component {...pageProps} /></Content>
//         <Footer style={{ textAlign: 'center', gap: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           ©2023 Created by
//           <a href="https://github.com/cassiofb-dev" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Cassio,</a>
//           <a href="https://github.com/juliemoura" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Julie,</a>
//           <a href="https://github.com/Gustavo-Pettine" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Pettine</a> 
//           and Improved by
//           <a href="https://github.com/misterx901" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Felipe,</a>
//           <a href="https://github.com/juliemoura" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Lucas,</a>
//           <a href="https://github.com/Gustavo-Pettine" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Lucca,</a> 
//           <a href="https://github.com/VitorBelloni" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>Vitor</a>
//         </Footer>
//       </Layout>
//     </AuthProvider>
//   )
// }

import '@/styles/globals.css';
import 'antd/dist/reset.css';
import { Layout } from 'antd';
import type { AppProps } from 'next/app';
import MainLayout from '../components/mainLayout';
import { AuthProvider } from '../context';

const { Content } = Layout;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <MainLayout>
        <Content style={{ padding: '20px 0' }}><Component {...pageProps} /></Content>
      </MainLayout>
    </AuthProvider>
  );
}

