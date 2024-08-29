import '@/styles/globals.css'
import 'antd/dist/reset.css'
import { Layout } from 'antd';
import type { AppProps } from 'next/app'
import MainLayout from '../components/mainLayout';
import { AuthProvider } from '../context';
import Head from 'next/head'

import { InfoCircleOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

import { S } from '@/styles/App.styles'
import { useState } from 'react'

const { Content } = Layout;


export default function App({ Component, pageProps }: AppProps) {
  const [current, setCurrent] = useState('inicio')
  const github = 'https://github.com/'

  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key)
  }

  return (
    <AuthProvider>
      <MainLayout>
        <Content style={{ padding: '20px 0' }}><Component {...pageProps} /></Content>
      </MainLayout>
    </AuthProvider>
  );
}
