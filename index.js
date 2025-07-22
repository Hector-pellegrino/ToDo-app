const express = require("express");
const exphbs = require("express-handlebars");
require("dotenv").config();
const { Pool } = require("pg");
console.log(process.env.DATABASE_URL);

const app = express();

// Configuração do banco PostgreSQL com URL do Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Rotas
app.get("/limparTarefas", async (req, res) => {
  try {
    await pool.query("DELETE FROM tarefas");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/excluir", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/descompletar", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("UPDATE tarefas SET completa = false WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/completar", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("UPDATE tarefas SET completa = true WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/criar", async (req, res) => {
  const { descricao } = req.body;
  try {
    await pool.query(
      "INSERT INTO tarefas (descricao, completa) VALUES ($1, false)",
      [descricao]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/completas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE completa = true"
    );
    const tarefas = result.rows;
    res.render("completas", { tarefas, quantidadeTarefas: tarefas.length });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/ativas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE completa = false"
    );
    const tarefas = result.rows;
    res.render("ativas", { tarefas, quantidadeTarefas: tarefas.length });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tarefas");
    const tarefas = result.rows;
    const tarefasAtivas = tarefas.filter((t) => !t.completa);
    res.render("home", {
      tarefas,
      quantidadeTarefasAtivas: tarefasAtivas.length,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
