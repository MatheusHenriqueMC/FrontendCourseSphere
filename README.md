# CourseSphere Web

Frontend do CourseSphere, uma plataforma colaborativa de gestão de cursos online para o desafio do V-LAB.

## Deploy

- **App:** https://frontendcoursesphere.vercel.app
- **API Backend:** https://backendcoursesphere.onrender.com
- **Documentação Swagger:** https://backendcoursesphere.onrender.com/api-docs

## Repositório do Backend

[CourseSphere API](https://github.com/MatheusHenriqueMC/BackendCourseSphere)

## Funcionalidades

- Registro e login de usuários com autenticação JWT
- Dashboard com 3 seções: Meus Cursos Criados, Meus Cursos Inscritos, Explorar Cursos
- Criação de cursos com URL de imagem, nível e intervalo de datas
- Seções de curso com UI accordion e indicadores numerados
- Gerenciamento de aulas com atribuição a seções e status (rascunho/publicado)
- Sistema de inscrição (Iniciar Curso / Desinscrever com popup de confirmação)
- Chatbot assistente com IA utilizando Anthropic Claude
- Barra lateral de busca com filtro em tempo real e cursos mais populares
- Filtro de status para aulas (Todos/Rascunho/Publicado) — apenas para o criador
- Usuários não-criadores veem apenas aulas publicadas

## Stack Tecnológica

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Axios
- React Router DOM

## Como Rodar

### Pré-requisitos

- Node.js 20+
- API Backend rodando (veja o [Repositório do Backend](https://github.com/MatheusHenriqueMC/BackendCourseSphere))

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/MatheusHenriqueMC/FrontendCourseSphere.git
cd FrontendCourseSphere
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra `http://localhost:5173` no navegador.

### Variáveis de Ambiente

Para produção, configure a URL da API:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| VITE_API_URL | URL da API Backend | http://localhost:3000 |

Configurado em `src/services/api.ts`.

## Usuários de Teste

Inicie o backend e rode `rails db:seed` para criar os dados de exemplo:

| Nome | Email | Senha |
|------|-------|-------|
| Admin CourseSphere | admin@coursesphere.com | 123456 |
| Matheus Henrique | matheus@test.com | 123456 |
| Matheus Stepple | matheusstepple@test.com | 123456 |

## Estrutura do Projeto

```
src/
├── assets/
│   ├── hero.png
│   ├── vite.svg
│   ├── react.svg
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── ChatBot.tsx      # Assistente de IA do curso
│   ├── CourseCard.tsx
│   ├── CourseHeroBanner.tsx
│   ├── EmptyState.tsx
│   ├── ErrorMessage.tsx
│   ├── FormInput.tsx
│   ├── HeroBanner.tsx   # Banner do dashboard
│   ├── Loading.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── SearchSidebar.tsx
├── contexts/            # Contextos React
│   ├── AuthContext.tsx
│   ├── AuthContextType.ts
│   ├── ThemeContext.tsx
│   ├── useAuth.ts
│   └── useTheme.ts
├── pages/               # Componentes de página
│   ├── CourseDetails.tsx # Visualização do curso com seções, aulas e chatbot
│   ├── CourseForm.tsx    # Criar/editar curso
│   ├── Dashboard.tsx     # Dashboard principal com 3 seções de cursos
│   ├── LessonForm.tsx    # Criar/editar aula com seletor de seção
│   ├── Login.tsx
│   └── Register.tsx
├── services/            # Serviço de API
│   └── api.ts
├── types/               # Interfaces TypeScript
│   └── index.ts
└── App.tsx              # Configuração de rotas
```

## Visão Geral das Páginas

- **Login/Registro** — Backgrounds animados, toggle de tema, formulário em card branco
- **Dashboard** — Banner hero, Meus Cursos Criados, Meus Cursos Inscritos, Explorar Cursos com paginação
- **Detalhes do Curso** — Banner hero com imagem do curso, botão de inscrever/desinscrever, accordion de seções, aulas com badges de status, chatbot
- **Formulário de Curso** — Criar/editar com nome, descrição, datas, URL de imagem, nível
- **Formulário de Aula** — Criar/editar com título, status, URL de vídeo, seletor de seção
