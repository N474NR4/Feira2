/* =========================================================
   CHATBOT DE PERSONA — JAVASCRIPT
   =========================================================

   SISTEMA COMPLETO:

   HTML
      ↓
   JavaScript
      ↓
   Controlador do Chat
      ↓
   Motor da Persona
      ↓
   Backend
      ↓
   API da IA
      ↓
   Backend
      ↓
   JavaScript
      ↓
   Avatar + Chat + Voz

   IMPORTANTE:

   A API KEY NÃO deve ficar neste arquivo.

   O navegador conversa somente com seu backend.

   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÕES PRINCIPAIS
   ========================================================= */

const configuracao = {

    /* -----------------------------------------------------
       PERSONAGEM
       ----------------------------------------------------- */

    personagem: {

        nome: "Alan Turing",

        descricao:
            "Matemático, lógico e pioneiro da computação.",

        idioma: "pt-BR",

        avatar: {

            normal:
                "images/personagem.jpg",

            pensando:
                "images/personagem-pensando.gif",

            falando:
                "images/personagem-falando.gif"
        },

        mensagemInicial:
            "Olá. Como posso ajudá-lo? Posso conversar sobre matemática, lógica, computação e criptografia.",

        placeholder:
            "Digite sua pergunta..."
    },


    /* -----------------------------------------------------
       INTELIGÊNCIA ARTIFICIAL
       ----------------------------------------------------- */

    ia: {

        /*
         * backend = IA real
         * simulado = somente teste
         */

        provedor: "backend",

        /*
         * IMPORTANTE:
         *
         * Se seu server.js usa:
         *
         * app.post("/api/chat")
         *
         * então esta URL está correta.
         */

        endpoint:
            "http://localhost:3000/api/chat",

        modelo:
            "modelo-da-sua-ia",

        /*
         * Nunca coloque API KEY aqui.
         */

        apiKey: "",

        temperatura: 0.7,

        maxTokens: 500
    },


    /* -----------------------------------------------------
       VOZ
       ----------------------------------------------------- */

    voz: {

        ativada: true,

        falarAutomaticamente: true,

        vozPreferida: "",

        velocidade: 1.0,

        tom: 1.0,

        volume: 1.0
    },


    /* -----------------------------------------------------
       TTS
       ----------------------------------------------------- */

    tts: {

        tipo: "navegador",

        provedor: "",

        endpoint: "",

        apiKey: ""
    },


    /* -----------------------------------------------------
       HISTÓRICO
       ----------------------------------------------------- */

    historico: {

        usarLocalStorage: true,

        chave:
            "chatbot-persona-historico-v1"
    }
};


/* =========================================================
   2. PERSONA
   ========================================================= */

const persona = {

    nome: "Alan Turing",

    identidade: `
Você está simulando Alan Turing com base em informações
históricas documentadas.

A conversa é uma simulação.

Não afirme que uma frase foi realmente dita pelo personagem
quando ela for apenas uma reconstrução.
`,

    personalidade: `
Inteligente, analítico, reservado, curioso e direto.

Prefere raciocínio lógico, explicações claras e argumentos
verificáveis.

Evita teatralidade desnecessária.
`,

    estiloDeFala: `
Linguagem clara, lógica e relativamente formal.

Respostas objetivas, mas suficientemente explicativas.

Não use gírias modernas sem motivo.
`,

    conhecimentos: `
Matemática, lógica, criptografia, computação, máquinas,
algoritmos e assuntos compatíveis com sua formação e época.

Diferencie fatos documentados de interpretações.
`,

    contextoHistorico: `
Reino Unido, primeira metade do século XX.

Considere como limite histórico a data configurada abaixo.
`,

    limitacoes: `
Não possui conhecimento pessoal de acontecimentos posteriores
ao seu período histórico.

Não invente memórias, diálogos, experiências, sentimentos
ou hábitos não documentados.
`
};


/* =========================================================
   3. LIMITAÇÃO HISTÓRICA
   ========================================================= */

const limitacaoHistorica = {

    dataNascimento:
        "1912-06-23",

    dataFalecimento:
        "1954-06-07",

    limiteDeConhecimento:
        "1954-06-07",

    permitirConhecimentoPosterior:
        false
};


/* =========================================================
   4. REGRAS DE CONHECIMENTO
   ========================================================= */

const regrasDeConhecimento = {

    evitarConhecimentoFuturo: true,

    evitarMemoriasInventadas: true,

    evitarExperienciasInventadas: true,

    evitarOpiniaoSobreEventosPosteriores: true,

    reconhecerLimitacoes: true,

    permitirHipoteses: true,

    identificarHipotesesComoHipoteses: true
};


/* =========================================================
   5. PERSONALIDADE EDITÁVEL
   ========================================================= */

const personalidadeEditavel = {

    formalidade: 70,

    humor: 10,

    objetividade: 80,

    profundidade: 70
};


/* =========================================================
   6. CHAVE DO LOCALSTORAGE
   ========================================================= */

const CHAVE_PERSONA =
    "chatbot-persona-config-v1";


/* =========================================================
   7. CONFIGURAÇÃO DE VOZ
   ========================================================= */

const configuracaoVoz =
    configuracao.voz;


/* =========================================================
   8. HISTÓRICO
   ========================================================= */

let historicoConversa = [];


/* =========================================================
   9. CARREGAR PERSONALIDADE
   ========================================================= */

function carregarConfiguracaoEditavel() {

    try {

        const salvo =
            localStorage.getItem(
                CHAVE_PERSONA
            );


        if (!salvo) {

            return;
        }


        const dados =
            JSON.parse(salvo);


        if (dados.persona) {

            Object.assign(
                persona,
                dados.persona
            );
        }


        if (dados.traits) {

            Object.assign(
                personalidadeEditavel,
                dados.traits
            );
        }


        if (dados.voice) {

            Object.assign(
                configuracaoVoz,
                dados.voice
            );
        }


        configuracao.personagem.nome =
            persona.nome;


        if (dados.personagem?.descricao) {

            configuracao.personagem.descricao =
                dados.personagem.descricao;
        }

    }

    catch (erro) {

        console.warn(
            "Erro ao carregar configuração:",
            erro
        );
    }
}


/* =========================================================
   10. SALVAR PERSONALIDADE
   ========================================================= */

