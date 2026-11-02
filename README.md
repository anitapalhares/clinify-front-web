# Clinify | Plataforma de Simulação Clínica

Plataforma educacional e de simulação clínica interativa desenvolvida para conectar estudantes e professores de medicina, integrando ferramentas de prática de anamnese, acompanhamento de turmas, salas ao vivo e relatórios de desempenho baseados na curva de aprendizado (função logística).

## Tecnologias Utilizadas

* **Front-End:** React 18, Vite, React Router DOM
* **Estilização:** CSS Modular (Root/Estrutura/Consultas originais adaptadas para SPA)
* **Gerenciamento de Estado & Hooks:** React Context API, Custom Hooks locais, js
* **Versionamento:** Git e GitHub
* **Deploy em Produção:** Vercel

---

## Links do Projeto

* **Repositório GitHub:** https://github.com/anitapalhares/clinify-front-web.git
* **Deploy na Vercel:** https://clinify-front-web.vercel.app/login
* **Protótipo no Figma:** https://www.figma.com/design/5XBp7dz9bmiCKe95phM3xM/Clinify---prototipo?node-id=0-1&p=f&t=g2wWq1b3T0vlSstq-0

---

## O que há de novo - sprint 4

* **Simulador Clínico Expandido:** Módulo de simulação com cenários clínicos abrangendo Neurologia, Cardiologia, Pneumologia, Pediatria, Endocrinologia, Ginecologia, Saúde Mental, Emergência, Anatomia, Gastroenterologia e Histologia.
* **Motor Local de Anamnese e Rubricas:** Sistema inteligente baseado em regras textuais e matrizes de rubrica para avaliar interações em tempo real (acolhimento, história da queixa, sinais de alerta e conduta), operando de forma totalmente local no navegador.
* **Salas ao Vivo e Integração com QR Code de código funcional:** Criação de salas interativas pelo professor com geração automática de códigos de 6 dígitos e exportação/leitura de QR Code para acesso rápido dos alunos.
* **Acompanhamento em Tempo Real:** Sincronização via `localStorage` que permite ao professor acompanhar o progresso das tentativas, pontuações e o histórico completo de perguntas enviadas por cada aluno.
* **Exportação de Telemetria (JSON):** Sistema de rastreamento de interações e atividades concluídas que gera um pacote estruturado pronto para exportação e análise em Python.
* **Perfil Gamificado e Seletor de Insígnias:** Painel de perfil com cálculo dinâmico de XP, níveis de residência, barras de progresso e um seletor interativo de ícones/avatares persistidos na barra superior (*Topbar*).
* **Dashboards Modulares e Tratamento de Erros:** Ambientes dedicados e responsivos para Estudantes, Professores e Administradores com suporte a estados de carregamento e simulação de falhas de servidor.
* **Footer interativo com links reais ":** os links levam a vizualização dos sites das empresas na web
* **Login de teste preenchido automaticamente":** cards que preenchem o login automaicamente para cada objetivo de teste, tornando mais rápido que lembrar usuario e senha de cada agente cadastrado

---


## Instruções de Instalação e Execução

Para executar o projeto localmente em sua máquina, siga os passos abaixo:

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18 ou superior recomendada) e o **npm** instalados.

### Passo a passo

1. **Clone o repositório:**
```bash
git clone https://github.com/anitapalhares/clinify-front-web.git

```

2. **Acesse a pasta do projeto:**
```bash
nome-da-pasta-do-projeto

```


3. **Instale as dependências:**
```bash
npm install

```


4. **Execute a aplicação em modo de desenvolvimento:**
```bash
npm run dev

```


5. **Acesse no navegador:**
Abra o link fornecido pelo terminal, configurado como http://localhost:5173

---

## Dados para Teste (Autenticação)

#### **Clicar nos Cards para fazer o autopreenchimento de acordo com o tipo de agente de teste é o suficiente**

Caso deseje testar os diferentes perfis de acesso na aplicação manualmente, utilize as credenciais abaixo:

* **Perfil de Estudante:**
* **E-mail:** `12345678900@gmail.com`
* **Senha:** `123456`


* **Perfil de Professor:**
* **E-mail:** `professor@clinify.com`
* **Senha:** `123456`


* **Perfil de Administrador:**
* **E-mail:** `admin@clinify.com`
* **Senha:** `123456`


---

## Uso de Inteligência Artificial no Desenvolvimento

Durante o desenvolvimento deste projeto, recursos de Inteligência Artificial (como assistentes de código baseados em LLM) foram utilizados de forma complementar e estritamente consultiva. A IA atuou como uma ferramenta de apoio técnico para acelerar a escrita de estruturas repetitivas de código (*boilerplate*), auxiliar na modelagem lógica dos estados dos custom hooks (como a gestão de salas e persistência no `localStorage`), otimizar o cálculo matemático das curvas logísticas em SVG e esclarecer dúvidas e conversões sobre a sintaxe do React Router DOM e tratamento de erros de compilação e gerar esqueletos de texto para serem preenchidos no readme. Toda a arquitetura de componentes, a regra de negócio clínica, a integração dos fluxos e a validação final da interface foram revisadas, compreendidas e adaptadas pela equipe de desenvolvimento.
