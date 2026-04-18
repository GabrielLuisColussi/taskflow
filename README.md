# TaskFlow

Sistema de gestão de tarefas com foco em organização, clareza visual e experiência de uso mais profissional.

O projeto evoluiu de um MVP funcional para uma aplicação com dashboard refinada, filtros avançados, painel estratégico, configurações de workspace e uma interface mais próxima de um produto real.

---

## Visão geral

O TaskFlow foi desenvolvido para organizar tarefas de forma mais limpa, intuitiva e escalável, combinando:

- dashboard com visão operacional
- criação e edição em painel lateral
- filtros, ordenação e busca
- visualização em cards ou tabela
- painel de foco com tarefas do dia, atrasadas e concluídas
- configurações persistidas no navegador
- favoritos, tags e checklist local por tarefa

O objetivo do projeto é unir **funcionalidade**, **boa usabilidade** e **apresentação de portfólio**.

---

## Principais funcionalidades

### Gestão de tarefas
- criação de tarefas
- edição de tarefas
- exclusão com confirmação
- alteração de status
- priorização por nível
- prazo por data

### Dashboard
- cards com métricas principais
- painel de produtividade
- painel de foco
- calendário básico de prazos
- busca por texto
- filtros por status e prioridade
- ordenação por diferentes critérios
- chips de filtros ativos

### Experiência do usuário
- login e cadastro
- feedback visual com toast
- drawer lateral para criação e edição
- confirmação de ações destrutivas
- modo de visualização em cards ou tabela
- sidebar desktop e mobile
- menu de usuário
- preferências persistidas

### Configurações do workspace
- nome do workspace
- meta diária
- exibição padrão
- opção de cards compactos
- exibição opcional do painel de foco

---

## Estrutura do projeto

```text
TO-DO-LIST-ADVANCED/
├── backend/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
├── bd.sql
└── README.md

Organização do front-end

O front-end foi reorganizado para uma estrutura mais profissional e modular, separando:

componentes base em components/ui
funcionalidades por domínio em features
layout da aplicação em layouts
utilitários, formatadores e constantes em lib
roteamento em app/routes
Tecnologias utilizadas
Front-end
React
Vite
Tailwind CSS
React Query
React Hook Form
Zod
Lucide React
React Router DOM
Back-end
API separada em pasta própria
autenticação com token
variáveis de ambiente para configuração
Persistência adicional no cliente

Alguns recursos visuais e complementares são persistidos localmente no navegador, como:

favoritos
tags
checklist por tarefa
preferências de exibição
configurações do workspace

Como executar o projeto
1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd TO-DO-LIST-ADVANCED
2. Configurar o backend

Entre na pasta do backend:

cd backend
npm install

Crie o arquivo .env com base no .env.example.

Depois execute o backend conforme os scripts do projeto:

npm run dev
3. Configurar o frontend

Em outro terminal:

cd frontend
npm install

Crie o arquivo .env com base no .env.example.

Depois execute:

npm run dev
Variáveis de ambiente

Os arquivos .env não devem ser enviados ao GitHub.

Use como base:

backend/.env.example
frontend/.env.example
Banco de dados

O projeto inclui o arquivo:

bd.sql

Esse arquivo pode ser utilizado como base estrutural para criação do banco.

Observações importantes
Recursos salvos localmente

Atualmente, alguns recursos são persistidos localmente no navegador e não no backend:

favoritos
tags
checklist das tarefas
preferências do workspace
preferências de filtros e exibição

Isso foi adotado para acelerar a evolução da experiência do front-end sem depender de mudanças imediatas na API.

Estado atual do projeto

O projeto já possui uma base visual e estrutural sólida, mas ainda pode evoluir com:

subtarefas persistidas no backend
calendário completo
relatórios
indicadores mais avançados
colaboração entre usuários
anexos e comentários por tarefa
Objetivos do projeto

Este projeto foi desenvolvido com foco em:

praticar arquitetura de front-end mais modular
transformar um CRUD simples em um produto mais maduro
melhorar UX/UI com padrão mais corporativo
construir uma aplicação com mais valor de portfólio
Diferenciais implementados
refatoração de dashboard monolítica para estrutura modular
separação por features
visualização híbrida entre cards e tabela
painel estratégico com foco operacional
configuração real de workspace
melhoria de usabilidade e hierarquia visual
base mais preparada para escala
Possíveis melhorias futuras
persistir favoritos, tags e checklist na API
adicionar drag and drop entre colunas
criar calendário mensal
adicionar paginação ou virtualização
implementar anexos por tarefa
criar área real de perfil do usuário
adicionar testes automatizados

Autor

Desenvolvido por Gabriel Luis Colussi.