function salvarConfiguracaoEditavel() {

    try {

        localStorage.setItem(

            CHAVE_PERSONA,

            JSON.stringify({

                persona: {

                    nome:
                        persona.nome,

                    identidade:
                        persona.identidade,

                    personalidade:
                        persona.personalidade,

                    estiloDeFala:
                        persona.estiloDeFala,

                    conhecimentos:
                        persona.conhecimentos,

                    contextoHistorico:
                        persona.contextoHistorico,

                    limitacoes:
                        persona.limitacoes
                },

                personagem: {

                    descricao:
                        configuracao
                            .personagem
                            .descricao
                },

                traits:
                    personalidadeEditavel,

                voice: {

                    falarAutomaticamente:
                        configuracaoVoz
                            .falarAutomaticamente,

                    vozPreferida:
                        configuracaoVoz
                            .vozPreferida,

                    velocidade:
                        configuracaoVoz
                            .velocidade,

                    tom:
                        configuracaoVoz
                            .tom,

                    volume:
                        configuracaoVoz
                            .volume
                }
            })
        );

    }

    catch (erro) {

        console.warn(
            "Erro ao salvar configuração:",
            erro
        );
    }
}


/* =========================================================
   11. TRAÇOS DA PERSONALIDADE
   ========================================================= */

function aplicarTracosAoPrompt() {

    return `

AJUSTES DE ESTILO DEFINIDOS PELO USUÁRIO:

Formalidade:
${personalidadeEditavel.formalidade}%.

Humor:
${personalidadeEditavel.humor}%.

Objetividade:
${personalidadeEditavel.objetividade}%.

Profundidade:
${personalidadeEditavel.profundidade}%.


INTERPRETAÇÃO:

Formalidade baixa:
linguagem casual.

Formalidade alta:
linguagem formal.

Humor baixo:
quase nenhum humor.

Humor alto:
humor frequente sem perder coerência.

Objetividade baixa:
respostas mais desenvolvidas.

Objetividade alta:
vá diretamente ao ponto.

Profundidade baixa:
respostas simples.

Profundidade alta:
explique detalhes, contexto e raciocínio.
`;
}


/* =========================================================
   12. CONSTRUIR PROMPT
   ========================================================= */

function construirPromptDaPersona() {

    return `

============================================================
IDENTIDADE
============================================================

Você está simulando:

${persona.nome}


============================================================
AVISO
============================================================

Esta é uma simulação.

Não afirme que uma frase foi realmente dita pelo personagem
quando ela for apenas uma reconstrução.


============================================================
IDENTIDADE DA PERSONA
============================================================

${persona.identidade}


============================================================
PERSONALIDADE
============================================================

${persona.personalidade}


============================================================
ESTILO DE FALA
============================================================

${persona.estiloDeFala}


============================================================
AJUSTES DO USUÁRIO
============================================================

${aplicarTracosAoPrompt()}


============================================================
CONTEXTO HISTÓRICO
============================================================

${persona.contextoHistorico}


============================================================
CONHECIMENTOS
============================================================

${persona.conhecimentos}


============================================================
LIMITAÇÕES
============================================================

${persona.limitacoes}


============================================================
LIMITAÇÃO TEMPORAL
============================================================

Nascimento:
${limitacaoHistorica.dataNascimento}

Falecimento:
${limitacaoHistorica.dataFalecimento}

Limite de conhecimento:
${limitacaoHistorica.limiteDeConhecimento}

Conhecimento posterior permitido:
${limitacaoHistorica.permitirConhecimentoPosterior}


============================================================
REGRAS
============================================================

1. Responda de maneira coerente com a persona.

2. Não invente experiências pessoais.

3. Não invente memórias.

4. Não transforme hipótese em fato.

5. Respeite o contexto histórico.

6. Diferencie fatos de inferências.

7. Identifique hipóteses como hipóteses.

8. Se não houver informação suficiente, admita a limitação.

9. Não finja conhecer tecnologias posteriores.

10. Para assuntos posteriores ao período histórico,
faça apenas análises hipotéticas.

11. Nunca transforme uma lacuna histórica em memória.

12. Não diga que é realmente o personagem.

13. Você é uma simulação baseada em informações históricas.


============================================================
HIERARQUIA
============================================================

1. Informação documentada.

2. Conhecimento compatível com a época.

3. Inferência razoável.

4. Hipótese identificada.

5. Ausência de informação.
`;
}


/* =========================================================
   13. MOTOR PRINCIPAL DA IA
   ========================================================= */

async function gerarRespostaIA(mensagem) {

    if (
        configuracao.ia.provedor ===
        "simulado"
    ) {

        return gerarRespostaSimulada(
            mensagem
        );
    }


    if (
        configuracao.ia.provedor ===
        "backend"
    ) {

        return gerarRespostaViaBackend(
            mensagem
        );
    }


    throw new Error(
        `Provedor de IA desconhecido: ${configuracao.ia.provedor}`
    );
}


/* =========================================================
   14. IA SIMULADA
   ========================================================= */

async function gerarRespostaSimulada(
    mensagem
) {

    await esperar(
        700 +
        Math.random() * 500
    );


    const texto =
        mensagem.toLowerCase();


    if (

        regrasDeConhecimento
            .evitarConhecimentoFuturo &&

        /(smartphone|iphone|android|tiktok|instagram|chatgpt)/i
            .test(texto)

    ) {

        return (
            "Essa tecnologia pertence a um período posterior " +
            "ao meu contexto histórico. Não poderia afirmar " +
            "que a conheci pessoalmente. Posso, porém, " +
            "analisar o conceito de maneira hipotética."
        );
    }


    if (

        regrasDeConhecimento
            .evitarMemoriasInventadas &&

        /(café da manhã|almoçou|jantou|hoje você|o que você tomou|o que você comeu)/i
            .test(texto)

    ) {

        return (
            "Não posso afirmar isso como uma memória pessoal. " +
            "Uma simulação responsável não deve inventar " +
            "experiências históricas."
        );
    }


    if (
        /(criptografia|cifra|enigma|código)/i
            .test(texto)
    ) {

        return (
            "A criptografia pode ser entendida como uma " +
            "transformação controlada da informação para " +
            "que apenas quem possui o método adequado " +
            "consiga recuperar a mensagem."
        );
    }


    if (
        /(computador|computação|máquina|algoritmo|programação)/i
            .test(texto)
    ) {

        return (
            "Eu trataria esse problema como uma questão de " +
            "representação, regras e processamento. Um algoritmo " +
            "é uma sequência definida de instruções para " +
            "transformar uma entrada em uma saída."
        );
    }


    if (
        /(matemática|lógica|teorema|problema)/i
            .test(texto)
    ) {

        return (
            "Eu começaria definindo o problema com precisão. " +
            "Em matemática e lógica, uma palavra ambígua " +
            "pode esconder uma hipótese importante."
        );
    }


    return (
        "O modo simulado está funcionando. " +
        "Para utilizar uma IA real, mantenha o provedor " +
        "como backend e execute o server.js."
    );
}


/* =========================================================
   15. IA VIA BACKEND
   ========================================================= */

