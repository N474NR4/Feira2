/* =========================================================
   CHATBOT DE PERSONA — SERVER.JS
   =========================================================

   SERVIDOR:

       Navegador
           ↓
       POST /api/chat
           ↓
       Node.js
           ↓
       OpenAI API
           ↓
       Node.js
           ↓
       Navegador

   IMPORTANTE:

   A chave da API NÃO fica no script.js.

   Ela fica em:

       .env

   Exemplo:

       OPENAI_API_KEY=sua_chave_aqui

   ========================================================= */


/* =========================================================
   1. IMPORTA DEPENDÊNCIAS
   ========================================================= */

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();


/* =========================================================
   2. CONFIGURAÇÕES
   ========================================================= */

const PORT = process.env.PORT || 3000;


/* =========================================================
   3. VERIFICA API KEY
   ========================================================= */

if (!process.env.OPENAI_API_KEY) {

    console.error(
        "\nERRO: OPENAI_API_KEY não foi encontrada.\n" +
        "Crie um arquivo .env e coloque sua chave nele.\n"
    );

    process.exit(1);
}


/* =========================================================
   4. CLIENTE OPENAI
   ========================================================= */

const openai = new OpenAI({

    apiKey:
        process.env.OPENAI_API_KEY

});


/* =========================================================
   5. EXPRESS
   ========================================================= */

const app = express();


/* =========================================================
   6. MIDDLEWARES
   ========================================================= */

/*
 * Permite requisições vindas do navegador.
 */

app.use(
    cors()
);


/*
 * Permite receber JSON.
 */

app.use(
    express.json({
        limit: "1mb"
    })
);


/*
 * Serve os arquivos do frontend.
 *
 * Portanto:

     http://localhost:3000/

   abre seu index.html.
 */

app.use(
    express.static(
        path.join(__dirname)
    )
);


/* =========================================================
   7. ROTA PRINCIPAL
   ========================================================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }
);


/* =========================================================
   8. ROTA DE TESTE
   =========================================================

   Acesse:

       http://localhost:3000/api/status

   para verificar se o servidor está funcionando.
   ========================================================= */

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            online: true,

            servidor:
                "Chatbot de Persona",

            ia:
                "OpenAI",

            modelo:
                process.env.OPENAI_MODEL ||
                "gpt-5.6-luna"

        });

    }
);


/* =========================================================
   9. ROTA DA IA
   =========================================================

   Esta é a rota usada pelo seu script.js:

       POST /api/chat

   ========================================================= */

