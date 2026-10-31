# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Clinify LXP — Hospital Moinhos de Vento
Plataforma de Formação Médica Baseada em Simulações Clínicas Interativas.


Projeto desenvolvido para o Challenge FIAP 2026 (1º Ano - Engenharia de Software), integrando as disciplinas de **Front-End Design** e **Web Development** (Sprint 4).

---

##  Links do Projeto
- **Repositório GitHub:** `https://github.com/[seu-usuario]/clinify-front-web`
- **Deploy em Produção (Vercel):** `https://[seu-projeto].vercel.app`
- **Protótipo Figma:** `https://www.figma.com/file/[seu-link-figma]`

---

##  Tecnologias Utilizadas
- **React.js (Vite):** Estrutura SPA com componentização declarativa e hooks nativos (`useState`, `useContext`, `useEffect`).
- **Tailwind CSS:** Estilização utilitária com design system padronizado e responsividade para dispositivos móveis, tablets e desktop.
- **React Router DOM:** Gestão de roteamento declarativo com segregação de rotas públicas e privadas.
- **Custom Hooks:** Lógica clínica desacoplada via `useSimulation`.

---

##  Instruções de Instalação e Execução Local

### Pré-requisitos
- Node.js instalado (versão 18 ou superior).

### Instalação
```bash
# Clonar o repositório
git clone [https://github.com/](https://github.com/)[seu-usuario]/clinify-front-web.git

# Aceder ao diretório do projeto
cd clinify-front-web

# Instalar dependências
npm install