async function gerarRespostaViaBackend(
    mensagem
) {

    /* -----------------------------------------------------
       VERIFICA ENDPOINT
       ----------------------------------------------------- */

    if (
        !configuracao.ia.endpoint
    ) {

        throw new Error(
            "O endpoint do backend não foi configurado."
        );
    }


    /* -----------------------------------------------------
       VERIFICA SE ESTAMOS EM FILE://
       ----------------------------------------------------- */

    if (
        window.location.protocol ===
        "file:"
    ) {

        throw new Error(
            "O site foi aberto diretamente como arquivo. " +
            "Execute o frontend por um servidor local, " +
            "por exemplo http://localhost:5500."
        );
    }


    /* -----------------------------------------------------
       MONTA HISTÓRICO
       ----------------------------------------------------- */

    const mensagensHistorico =

        historicoConversa

            .filter(item =>

                item.role === "user" ||

                item.role === "assistant"
            )

            .map(item => ({

                role:
                    item.role,

                content:
                    item.content
            }));


    /* -----------------------------------------------------
       MONTA MENSAGENS
       ----------------------------------------------------- */

    const mensagens = [

        {

            role: "system",

            content:
                construirPromptDaPersona()
        },

        ...mensagensHistorico,

        {

            role: "user",

            content:
                mensagem
        }
    ];


    /* -----------------------------------------------------
       CORPO
       ----------------------------------------------------- */

    const corpo = {

        model:
            configuracao.ia.modelo,

        temperature:
            configuracao.ia.temperatura,

        max_tokens:
            configuracao.ia.maxTokens,

        system:
            construirPromptDaPersona(),

        messages:
            mensagens,

        persona: {

            nome:
                persona.nome,

            prompt:
                construirPromptDaPersona()
        }
    };


    /* -----------------------------------------------------
       DEBUG
       ----------------------------------------------------- */

    console.log(
        "Enviando mensagem para:",
        configuracao.ia.endpoint
    );


    console.log(
        "Corpo enviado:",
        corpo
    );


    let resposta;


    /* -----------------------------------------------------
       FETCH
       ----------------------------------------------------- */

    try {

        resposta = await fetch(

            configuracao.ia.endpoint,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        corpo
                    )
            }
        );

    }

    catch (erro) {

        console.error(
            "Falha de rede:",
            erro
        );


        throw new Error(

            "Não foi possível conectar ao backend. " +

            "Verifique se o server.js está rodando " +

            "em http://localhost:3000 e se o endpoint " +

            "POST /api/chat existe. " +

            "Se o frontend estiver em outra porta, " +

            "o backend também precisa permitir CORS."
        );
    }


    /* -----------------------------------------------------
       ERRO HTTP
       ----------------------------------------------------- */

    if (
        !resposta.ok
    ) {

        let detalhes = "";


        try {

            detalhes =
                await resposta.text();

        }

        catch {

            detalhes =
                "Sem detalhes.";
        }


        throw new Error(

            `Backend retornou HTTP ${resposta.status}. ` +

            detalhes
        );
    }


    /* -----------------------------------------------------
       JSON
       ----------------------------------------------------- */

    let dados;


    try {

        dados =
            await resposta.json();

    }

    catch {

        throw new Error(
            "O backend respondeu, mas não enviou JSON válido."
        );
    }


    console.log(
        "Resposta do backend:",
        dados
    );


    /* -----------------------------------------------------
       ACEITA VÁRIOS FORMATOS
       ----------------------------------------------------- */

    const conteudo =

        dados.reply ??

        dados.response ??

        dados.output ??

        dados.message ??

        dados.content ??

        dados.text ??

        dados.choices?.[0]?.message?.content ??

        dados.choices?.[0]?.text;


    /* -----------------------------------------------------
       SEM RESPOSTA
       ----------------------------------------------------- */

    if (
        conteudo === undefined ||
        conteudo === null ||
        String(conteudo).trim() === ""
    ) {

        throw new Error(
            "O backend respondeu, mas não retornou o texto da IA."
        );
    }


    return String(
        conteudo
    );
}


/* =========================================================
   16. GERENCIADOR DE VOZ
   ========================================================= */

const VoiceManager = (() => {

    let utteranceAtual = null;

    let vozes = [];


    function carregarVozes() {

        if (
            !("speechSynthesis" in window)
        ) {

            return [];
        }


        vozes =
            window.speechSynthesis
                .getVoices() || [];


        atualizarListaDeVozes();


        return vozes;
    }


    function escolherVoz() {

        if (!vozes.length) {

            return null;
        }


        const preferida =

            configuracaoVoz
                .vozPreferida
                .trim()
                .toLowerCase();


        if (preferida) {

            const encontrada =
                vozes.find(
                    voz =>
                        voz.name
                            .toLowerCase()
                            .includes(
                                preferida
                            )
                );


            if (encontrada) {

                return encontrada;
            }
        }


        const idioma =
            configuracao
                .personagem
                .idioma
                .toLowerCase();


        return (

            vozes.find(
                voz =>
                    voz.lang
                        .toLowerCase() ===
                    idioma
            ) ||

            vozes.find(
                voz =>
                    voz.lang
                        .toLowerCase()
                        .startsWith(
                            idioma.split("-")[0]
                        )
            ) ||

            vozes[0]
        );
    }


    async function falarTexto(
        texto,
        callbacks = {}
    ) {

        if (
            !configuracaoVoz.ativada
        ) {

            return;
        }


        if (
            !("speechSynthesis" in window)
        ) {

            throw new Error(
                "SpeechSynthesis não está disponível."
            );
        }


        parar();


        const utterance =
            new SpeechSynthesisUtterance(
                texto
            );


        utterance.lang =
            configuracao
                .personagem
                .idioma;


        utterance.rate =
            Number(
                configuracaoVoz.velocidade
            );


        utterance.pitch =
            Number(
                configuracaoVoz.tom
            );


        utterance.volume =
            Number(
                configuracaoVoz.volume
            );


        const voz =
            escolherVoz();


        if (voz) {

            utterance.voice =
                voz;
        }


        utterance.onstart = () => {

            utteranceAtual =
                utterance;

            callbacks.onstart?.();
        };


        utterance.onend = () => {

            if (
                utteranceAtual ===
                utterance
            ) {

                utteranceAtual =
                    null;
            }


            callbacks.onend?.();
        };


        utterance.onerror =
            evento => {

                if (
                    utteranceAtual ===
                    utterance
                ) {

                    utteranceAtual =
                        null;
                }


                callbacks.onerror?.(
                    evento
                );
            };


        utteranceAtual =
            utterance;


        window.speechSynthesis.speak(
            utterance
        );
    }


    function pausar() {

        window.speechSynthesis?.pause();
    }


    function continuar() {

        window.speechSynthesis?.resume();
    }


    function parar() {

        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis.cancel();
        }


        utteranceAtual =
            null;
    }


    function estaFalando() {

        return Boolean(
            window.speechSynthesis?.speaking
        );
    }


    function atualizarListaDeVozes() {

        const select =
            document.querySelector(
                "#voiceSelect"
            );


        if (!select) {

            return;
        }


        const valorAnterior =
            select.value;


        select.innerHTML = "";


        if (!vozes.length) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                "";


            option.textContent =
                "Nenhuma voz disponível";


            select.appendChild(
                option
            );


            return;
        }


        vozes

            .slice()

            .sort(
                (a, b) =>

                    `${a.lang} ${a.name}`
                        .localeCompare(
                            `${b.lang} ${b.name}`
                        )
            )

            .forEach(
                voz => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        voz.name;


                    option.textContent =
                        `${voz.name} — ${voz.lang}`;


                    option.selected =

                        voz.name ===
                        valorAnterior ||

                        (
                            configuracaoVoz
                                .vozPreferida &&

                            voz.name
                                .toLowerCase()
                                .includes(
                                    configuracaoVoz
                                        .vozPreferida
                                        .toLowerCase()
                                )
                        );


                    select.appendChild(
                        option
                    );
                }
            );
    }


    return {

        carregarVozes,

        falarTexto,

        pausar,

        continuar,

        parar,

        estaFalando
    };

})();