app.post(
    "/api/chat",
    async (req, res) => {

        try {

            /* =================================================
               RECEBE DADOS DO FRONTEND
               ================================================= */

            const {

                model,

                temperature,

                max_tokens,

                system,

                messages

            } = req.body;


            /* =================================================
               VALIDA MENSAGEM
               ================================================= */

            if (
                !messages ||
                !Array.isArray(messages)
            ) {

                return res.status(400).json({

                    error:
                        "O campo 'messages' é obrigatório."

                });

            }


            /* =================================================
               PROCURA A MENSAGEM DO USUÁRIO
               ================================================= */

            const mensagensValidas =
                messages.filter(
                    mensagem =>

                        mensagem &&

                        (
                            mensagem.role === "user" ||
                            mensagem.role === "assistant"
                        ) &&

                        typeof mensagem.content === "string"

                );


            if (
                !mensagensValidas.length
            ) {

                return res.status(400).json({

                    error:
                        "Nenhuma mensagem válida foi enviada."

                });

            }


            /* =================================================
               ESCOLHE O MODELO
               =================================================

               O frontend pode mandar um modelo.

               Mas podemos definir um padrão no servidor.

               .env:

                   OPENAI_MODEL=gpt-5.6-luna

               ================================================= */

            const modelo =

                process.env.OPENAI_MODEL ||

                model ||

                "gpt-4o-mini";


            /* =================================================
               LIMITE DE HISTÓRICO
               =================================================

               Evita mandar uma conversa gigantesca para a API.

               Mantemos as últimas 30 mensagens.

               O prompt da persona fica separado.
               ================================================= */

            const historico =

                mensagensValidas.slice(-30);


            /* =================================================
               MONTA O PROMPT DO SISTEMA
               ================================================= */

            const instrucoes =

                typeof system === "string" &&
                system.trim()

                    ? system.trim()

                    : `

Você é uma inteligência artificial de conversação.

Responda de maneira clara, coerente e útil.

Siga as instruções de personalidade recebidas
pelo aplicativo.

Não invente fatos quando não houver informação
suficiente.

`;


            /* =================================================
               CONVERTE HISTÓRICO
               =================================================

               A Responses API recebe a entrada como mensagens.

               ================================================= */

            const input = historico.map(
                mensagem => ({

                    role:
                        mensagem.role,

                    content:
                        mensagem.content

                })
            );


            /* =================================================
               CHAMADA PARA OPENAI
               ================================================= */

            const resposta =
                await openai.responses.create({

                    /*
                     * Modelo utilizado.
                     */

                    model:
                        modelo,


                    /*
                     * Prompt da persona.

                     * É aqui que entram:

                       Alan Turing
                       personalidade
                       estilo
                       limitações
                       contexto histórico
                       sliders
                       etc.
                     */

                    instructions:
                        instrucoes,


                    /*
                     * Histórico da conversa.
                     */

                    input:


                        input,


                    /*
                     * Temperatura.

                     * Alguns modelos modernos podem
                     * não aceitar certos parâmetros.

                     * Por isso só enviamos se existir.
                     */

                    ...(typeof temperature === "number"
                        ? {
                            temperature:
                                Math.max(
                                    0,
                                    Math.min(
                                        2,
                                        temperature
                                    )
                                )
                        }
                        : {}),


                    /*
                     * Limite de saída.

                     * O frontend chama isso de max_tokens.
                     */

                    ...(typeof max_tokens === "number"
                        ? {
                            max_output_tokens:
                                Math.max(
                                    1,
                                    Math.min(
                                        4000,
                                        max_tokens
                                    )
                                )
                        }
                        : {})

                });


            /* =================================================
               PEGA TEXTO DA RESPOSTA
               ================================================= */

            const texto =
                resposta.output_text;


            /* =================================================
               VERIFICA RESPOSTA
               ================================================= */

            if (
                !texto ||
                !texto.trim()
            ) {

                console.error(
                    "OpenAI retornou uma resposta sem texto:",
                    resposta
                );


                return res.status(502).json({

                    error:
                        "A IA não retornou texto."

                });

            }


            /* =================================================
               ENVIA RESPOSTA PARA O FRONTEND
               ================================================= */

            return res.json({

                reply:
                    texto.trim(),

                model:
                    modelo

            });


        } catch (erro) {

            /* =================================================
               LOG DO ERRO
               ================================================= */

            console.error(
                "\n========================================"
            );

            console.error(
                "ERRO NA IA"
            );

            console.error(
                "========================================"
            );

            console.error(
                erro
            );

            console.error(
                "========================================\n"
            );


            /* =================================================
               IDENTIFICA ERRO DA API
               ================================================= */

            const status =
                erro?.status ||
                500;


            const mensagem =

                erro?.error?.message ||

                erro?.message ||

                "Erro desconhecido ao consultar a IA.";


            /* =================================================
               RESPOSTA DE ERRO
               ================================================= */

            return res.status(
                status >= 400 && status < 600
                    ? status
                    : 500
            ).json({

                error:
                    mensagem

            });

        }

    }
);


/* =========================================================
   10. TRATAMENTO DE ROTA NÃO ENCONTRADA
   ========================================================= */

app.use(
    (req, res) => {

        res.status(404).json({

            error:
                "Rota não encontrada."

        });

    }
);


/* =========================================================
   11. TRATAMENTO GLOBAL DE ERROS
   ========================================================= */

app.use(
    (erro, req, res, next) => {

        console.error(
            "Erro interno:",
            erro
        );


        res.status(500).json({

            error:
                "Erro interno do servidor."

        });

    }
);


/* =========================================================
   12. INICIA SERVIDOR
   ========================================================= */

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "=========================================="
        );

        console.log(
            "   CHATBOT DE PERSONA"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `Servidor: http://localhost:${PORT}`
        );

        console.log(
            `API:      http://localhost:${PORT}/api/chat`
        );

        console.log(
            `Status:   http://localhost:${PORT}/api/status`
        );

        console.log(
            `Modelo:   ${
                process.env.OPENAI_MODEL ||
                "gpt-5.6-luna"
            }`
        );

        console.log(
            "=========================================="
        );

        console.log(
            "Servidor iniciado com sucesso."
        );

        console.log("");

    }
);