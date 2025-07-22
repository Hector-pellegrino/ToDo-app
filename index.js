const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql2");

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));

//converter dados do formulário em objetos js
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//rotas
app.get("/limparTarefas", (requisicao, resposta) => {
  const sql = "DELETE FROM tarefas";

  conexao.query(sql, (erro) => {
    if (erro) {
      return console.log(erro);
    }

    resposta.redirect("/");
  });
});

app.post("/excluir", (requisicao, resposta) => {
  const id = requisicao.body.id;

  const sql = `
        DELETE FROM tarefas
        WHERE id = ${id}
    `;
  conexao.query(sql, (erro) => {
    if (erro) {
      return console.log(erro);
    }

    resposta.redirect("/");
  });
});

app.post("/descompletar", (requisicao, resposta) => {
  const id = requisicao.body.id;

  const sql = `
        UPDATE tarefas
        SET completa = '0'
        WHERE id = ${id}
    `;

  conexao.query(sql, (erro) => {
    if (erro) {
      return console.log(erro);
    }

    resposta.redirect("/");
  });
});

app.post("/completar", (requisicao, resposta) => {
  const id = requisicao.body.id;

  const sql = `
        UPDATE tarefas
        SET completa = '1'
        WHERE id = ${id}
    `;

  conexao.query(sql, (erro) => {
    if (erro) {
      return console.log(erro);
    }

    resposta.redirect("/");
  });
});

app.post("/criar", (requisicao, resposta) => {
  const descricao = requisicao.body.descricao;
  const completa = 0;

  const sql = `
        INSERT INTO tarefas(descricao, completa)
        VALUES ('${descricao}', '${completa}')
    `;

  conexao.query(sql, (erro) => {
    if (erro) {
      return console.log(erro);
    }

    resposta.redirect("/");
  });
});

app.get("/completas", (requisicao, resposta) => {
  const sql = `
        SELECT * FROM tarefas
        WHERE completa = 1
    `;

  conexao.query(sql, (erro, dados) => {
    if (erro) {
      return console.log(erro);
    }

    const tarefas = dados.map((dado) => {
      return {
        id: dado.id,
        descricao: dado.descricao,
        completa: true,
      };
    });

    const quantidadeTarefas = tarefas.length;

    resposta.render("completas", { tarefas, quantidadeTarefas });
  });
});

app.get("/ativas", (requisicao, resposta) => {
  const sql = `
        SELECT * FROM tarefas
        WHERE completa = 0
    `;
  conexao.query(sql, (erro, dados) => {
    if (erro) {
      return console.log(erro);
    }

    const tarefas = dados.map((dado) => {
      return {
        id: dado.id,
        descricao: dado.descricao,
        completa: false,
      };
    });

    const quantidadeTarefas = tarefas.length;

    resposta.render("ativas", { tarefas, quantidadeTarefas });
  });
});

app.get("/", (requisicao, resposta) => {
  const sql = "SELECT * FROM tarefas";

  conexao.query(sql, (erro, dados) => {
    if (erro) {
      return console.log(erro);
    }

    const tarefas = dados.map((dado) => {
      return {
        id: dado.id,
        descricao: dado.descricao,
        completa: dado.completa === 0 ? false : true,
      };
    });

    const tarefasAtivas = tarefas.filter((tarefa) => {
      return tarefa.completa === false && tarefa;
    });

    const quantidadeTarefasAtivas = tarefasAtivas.length;

    resposta.render("home", { tarefas, quantidadeTarefasAtivas });
  });
});

const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "todoapp",
  port: 3306,
});

conexao.connect((erro) => {
  if (erro) {
    return console.log(erro);
  }

  console.log("EStou conectado ao mysql");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