/* =========================================================
   17. AVATAR
   ========================================================= */

const AvatarManager = (() => {

    const estados = {

        normal: {

            imagem:
                configuracao
                    .personagem
                    .avatar
                    .normal,

            label:
                "Normal",

            legenda:
                "Aguardando sua próxima pergunta."
        },

        pensando: {

            imagem:
                configuracao
                    .personagem
                    .avatar
                    .pensando,

            label:
                "Pensando",

            legenda:
                "Processando a pergunta..."
        },

        falando: {

            imagem:
                configuracao
                    .personagem
                    .avatar
                    .falando,

            label:
                "Falando",

            legenda:
                "Respondendo por voz..."
        }
    };


    let estadoAtual =
        "normal";


    function definirEstadoPersonagem(
        estado
    ) {

        if (
            !estados[estado]
        ) {

            estado =
                "normal";
        }


        estadoAtual =
            estado;


        const imagem =
            document.querySelector(
                "#characterAvatar"
            );


        const badge =
            document.querySelector(
                "#stateBadge"
            );


        const legenda =
            document.querySelector(
                "#captionText"
            );


        if (imagem) {

            imagem.src =
                estados[estado].imagem;

            imagem.alt =
                `${configuracao.personagem.nome} — ${estados[estado].label}`;
        }


        if (badge) {

            badge.textContent =
                estados[estado].label;
        }


        if (legenda) {

            legenda.textContent =
                estados[estado].legenda;
        }


        atualizarStatusVisual(
            estado
        );
    }


    function atualizarStatusVisual(
        estado
    ) {

        const dot =
            document.querySelector(
                "#statusDot"
            );


        const texto =
            document.querySelector(
                "#statusText"
            );


        if (!dot || !texto) {

            return;
        }


        dot.classList.remove(
            "busy",
            "speaking"
        );


        if (
            estado === "pensando"
        ) {

            dot.classList.add(
                "busy"
            );


            texto.textContent =
                "Pensando";
        }

        else if (
            estado === "falando"
        ) {

            dot.classList.add(
                "speaking"
            );


            texto.textContent =
                "Falando";
        }

        else {

            texto.textContent =
                "Online";
        }
    }


    function estado() {

        return estadoAtual;
    }


    return {

        definirEstadoPersonagem,

        estado
    };

})();


/* =========================================================
   18. INTERFACE
   ========================================================= */

