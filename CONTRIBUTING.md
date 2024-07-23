## Guia Completo para Contribuidores

Caso você esteja lendo esta versão do README, você está pegando o projeto em um estágio extremamente inicial, mas empolgante, pois há várias coisas a serem definidas. Então, caso queira contribuir, utilize as issues para entender quais pontos ainda não foram resolvidos, conversar conosco e contribuir.

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

#### Realizando PRs para o repositório raiz

1. **Faça um fork desse repositório no GitHub:**

   - Clique no botão "Fork" no canto superior direito. Isso criará uma cópia do repositório em sua conta do GitHub.

2. **Clone o fork para o seu computador:**

   - Abra o terminal e navegue até o diretório onde deseja clonar o repositório.
   - Execute o seguinte comando:
     ```bash
     git clone https://github.com/<SEU_USUARIO>/buddy-client.git
     ```
     _Substitua `<SEU_USUARIO>` pelo seu nome de usuário no GitHub._

3. **Tipos de branches:**

   - **main:** _Branch principal do projeto, onde o código estável é armazenado._
   - **develop:** _Branch de desenvolvimento, onde as novas features são criadas e testadas._
   - **feature:** _Branches criadas a partir da develop para implementação de novas features._
   - **fix:** _Branches criadas a partir da develop para correção de bugs._
   - **hotfix:** _Branches criadas a partir da main para correções urgentes de bugs._

4. **Crie uma branch para sua contribuição:**

   - Crie uma branch para cada feature ou correção que você for implementar. Por exemplo:
     ```bash
     git checkout -b feature/minha-feature
     ```
     _Substitua `minha-feature` pelo nome da sua branch. Lembre-se de usar o prefixo correto, como `feature/nome-relacionado`._

5. **Implemente sua contribuição:**

   - Faça as alterações no código de acordo com sua feature ou correção.
   - Adicione e commite as suas mudanças:
     ```bash
     git add <arquivos_modificados>
     git commit -m "Mensagem do seu commit"
     ```

6. **Envie sua branch para o GitHub:**

   - Envie sua branch para o seu fork remoto:
     ```bash
     git push origin feature/minha-feature
     ```

7. **Crie uma pull request:**
   - No GitHub, acesse seu fork do repositório.
   - Clique na aba "Pull requests".
   - Clique no botão "New pull request".
   - Selecione sua branch como branch de origem e a branch `develop` como branch de destino.
   - Adicione um título e uma descrição detalhada da sua contribuição.
   - Clique no botão "Create pull request".

#### Revise e finalize o merge

- Aguarde a revisão da sua pull request por outros colaboradores.
- Responda a comentários e faça as alterações solicitadas.
- Quando sua pull request for aprovada, você poderá fazer o merge na branch `develop`.

### Opções de merge:

- **Squash and merge:** Combina todas as alterações da sua branch em um único commit antes de mesclar na branch `develop`. Utilize este método para merge de pull requests em branches de desenvolvimento (feature e fix).

Escolha a opção de merge de acordo com as diretrizes do projeto.

## Boas Práticas de Contribuição

- Faça commits claros e descritivos.
- Teste seu código antes de enviar uma pull request.
- Respeite o código de conduta do projeto.
- Participe das discussões e revisões de código.
- Exclua a branch feature ou fix após o merge na develop.
- Não exclua a branch develop após o merge na main.

## Recursos Adicionais

- [Documentação do Git](https://git-scm.com/doc)
- [Guia de contribuição do GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

Agradecemos sua contribuição para o Buddy!
