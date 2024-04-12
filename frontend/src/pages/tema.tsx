import { useState } from 'react';
import { Form, Input, Button } from 'antd';

const Tema = () => {
    const [form] = Form.useForm();
    const [nomeTema, setNomeTema] = useState('');
    const [descricaoTema, setDescricaoTema] = useState('');

    const handleSubmit = () => {
        console.log('Nome do Tema:', nomeTema);
        console.log('Descrição do Tema:', descricaoTema);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div style={{ width: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Criar Novo Tema</h1>
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item label="Nome do Tema" rules={[{ required: true, message: 'Por favor, insira o nome do tema!' }]}>
                        <Input value={nomeTema} onChange={(e) => setNomeTema(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Descrição do Tema" rules={[{ required: true, message: 'Por favor, insira a descrição do tema!' }]}>
                        <Input.TextArea value={descricaoTema} onChange={(e) => setDescricaoTema(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit">
                                Salvar
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Tema;