const UI = {

    elementos: {},


    iniciar() {

        this.elementos = {

            headerName:
                document.querySelector(
                    "#headerName"
                ),

            headerDescription:
                document.querySelector(
                    "#headerDescription"
                ),

            bioAvatar:
                document.querySelector(
                    "#bioAvatar"
                ),

            bioName:
                document.querySelector(
                    "#bioName"
                ),

            bioDescription:
                document.querySelector(
                    "#bioDescription"
                ),

            bioCopy:
                document.querySelector(
                    "#bioCopy"
                ),

            characterTitle:
                document.querySelector(
                    "#characterTitle"
                ),

            characterAvatar:
                document.querySelector(
                    "#characterAvatar"
                ),

            captionTitle:
                document.querySelector(
                    "#captionTitle"
                ),

            messageInput:
                document.querySelector(
                    "#messageInput"
                ),

            sendButton:
                document.querySelector(
                    "#sendButton"
                ),

            messages:
                document.querySelector(
                    "#messages"
                ),

            messageCount:
                document.querySelector(
                    "#messageCount"
                ),

            processingIndicator:
                document.querySelector(
                    "#processingIndicator"
                ),

            settingsBackdrop:
                document.querySelector(
                    "#settingsBackdrop"
                ),

            providerReadout:
                document.querySelector(
                    "#providerReadout"
                ),

            modelReadout:
                document.querySelector(
                    "#modelReadout"
                ),

            autoSpeakToggle:
                document.querySelector(
                    "#autoSpeakToggle"
                ),

            voiceSelect:
                document.querySelector(
                    "#voiceSelect"
                ),

            rateRange:
                document.querySelector(
                    "#rateRange"
                ),

            pitchRange:
                document.querySelector(
                    "#pitchRange"
                ),

            volumeRange:
                document.querySelector(
                    "#volumeRange"
                ),

            personaName:
                document.querySelector(
                    "#personaName"
                ),

            personaDescription:
                document.querySelector(
                    "#personaDescription"
                ),

            personaPersonality:
                document.querySelector(
                    "#personaPersonality"
                ),

            personaStyle:
                document.querySelector(
                    "#personaStyle"
                ),

            personaKnowledge:
                document.querySelector(
                    "#personaKnowledge"
                ),

            personaLimitations:
                document.querySelector(
                    "#personaLimitations"
                ),

            formalityRange:
                document.querySelector(
                    "#formalityRange"
                ),

            humorRange:
                document.querySelector(
                    "#humorRange"
                ),

            objectivityRange:
                document.querySelector(
                    "#objectivityRange"
                ),

            depthRange:
                document.querySelector(
                    "#depthRange"
                ),

            formalityValue:
                document.querySelector(
                    "#formalityValue"
                ),

            humorValue:
                document.querySelector(
                    "#humorValue"
                ),

            objectivityValue:
                document.querySelector(
                    "#objectivityValue"
                ),

            depthValue:
                document.querySelector(
                    "#depthValue"
                ),

            personaEditStatus:
                document.querySelector(
                    "#personaEditStatus"
                ),

            rateValue:
                document.querySelector(
                    "#rateValue"
                ),

            pitchValue:
                document.querySelector(
                    "#pitchValue"
                ),

            volumeValue:
                document.querySelector(
                    "#volumeValue"
                )
        };


        this.atualizarDadosPersonagem();

        this.preencherEditorPersona();

        this.atualizarValoresVoz();
    },


    atualizarDadosPersonagem() {

        const e =
            this.elementos;


        if (e.headerName) {

            e.headerName.textContent =
                configuracao
                    .personagem
                    .nome;
        }


        if (e.headerDescription) {

            e.headerDescription.textContent =
                configuracao
                    .personagem
                    .descricao;
        }


        if (e.bioAvatar) {

            e.bioAvatar.src =
                configuracao
                    .personagem
                    .avatar
                    .normal;
        }


        if (e.bioName) {

            e.bioName.textContent =
                configuracao
                    .personagem
                    .nome;
        }


        if (e.bioDescription) {

            e.bioDescription.textContent =
                configuracao
                    .personagem
                    .descricao;
        }


        if (e.characterTitle) {

            e.characterTitle.textContent =
                configuracao
                    .personagem
                    .nome;
        }


        if (e.captionTitle) {

            e.captionTitle.textContent =
                "Personalidade ao falar";
        }


        if (e.messageInput) {

            e.messageInput.placeholder =
                configuracao
                    .personagem
                    .placeholder;
        }


        if (e.providerReadout) {

            e.providerReadout.textContent =
                configuracao
                    .ia
                    .provedor;
        }


        if (e.modelReadout) {

            e.modelReadout.textContent =
                configuracao
                    .ia
                    .modelo ||
                "—";
        }


        if (e.autoSpeakToggle) {

            e.autoSpeakToggle.checked =
                configuracaoVoz
                    .falarAutomaticamente;
        }


        if (e.rateRange) {

            e.rateRange.value =
                configuracaoVoz
                    .velocidade;
        }


        if (e.pitchRange) {

            e.pitchRange.value =
                configuracaoVoz
                    .tom;
        }


        if (e.volumeRange) {

            e.volumeRange.value =
                configuracaoVoz
                    .volume;
        }
    },


    adicionarMensagem(
        mensagem
    ) {

        if (!this.elementos.messages) {

            return;
        }


        const wrapper =
            document.createElement(
                "article"
            );


        wrapper.className =
            `message ${mensagem.role}`;


        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "message-bubble";


        /*
         * textContent evita HTML injetado
         * pela IA.
         */

        bubble.textContent =
            mensagem.content;


        const meta =
            document.createElement(
                "div"
            );


        meta.className =
            "message-meta";


        const hora =
            document.createElement(
                "span"
            );


        hora.textContent =
            formatarHora(
                mensagem.timestamp
            );


        meta.appendChild(
            hora
        );


        if (
            mensagem.role ===
            "assistant"
        ) {

            const ouvir =
                document.createElement(
                    "button"
                );


            ouvir.className =
                "speak-button";


            ouvir.type =
                "button";


            ouvir.textContent =
                "🔊 Ouvir";


            ouvir.addEventListener(
                "click",
                () => {

                    falarMensagem(
                        mensagem.content
                    );
                }
            );


            meta.appendChild(
                ouvir
            );
        }


        wrapper.append(
            bubble,
            meta
        );


        this.elementos.messages
            .appendChild(
                wrapper
            );


        this.rolarParaFim();

        this.atualizarContador();
    },


    renderizarHistorico() {

        if (
            !this.elementos.messages
        ) {

            return;
        }


        this.elementos.messages
            .innerHTML = "";


        historicoConversa.forEach(
            mensagem => {

                this.adicionarMensagem(
                    mensagem
                );
            }
        );


        this.atualizarContador();
    },


    mostrarProcessamento(
        valor
    ) {

        if (
            this.elementos
                .processingIndicator
        ) {

            this.elementos
                .processingIndicator
                .hidden =
                !valor;
        }


        if (
            this.elementos
                .sendButton
        ) {

            this.elementos
                .sendButton
                .disabled =
                valor;
        }
    },


    preencherEditorPersona() {

        const e =
            this.elementos;


        if (e.personaName) {

            e.personaName.value =
                persona.nome;
        }


        if (e.personaDescription) {

            e.personaDescription.value =
                configuracao
                    .personagem
                    .descricao;
        }


        if (e.personaPersonality) {

            e.personaPersonality.value =
                persona
                    .personalidade
                    .trim();
        }


        if (e.personaStyle) {

            e.personaStyle.value =
                persona
                    .estiloDeFala
                    .trim();
        }


        if (e.personaKnowledge) {

            e.personaKnowledge.value =
                persona
                    .conhecimentos
                    .trim();
        }


        if (e.personaLimitations) {

            e.personaLimitations.value =
                persona
                    .limitacoes
                    .trim();
        }


        if (e.formalityRange) {

            e.formalityRange.value =
                personalidadeEditavel
                    .formalidade;
        }


        if (e.humorRange) {

            e.humorRange.value =
                personalidadeEditavel
                    .humor;
        }


        if (e.objectivityRange) {

            e.objectivityRange.value =
                personalidadeEditavel
                    .objetividade;
        }


        if (e.depthRange) {

            e.depthRange.value =
                personalidadeEditavel
                    .profundidade;
        }


        this.atualizarValoresPersona();
    },


    atualizarValoresPersona() {

        const e =
            this.elementos;


        if (e.formalityValue) {

            e.formalityValue.textContent =
                `${personalidadeEditavel.formalidade}%`;
        }


        if (e.humorValue) {

            e.humorValue.textContent =
                `${personalidadeEditavel.humor}%`;
        }


        if (e.objectivityValue) {

            e.objectivityValue.textContent =
                `${personalidadeEditavel.objetividade}%`;
        }


        if (e.depthValue) {

            e.depthValue.textContent =
                `${personalidadeEditavel.profundidade}%`;
        }
    },


    marcarPersonaEditada(
        texto =
            "Alterações não aplicadas"
    ) {

        if (
            this.elementos.personaEditStatus
        ) {

            this.elementos
                .personaEditStatus
                .textContent =
                texto;
        }
    },


    atualizarContador() {

        const quantidade =
            historicoConversa.length;


        if (
            this.elementos.messageCount
        ) {

            this.elementos
                .messageCount
                .textContent =

                `${quantidade} ` +

                `${
                    quantidade === 1
                        ? "mensagem"
                        : "mensagens"
                }`;
        }
    },


    rolarParaFim() {

        requestAnimationFrame(
            () => {

                if (
                    this.elementos.messages
                ) {

                    this.elementos.messages
                        .scrollTop =
                        this.elementos.messages
                            .scrollHeight;
                }
            }
        );
    },


    atualizarValoresVoz() {

        const e =
            this.elementos;


        if (e.rateValue) {

            e.rateValue.textContent =
                Number(
                    configuracaoVoz
                        .velocidade
                ).toFixed(2);
        }


        if (e.pitchValue) {

            e.pitchValue.textContent =
                Number(
                    configuracaoVoz
                        .tom
                ).toFixed(2);
        }


        if (e.volumeValue) {

            e.volumeValue.textContent =
                Number(
                    configuracaoVoz
                        .volume
                ).toFixed(2);
        }
    },


    abrirConfiguracoes() {

        if (
            this.elementos
                .settingsBackdrop
        ) {

            this.elementos
                .settingsBackdrop
                .hidden =
                false;
        }
    },


    fecharConfiguracoes() {

        if (
            this.elementos
                .settingsBackdrop
        ) {

            this.elementos
                .settingsBackdrop
                .hidden =
                true;
        }
    }
};


