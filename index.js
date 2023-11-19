const express = require("express")

const app = express()

app.get('/', (requisicao, resposta) => {
    resposta.send("olá mundo")
})

app.listen(3000, () => {
    console.log('servidor rodando na porta 3000')
})