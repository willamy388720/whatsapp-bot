# Detecção de Mensagens Fraudulentas no WhatsApp

Este projeto utiliza a biblioteca venom-bot para monitorar mensagens recebidas no WhatsApp e detectar possíveis fraudes. Quando uma mensagem suspeita é identificada, um alerta é enviado ao usuário com recomendações de segurança.

## Funcionalidades

- Criação de sessão no WhatsApp utilizando venom-bot.
- Monitoramento de mensagens recebidas.
- Detecção de mensagens fraudulentas.
- Envio de alertas de segurança personalizados.
- Diferenciação entre mensagens recebidas em grupos e individuais.

## Pré-requisitos

- Node.js instalado.

## Instalação

1. Clone o repositório para sua máquina local.
2. Instale as dependências necessárias utilizando npm:
   ```
   npm i
   ```

## Uso

1.  Instale as dependências necessárias.
2.  Crie um documento `.env` na raiz do projeto, usando as variaveis presentes em `.env.example`.
3.  Com a ferramenta instalada e as variaveis criadas, rode:
    ```
    npm run dev
    ```