/* =========================================================
   19. CONTROLADOR DO CHAT
   ========================================================= */

const ChatController = (() => {

    let processando = false;


    async function enviarMensagem(
        texto
    ) {

        if (processando) {

            return;
        }


        texto =
            String(texto || "")
                .trim();


        if (!texto) {

            return;
        }


        processando =
            true;


        const mensagemUsuario = {

            role:
                "user",

            content:
                texto,

            timestamp:
                Date.now(),

            type:
                "text"
        };


        historicoConversa.push(
            mensagemUsuario
        );


        UI.adicionarMensagem(
            mensagemUsuario
        );


        salvarHistorico();


        if (
            UI.elementos.messageInput
        ) {

            UI.elementos
                .messageInput
                .value = "";

            ajustarTextarea();
        }


        UI.mostrarProcessamento(
            true
        );


        AvatarManager
            .definirEstadoPersonagem(
                "pensando"
            );


        try {

            const resposta =
                await gerarRespostaIA(
                    texto
                );


            const mensagemIA = {

                role:
                    "assistant",

                content:
                    resposta,

                timestamp:
                    Date.now(),

                type:
                    "text"
            };


            historicoConversa.push(
                mensagemIA
            );


            UI.adicionarMensagem(
                mensagemIA
            );


            salvarHistorico();


            if (
                configuracaoVoz
                    .falarAutomaticamente
            ) {

                await falarMensagem(
                    resposta
                );

            }

            else {

                AvatarManager
                    .definirEstadoPersonagem(
                        "normal"
                    );
            }

        }

        catch (erro) {

            console.error(
                "ERRO COMPLETO:",
                erro
            );


            const mensagemErro = {

                role:
                    "assistant",

                content:
                    `Não foi possível gerar a resposta.

${erro.message}`,

                timestamp:
                    Date.now(),

                type:
                    "error"
            };


            historicoConversa.push(
                mensagemErro
            );


            UI.adicionarMensagem(
                mensagemErro
            );


            salvarHistorico();


            AvatarManager
                .definirEstadoPersonagem(
                    "normal"
                );
        }


        finally {

            processando =
                false;


            UI.mostrarProcessamento(
                false
            );
        }
    }


    function limpar() {

        VoiceManager.parar();


        historicoConversa =
            [];


        salvarHistorico();


        UI.renderizarHistorico();


        adicionarMensagemInicial();
    }


    return {

        enviarMensagem,

        limpar,

        estaProcessando:
            () =>
                processando
    };

})();


/* =========================================================
   20. TTS CENTRAL
   ========================================================= */

async function falarTexto(
    texto
) {

    if (
        configuracao.tts.tipo ===
        "navegador"
    ) {

        return VoiceManager.falarTexto(

            texto,

            {

                onstart: () => {

                    AvatarManager
                        .definirEstadoPersonagem(
                            "falando"
                        );
                },

                onend: () => {

                    AvatarManager
                        .definirEstadoPersonagem(
                            "normal"
                        );
                },

                onerror: () => {

                    AvatarManager
                        .definirEstadoPersonagem(
                            "normal"
                        );
                }
            }
        );
    }


    if (
        configuracao.tts.tipo ===
        "backend"
    ) {

        throw new Error(
            "TTS externo ainda não implementado."
        );
    }
}


/* =========================================================
   21. FALAR MENSAGEM
   ========================================================= */

async function falarMensagem(
    texto
) {

    if (
        !configuracaoVoz.ativada
    ) {

        return;
    }


    VoiceManager.parar();


    try {

        await falarTexto(
            texto
        );

    }

    catch (erro) {

        console.error(
            "Erro no TTS:",
            erro
        );


        AvatarManager
            .definirEstadoPersonagem(
                "normal"
            );
    }
}


/* =========================================================
   22. HISTÓRICO
   ========================================================= */

function salvarHistorico() {

    if (
        !configuracao
            .historico
            .usarLocalStorage
    ) {

        return;
    }


    try {

        localStorage.setItem(

            configuracao
                .historico
                .chave,

            JSON.stringify(
                historicoConversa
            )
        );

    }

    catch (erro) {

        console.warn(
            "Erro ao salvar histórico:",
            erro
        );
    }
}


/* =========================================================
   23. CARREGAR HISTÓRICO
   ========================================================= */

function carregarHistorico() {

    if (
        !configuracao
            .historico
            .usarLocalStorage
    ) {

        return [];
    }


    try {

        const dados =
            localStorage.getItem(

                configuracao
                    .historico
                    .chave
            );


        if (!dados) {

            return [];
        }


        const convertido =
            JSON.parse(
                dados
            );


        return Array.isArray(
            convertido
        )
            ? convertido
            : [];

    }

    catch (erro) {

        console.warn(
            "Erro ao carregar histórico:",
            erro
        );


        return [];
    }
}


/* =========================================================
   24. APLICAR PERSONALIDADE
   ========================================================= */

