## Purpose

Especificar os requisitos de controle de acesso por perfil na solicitação de adoção em detalhes do pet, validação defensiva de URLs de imagens e desacoplamento do parser HAL `_embedded` nas queries do catálogo de pets.

## ADDED Requirements

### Requirement: Controle de ação de adoção por ProfileType em detalhes do pet
O componente `PetDetailsCard` (`app/pet/details/_components/pet-details-card.tsx`) SHALL controlar a ação "Solicitar adoção" com base estrita em `ProfileType` (`'USER' | 'SHELTER' | 'ADMIN'`), sem casts `as string`, sem referências a `'ADOPTER'` e sem links quebrados para `/profile/create`.

#### Scenario: Usuário autenticado com perfil USER pode solicitar adoção
- **WHEN** o usuário autenticado possui ao menos um perfil com `profileType === 'USER'`
- **THEN** o botão `Solicitar adoção` é renderizado habilitado dentro do link `/pet/adoption?id=<id>&name=<name>&gender=<gender>`.

#### Scenario: Usuário não autenticado visualiza convite para login ou cadastro
- **WHEN** `isLoading === false` e `isAuthenticated === false`
- **THEN** o botão `Solicitar adoção` fica desabilitado com links funcionais para `/auth/login` e `/auth/register`.

#### Scenario: Usuário autenticado com perfil SHELTER ou apenas ADMIN não pode solicitar adoção
- **WHEN** o usuário autenticado não possui perfil `'USER'` e possui perfil `'SHELTER'` ou apenas `'ADMIN'`
- **THEN** o botão `Solicitar adoção` fica desabilitado
- **AND** é exibido aviso claro informando que o perfil atual (`Abrigo` ou `Admin`) não permite solicitar adoção, pois apenas perfis de adotante podem fazê-lo.

#### Scenario: Usuário autenticado sem perfis cadastrados visualiza apenas aviso informativo
- **WHEN** o usuário está autenticado com `user.profiles` vazio
- **THEN** o botão `Solicitar adoção` fica desabilitado
- **AND** é exibida mensagem informativa sobre ausência de perfil de adotante sem renderizar link para `/profile/create`.

### Requirement: Validação segura de URLs de imagem com fallback
O helper `isValidImageUrl` (`app/_lib/utils.ts`) e os componentes de exibição de pet e abrigo (`PetListCard`, `PetDetailsImgageGallery`, `PetDetailsShelterCard`) SHALL validar URLs remotas (`http:` / `https:`) ou caminhos relativos iniciados por `/`, utilizando a imagem padrão `noImg` sempre que a URL estiver ausente, inválida ou for placeholder literal (`'string'`).

#### Scenario: URL de imagem inválida ou placeholder recebe fallback noImg
- **WHEN** `pet.avatar`, `images[].imageUrl` ou `shelterResponseCompact.avatar` é nulo, vazio, `'string'` ou protocolo inválido
- **THEN** `isValidImageUrl` retorna `false` e o componente renderiza `noImg` sem quebrar `next/image`.

### Requirement: Desacoplamento de `_embedded` nas queries de pets
As funções `fetchPets`, `fetchPetsInfinite` e `fetchPetById` em `app/_entities/pet/queries.ts` SHALL utilizar a instância compartilhada `api` (`withCredentials: true`) e extrair o array de pets de `response.data._embedded` de forma desacoplada do nome da chave HAL (via primeiro array/valor de `Object.values(response.data._embedded ?? {})`), retornando lista vazia quando `_embedded` estiver ausente ou vazio.

#### Scenario: Extração bem-sucedida independentemente da chave HAL em `_embedded`
- **WHEN** o backend retorna `_embedded` na API V1 (`/v1/pets`) sob `petParamsResponseList`, `pets` (via `@Relation(collectionRelation = "pets")`) ou outra chave de coleção
- **THEN** `fetchPets`, `fetchPetsInfinite` e `fetchPetById` extraem corretamente os itens da primeira lista encontrada em `_embedded`.

#### Scenario: Resposta sem `_embedded` retorna lista vazia com paginação segura
- **WHEN** a resposta da API não contém `_embedded` ou contém `_embedded: {}`
- **THEN** as funções retornam array vazio (`[]`), e `fetchPetsInfinite` retorna `nextPage: null` quando não há próxima página.
