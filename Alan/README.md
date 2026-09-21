# Chatbot de Persona — HTML5 + CSS3 + JavaScript puro

Base reutilizável para conversar com uma personalidade histórica, famosa ou fictícia.

## Estrutura

```text
/chatbot
├── index.html
├── style.css
├── script.js
├── README.md
├── /images
│   ├── personagem.jpg
│   ├── personagem-falando.gif
│   └── personagem-pensando.gif
└── /audio
```

## Executar

Abra `index.html` diretamente no navegador.

O modo padrão é `simulado`, portanto não precisa de servidor para funcionar.

## Onde personalizar

No início de `script.js` existem as áreas:

1. `CONFIGURAÇÕES PRINCIPAIS`
2. `CONFIGURAÇÃO DA PERSONA`
3. `LIMITAÇÃO HISTÓRICA`
4. `REGRAS DE CONHECIMENTO`

Para trocar Alan Turing por outra persona, normalmente altere apenas:

- `configuracao.personagem`
- `persona`
- `limitacaoHistorica`
- arquivos dentro de `images`

O restante do sistema permanece igual.

## IA real

O frontend foi separado da IA por `gerarRespostaIA()`.

Para usar um backend:

```js
ia: {
    provedor: "backend",
    endpoint: "http://localhost:3000/api/chat",
    modelo: "nome-do-modelo",
    apiKey: "",
    temperatura: 0.7,
    maxTokens: 500
}
```

O frontend envia o prompt da persona + histórico ao backend.

### Segurança

Não coloque chaves privadas de OpenAI, Anthropic, Google ou qualquer outro provedor em `script.js`.

Arquitetura recomendada:

```text
Navegador
   ↓
Seu backend
   ↓
API de IA
```

## TTS

O sistema utiliza `window.speechSynthesis`.

A função central é:

```js
falarTexto(texto)
```

Para trocar o mecanismo futuramente, o restante da aplicação não precisa conhecer a API de TTS.

Arquitetura futura:

```text
Navegador
   ↓
Seu backend
   ↓
API TTS
   ↓
Áudio
   ↓
Avatar falando
```

## Persona histórica

A hierarquia adotada é:

1. Informação histórica documentada
2. Conhecimento compatível com a época
3. Inferência razoável
4. Hipótese explicitamente identificada
5. Não há informação suficiente

Isso reduz o risco de a persona preencher lacunas biográficas inventando memórias.

## Observação sobre o modo simulado

O modo `simulado` não é uma inteligência artificial. Ele contém respostas locais apenas para demonstrar o fluxo da aplicação.

Para IA real, conecte `gerarRespostaViaBackend()` ao seu backend.


## Editor de personalidade

Abra o botão ⚙ dentro da aplicação.

A seção **Personalidade** permite alterar sem editar o código:

- nome;
- descrição;
- personalidade;
- jeito de falar;
- conhecimentos;
- limitações;
- formalidade;
- humor;
- objetividade;
- profundidade.

Clique em **Aplicar personalidade** para salvar no navegador.

Essas informações entram no prompt enviado ao adaptador de IA. Portanto, quando um backend real estiver conectado, as alterações passam a influenciar as respostas do modelo.

## Tom de voz

Na seção **Voz** existem controles separados para:

- voz do navegador;
- velocidade da fala;
- tom de voz;
- volume;
- fala automática.

O "tom de voz" controla `SpeechSynthesisUtterance.pitch`.

A aplicação não presume que uma voz específica exista no computador. Ela procura a voz configurada e, caso não encontre, tenta uma voz compatível com o idioma.

## Imagens

Os três arquivos são independentes:

```text
images/personagem.jpg
images/personagem-pensando.gif
images/personagem-falando.gif
```

O avatar de fala e pensamento usa `object-fit: contain` para evitar cortes quando o GIF tiver proporção diferente.

O container também possui tamanho estável para impedir que o chat seja deslocado quando a imagem muda.

## Personalidade e prompt

Os sliders de formalidade, humor, objetividade e profundidade são convertidos em instruções adicionais no prompt:

```text
Formalidade: X%
Humor: X%
Objetividade: X%
Profundidade: X%
```

Isso não transforma magicamente qualquer modelo em uma personalidade perfeita. O modelo ainda precisa seguir o prompt e o backend deve enviar essas instruções corretamente.