function aplicarPersonalidadeEditada() {

    const e =
        UI.elementos;


    const nomeAnterior =
        configuracao
            .personagem
            .nome;


    persona.nome =
        e.personaName?.value.trim() ||
        "Persona";


    persona.personalidade =
        e.personaPersonality
            ?.value
            .trim() ||
        "";


    persona.estiloDeFala =
        e.personaStyle
            ?.value
            .trim() ||
        "";


    persona.conhecimentos =
        e.personaKnowledge
            ?.value
            .trim() ||
        "";


    persona.limitacoes =
        e.personaLimitations
            ?.value
            .trim() ||
        "";


    configuracao
        .personagem
        .nome =
        persona.nome;


    configuracao
        .personagem
        .descricao =

        e.personaDescription
            ?.value
            .trim() ||

        "Personalidade configurável";


    personalidadeEditavel.formalidade =
        Number(
            e.formalityRange?.value ||
            70
        );


    personalidadeEditavel.humor =
        Number(
            e.humorRange?.value ||
            10
        );


    personalidadeEditavel.objetividade =
        Number(
            e.objectivityRange?.value ||
            80
        );


    personalidadeEditavel.profundidade =
        Number(
            e.depthRange?.value ||
            70
        );


    UI.atualizarDadosPersonagem();

    UI.atualizarValoresPersona();


    UI.marcarPersonaEditada(
        "Aplicado e salvo"
    );


    salvarConfiguracaoEditavel();


    if (
        nomeAnterior !==
        persona.nome
    ) {

        document.title =
            `Chatbot de ${persona.nome}`;
    }
}


/* =========================================================
   25. RESTAURAR PERSONA
   ========================================================= */

function restaurarPersonalidadePadrao() {

    if (
        !confirm(
            "Restaurar a personalidade padrão?"
        )
    ) {

        return;
    }


    localStorage.removeItem(
        CHAVE_PERSONA
    );


    location.reload();
}


/* =========================================================
   26. EVENTOS
   ========================================================= */

function configurarEventos() {

    const input =
        UI.elementos.messageInput;


    /* -----------------------------------------------------
       FORMULÁRIO
       ----------------------------------------------------- */

    const composer =
        document.querySelector(
            "#composer"
        );


    if (composer) {

        composer.addEventListener(
            "submit",
            evento => {

                evento.preventDefault();


                ChatController
                    .enviarMensagem(
                        input.value
                    );
            }
        );
    }


    /* -----------------------------------------------------
       ENTER
       ----------------------------------------------------- */

    if (input) {

        input.addEventListener(
            "keydown",
            evento => {

                if (

                    evento.key ===
                    "Enter" &&

                    !evento.shiftKey

                ) {

                    evento.preventDefault();


                    composer?.requestSubmit();
                }
            }
        );


        input.addEventListener(
            "input",
            ajustarTextarea
        );
    }


    /* -----------------------------------------------------
       NOVO CHAT
       ----------------------------------------------------- */

    document
        .querySelector(
            "#newChatButton"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    ChatController
                        .estaProcessando()
                ) {

                    return;
                }


                if (
                    confirm(
                        "Começar uma nova conversa?"
                    )
                ) {

                    ChatController.limpar();
                }
            }
        );


    /* -----------------------------------------------------
       LIMPAR HISTÓRICO
       ----------------------------------------------------- */

    document
        .querySelector(
            "#clearHistoryButton"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Limpar todo o histórico?"
                    )
                ) {

                    ChatController.limpar();
                }
            }
        );


    /* -----------------------------------------------------
       PARAR VOZ
       ----------------------------------------------------- */

    document
        .querySelector(
            "#stopVoiceButton"
        )
        ?.addEventListener(
            "click",
            () => {

                VoiceManager.parar();


                AvatarManager
                    .definirEstadoPersonagem(
                        "normal"
                    );
            }
        );


    /* -----------------------------------------------------
       CONFIGURAÇÕES
       ----------------------------------------------------- */

    document
        .querySelector(
            "#settingsButton"
        )
        ?.addEventListener(
            "click",
            () => {

                UI.abrirConfiguracoes();
            }
        );


    document
        .querySelector(
            "#closeSettingsButton"
        )
        ?.addEventListener(
            "click",
            () => {

                UI.fecharConfiguracoes();
            }
        );


    /* -----------------------------------------------------
       CLIQUE FORA
       ----------------------------------------------------- */

    UI.elementos
        .settingsBackdrop
        ?.addEventListener(
            "click",
            evento => {

                if (
                    evento.target ===
                    UI.elementos
                        .settingsBackdrop
                ) {

                    UI.fecharConfiguracoes();
                }
            }
        );


    /* -----------------------------------------------------
       TESTAR VOZ
       ----------------------------------------------------- */

    document
        .querySelector(
            "#testVoiceButton"
        )
        ?.addEventListener(
            "click",
            () => {

                VoiceManager.parar();


                falarTexto(

                    `Esta é uma demonstração ` +
                    `da voz configurada para ` +
                    `${configuracao.personagem.nome}.`
                );
            }
        );


    /* -----------------------------------------------------
       FALA AUTOMÁTICA
       ----------------------------------------------------- */

    UI.elementos
        .autoSpeakToggle
        ?.addEventListener(
            "change",
            evento => {

                configuracaoVoz
                    .falarAutomaticamente =
                    evento.target.checked;


                salvarConfiguracaoEditavel();
            }
        );


    /* -----------------------------------------------------
       VOZ
       ----------------------------------------------------- */

    UI.elementos
        .voiceSelect
        ?.addEventListener(
            "change",
            evento => {

                configuracaoVoz
                    .vozPreferida =
                    evento.target.value;


                salvarConfiguracaoEditavel();
            }
        );


    /* -----------------------------------------------------
       VELOCIDADE
       ----------------------------------------------------- */

    UI.elementos
        .rateRange
        ?.addEventListener(
            "input",
            evento => {

                configuracaoVoz.velocidade =
                    Number(
                        evento.target.value
                    );


                UI.atualizarValoresVoz();


                salvarConfiguracaoEditavel();
            }
        );


    /* -----------------------------------------------------
       TOM
       ----------------------------------------------------- */

    UI.elementos
        .pitchRange
        ?.addEventListener(
            "input",
            evento => {

                configuracaoVoz.tom =
                    Number(
                        evento.target.value
                    );


                UI.atualizarValoresVoz();


                salvarConfiguracaoEditavel();
            }
        );


    /* -----------------------------------------------------
       VOLUME
       ----------------------------------------------------- */

    UI.elementos
        .volumeRange
        ?.addEventListener(
            "input",
            evento => {

                configuracaoVoz.volume =
                    Number(
                        evento.target.value
                    );


                UI.atualizarValoresVoz();


                salvarConfiguracaoEditavel();
            }
        );


    /* -----------------------------------------------------
       APLICAR PERSONA
       ----------------------------------------------------- */

    document
        .querySelector(
            "#applyPersonaButton"
        )
        ?.addEventListener(
            "click",
            aplicarPersonalidadeEditada
        );


    /* -----------------------------------------------------
       RESTAURAR PERSONA
       ----------------------------------------------------- */

    document
        .querySelector(
            "#resetPersonaButton"
        )
        ?.addEventListener(
            "click",
            restaurarPersonalidadePadrao
        );


    /* -----------------------------------------------------
       CAMPOS DA PERSONA
       ----------------------------------------------------- */

    [

        UI.elementos.personaName,

        UI.elementos.personaDescription,

        UI.elementos.personaPersonality,

        UI.elementos.personaStyle,

        UI.elementos.personaKnowledge,

        UI.elementos.personaLimitations

    ]

    .filter(Boolean)

    .forEach(
        campo => {

            campo.addEventListener(
                "input",
                () => {

                    UI.marcarPersonaEditada();
                }
            );
        }
    );


    /* -----------------------------------------------------
       FORMALIDADE
       ----------------------------------------------------- */

    UI.elementos
        .formalityRange
        ?.addEventListener(
            "input",
            evento => {

                personalidadeEditavel.formalidade =
                    Number(
                        evento.target.value
                    );


                UI.atualizarValoresPersona();

                UI.marcarPersonaEditada();
            }
        );


    /* -----------------------------------------------------
       HUMOR
       ----------------------------------------------------- */

    UI.elementos
        .humorRange
        ?.addEventListener(
            "input",
            evento => {

                personalidadeEditavel.humor =
                    Number(
                        evento.target.value
                    );


                UI.atualizarValoresPersona();

                UI.marcarPersonaEditada();
            }
        );


    /* -----------------------------------------------------
       OBJETIVIDADE
       ----------------------------------------------------- */

    UI.elementos
        .objectivityRange
        ?.addEventListener(
            "input",
            evento => {

                personalidadeEditavel.objetividade =
                    Number(
                        evento.target.value
                    );


                UI.atualizarValoresPersona();

                UI.marcarPersonaEditada();
            }
        );


    /* -----------------------------------------------------
       PROFUNDIDADE
       ----------------------------------------------------- */

    UI.elementos
        .depthRange
        ?.addEventListener(
            "input",
            evento => {

                personalidadeEditavel.profundidade =
                    Number(
                        evento.target.value
                    );


                UI.atualizarValoresPersona();

                UI.marcarPersonaEditada();
            }
        );


    /* -----------------------------------------------------
       EXPORTAR
       ----------------------------------------------------- */

    document
        .querySelector(
            "#exportHistoryButton"
        )
        ?.addEventListener(
            "click",
            exportarHistorico
        );


    /* -----------------------------------------------------
       EXCLUIR
       ----------------------------------------------------- */

    document
        .querySelector(
            "#deleteHistoryButton"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Apagar permanentemente o histórico local?"
                    )
                ) {

                    VoiceManager.parar();


                    historicoConversa =
                        [];


                    salvarHistorico();


                    UI.renderizarHistorico();


                    adicionarMensagemInicial();
                }
            }
        );


    /* -----------------------------------------------------
       ESC
       ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key ===
                "Escape"
            ) {

                UI.fecharConfiguracoes();
            }
        }
    );


    /* -----------------------------------------------------
       SAIR
       ----------------------------------------------------- */

    window.addEventListener(
        "beforeunload",
        () => {

            VoiceManager.parar();
        }
    );
}


