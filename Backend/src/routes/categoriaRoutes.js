const express = require("express");
const router = express.Router();

const {
    listarCategorias,
    buscarCategoria,
    cadastrarCategoria,
    atualizarCategoria,
    excluirCategoria
} = require("../controllers/categoriaController");

// GET
router.get("/", listarCategorias);

// GET por ID
router.get("/:id", buscarCategoria);

// POST
router.post("/", cadastrarCategoria);

// PUT
router.put("/:id", atualizarCategoria);

// DELETE
router.delete("/:id", excluirCategoria);

module.exports = router;