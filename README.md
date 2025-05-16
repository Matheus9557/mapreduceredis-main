# 🧠 Sistema Distribuído MapReduce com Redis e Docker

Este projeto implementa um sistema distribuído do tipo **MapReduce**, utilizando **Redis** para coordenação de tarefas, filas de mensagens e Pub/Sub, além de **Docker** e **Docker Compose** para simulação de múltiplos workers isolados.

A proposta é simular como grandes volumes de dados podem ser processados em paralelo em um sistema distribuído, com divisão por etapas: `Map`, `Shuffle` e `Reduce`.

---

## 🚀 Visão Geral do Funcionamento

```text
           ┌────────────┐
           │  input.txt │
           └─────┬──────┘
                 ↓
         [ generateChunks.js ]
                 ↓
   ┌─────────────┴────────────┐
   │     chunks/chunkX.txt    │ ← arquivos de entrada
   └─────────────┬────────────┘
                 ↓
           [ Mappers (Map) ]
                 ↓
       intermediates/ & intermediate/
                 ↓
            [ Shuffler.js ]
                 ↓
        reducer-input/inputX.json
                 ↓
           [ Reducers (Reduce) ]
                 ↓
        reducer-output/outputX.txt
                 ↓
       [ generateOutputs.js ]
                 ↓
        outputs/final-result.txt
```

---

## 📁 Estrutura Completa do Projeto

```plaintext
.
├── input/                    # input.txt com exemplo de teste
├── chunks/                  # Arquivos chunk0.txt a chunk9.txt (divididos pelo generateChunks)
├── intermediate/            # Saídas intermediárias dos mappers: mapper_chunkX.txt.json
├── intermediates/           # Outra saída dos mappers: intermediateX.json
├── reducer-input/           # Entradas dos reducers: inputX.json (chave → valores[])
├── reducer-output/          # Saídas dos reducers (JSON em .txt)
├── reducers/                # Resultados formatados (ex: lista de objetos chave/valor)
├── outputs/                 # Resultado final consolidado: final-result.txt
│
├── coordinator.js           # Coordena o fluxo: Map → Shuffle → Reduce
├── generateChunks.js        # Divide input.txt ou data.txt em chunks
├── generateIntermediates.js # Executa mappers isoladamente para testes
├── generateReducers.js      # Gera arquivos de entrada para reducers com base na saída do shuffler
├── generateOutputs.js       # Junta as saídas dos reducers no resultado final
│
├── mapper.js                # Lógica de Map: entrada → pares chave/valor
├── reducer.js               # Lógica de Reduce: chave + valores[] → resultado
├── shuffler.js              # Agrupa por chave e distribui dados para reducers
│
├── redisClient.js           # Instância central do Redis client
├── Dockerfile               # Imagem base dos workers (mappers e reducers)
├── docker-compose.yml       # Orquestra Redis, Mappers e Reducers em containers
```

---

## 🧠 Detalhamento das Fases

### 🗂️ Fase 1: Map

- Cada arquivo `chunkX.txt` é lido por um worker `mapper.js`.
- O mapper gera pares `{ palavra: 1 }` para cada ocorrência.
- A saída é salva em:
  - `intermediate/mapper_chunkX.txt.json`
  - ou `intermediates/intermediateX.json`

```json
// Exemplo de saída de um mapper:
{
  "apple": 1,
  "banana": 1,
  "orange": 1
}
```

---

### 🔁 Fase 2: Shuffle

- O `shuffler.js` agrupa todos os pares chave/valor produzidos pelos mappers.
- Ele calcula um hash da chave para distribuir cada chave para um reducer.
- A saída da shuffle é salva em `reducer-input/inputX.json`:

```json
{
  "banana": [1, 1],
  "apple": [1, 1],
  "orange": [1]
}
```

---

### 🧮 Fase 3: Reduce

- Cada reducer lê um `inputX.json` com várias chaves e arrays de valores.
- Ele processa cada chave, somando ou agregando os valores associados.

```json
// Exemplo de saída de reducer (como texto dentro de um .txt):
{
  "apple": 2,
  "banana": 2,
  "orange": 1
}
```

---

### 📦 Consolidação Final

- O script `generateOutputs.js` junta todas as saídas dos reducers e salva em `outputs/final-result.txt`.

```txt
Resultado final do processo MapReduce.
Saída do reducer com dados agregados.
```

---

## ⚙️ Execução Local (sem Docker)

1. Gerar chunks:

```bash
node generateChunks.js
```

2. Rodar os mappers:

```bash
node mapper.js
```

3. Executar o shuffle:

```bash
node shuffler.js
```

4. Gerar entradas para reducers:

```bash
node generateReducers.js
```

5. Executar os reducers:

```bash
node reducer.js
```

6. Consolidar resultado final:

```bash
node generateOutputs.js
```

---

## 🐳 Execução via Docker Compose

> Certifique-se de que o Docker e Docker Compose estão instalados.

```bash
docker-compose up --build
```

- Redis, Mappers, Reducers e Coordinator são orquestrados automaticamente.
- Containers são criados a partir do `Dockerfile`.
- A comunicação entre eles é feita via **Redis pub/sub** e filas.

---

## 🧰 Tecnologias Utilizadas

- **Node.js** – Lógica principal do MapReduce
- **Redis** – Coordenação, pub/sub e filas
- **Docker** – Isolamento dos processos
- **Docker Compose** – Orquestração de múltiplos containers
- **JSON** – Entrada/saída estruturada dos workers

---

## ✅ Funcionalidades Concluídas

| Item                                                | Status |
|-----------------------------------------------------|--------|
| Divisão automática de arquivos em chunks            | ✅     |
| Execução de mappers em paralelo                     | ✅     |
| Agrupamento por chave no estilo shuffle             | ✅     |
| Distribuição balanceada para reducers               | ✅     |
| Processamento de chaves por reducer                 | ✅     |
| Comunicação entre processos via Redis               | ✅     |
| Isolamento com Docker                               | ✅     |
| Geração do resultado final combinando reducers      | ✅     |
| Execução orquestrada com Docker Compose             | ✅     |
| Suporte a Pub/Sub para coordenação                  | ✅     |

---

## 🎁 Diferenciais Extras

- ✅ Uso de Redis para comunicação assíncrona (fila + pub/sub)
- ✅ Separação clara entre fases e arquivos de entrada/saída
- ✅ Execução escalável via containers
- 🔄 Suporte potencial para retries e tolerância a falhas
- 📈 Possível futura extensão para monitoramento ou dashboard

---

## 🧑‍🎓 Informações Acadêmicas

- **Disciplina:** Sistemas Distribuídos
- **Professor:** [Nome do Professor]
- **Aluno:** [Seu Nome Completo]
- **Período:** [Ano/Semestre]
- **Instituição:** [Nome da Universidade]

---

## 📜 Licença

Este projeto é de uso **exclusivamente educacional**. Não deve ser utilizado para fins comerciais sem autorização.

---

## 📌 Observação Final

Este projeto simula de forma prática os conceitos de paralelismo, sistemas distribuídos, comunicação assíncrona e coordenação de processos. Ele pode ser expandido com:

- **Workers em linguagens diferentes**
- **Persistência dos resultados em banco**
- **Interface de visualização**
- **Balanceamento de carga real**

Sinta-se à vontade para contribuir e melhorar!