/* =========================================================
   27. INICIALIZAÇÃO
   ========================================================= */

function inicializarAplicacao() {

    console.log(
        "Inicializando chatbot..."
    );


    /* -----------------------------------------------------
       CONFIGURAÇÕES
       ----------------------------------------------------- */

    carregarConfiguracaoEditavel();


    /* -----------------------------------------------------
       INTERFACE
       ----------------------------------------------------- */

    UI.iniciar();


    /* -----------------------------------------------------
       HISTÓRICO
       ----------------------------------------------------- */

    historicoConversa =
        carregarHistorico();


    /* -----------------------------------------------------
       EVENTOS
       ----------------------------------------------------- */

    configurarEventos();


    /* -----------------------------------------------------
       HISTÓRICO NA TELA
       ----------------------------------------------------- */

    UI.renderizarHistorico();


    /* -----------------------------------------------------
       AVATAR
       ----------------------------------------------------- */

    AvatarManager
        .definirEstadoPersonagem(
            "normal"
        );


    /* -----------------------------------------------------
       MENSAGEM INICIAL
       ----------------------------------------------------- */

    if (
        !historicoConversa.length
    ) {

        adicionarMensagemInicial();
    }


    /* -----------------------------------------------------
       VOZES
       ----------------------------------------------------- */

    VoiceManager.carregarVozes();


    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis
            .onvoiceschanged =
            () => {

                VoiceManager
                    .carregarVozes();
            };
    }


    ajustarTextarea();


    console.log(
        "Chatbot inicializado."
    );


    console.log(
        "Backend:",
        configuracao.ia.endpoint
    );
}


/* =========================================================
   28. MENSAGEM INICIAL
   ========================================================= */

function adicionarMensagemInicial() {

    const inicial = {

        role:
            "assistant",

        content:
            configuracao
                .personagem
                .mensagemInicial,

        timestamp:
            Date.now(),

        type:
            "welcome"
    };


    historicoConversa.push(
        inicial
    );


    UI.adicionarMensagem(
        inicial
    );


    salvarHistorico();
}


/* =========================================================
   29. FORMATAR HORA
   ========================================================= */

function formatarHora(
    timestamp
) {

    return new Intl.DateTimeFormat(

        configuracao
            .personagem
            .idioma,

        {

            hour:
                "2-digit",

            minute:
                "2-digit"
        }

    ).format(
        new Date(timestamp)
    );
}


/* =========================================================
   30. TEXTAREA
   ========================================================= */

function ajustarTextarea() {

    const textarea =
        UI.elementos.messageInput;


    if (!textarea) {

        return;
    }


    textarea.style.height =
        "auto";


    textarea.style.height =

        `${Math.min(
            textarea.scrollHeight,
            160
        )}px`;
}


/* =========================================================
   31. ESPERAR
   ========================================================= */

function esperar(
    ms
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


/* =========================================================
   32. EXPORTAR HISTÓRICO
   ========================================================= */

function exportarHistorico() {

    const dados =
        JSON.stringify(

            {

                personagem:
                    configuracao
                        .personagem
                        .nome,

                exportadoEm:
                    new Date()
                        .toISOString(),

                mensagens:
                    historicoConversa
            },

            null,

            2
        );


    const blob =
        new Blob(

            [dados],

            {

                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `conversa-${slugificar(
            configuracao
                .personagem
                .nome
        )}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );
}


/* =========================================================
   33. SLUG
   ========================================================= */

function slugificar(
    texto
) {

    return String(texto)

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .toLowerCase()

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-|-$/g,
            ""
        );
}


/* =========================================================
   34. INICIAR
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarAplicacao
    );

}

else {

    inicializarAplicacao();
}