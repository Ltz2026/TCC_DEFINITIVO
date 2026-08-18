const Categoria = require("../models/Categoria");

// Listar categorias
const listarCategorias = async (req, res) => {

    try {

        const categorias = await Categoria.find();

        res.status(200).json(categorias);

    } catch (error) {

        res.status(500).json({
            mensagem: error.message
        });

    }

};

// Buscar categoria
const buscarCategoria = async (req, res) => {

    try {

        const categoria = await Categoria.findById(req.params.id);

        if (!categoria) {

            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });

        }

        res.status(200).json(categoria);

    } catch (error) {

        res.status(500).json({
            mensagem: error.message
        });

    }

};

// Cadastrar categoria
const cadastrarCategoria = async (req, res) => {

    try {

        const categoria = new Categoria(req.body);

        await categoria.save();

        res.status(201).json(categoria);

    } catch (error) {

        res.status(400).json({
            mensagem: error.message
        });

    }

};

// Atualizar categoria
const atualizarCategoria = async (req, res) => {

    try {

        const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(categoria);

    } catch (error) {

        res.status(400).json({
            mensagem: error.message
        });

    }

};

// Excluir categoria
const excluirCategoria = async (req, res) => {

    try {

        await Categoria.findByIdAndDelete(req.params.id);

        res.status(200).json({
            mensagem: "Categoria excluída com sucesso."
        });

    } catch (error) {

        res.status(500).json({
            mensagem: error.message
        });

    }

};

module.exports = {
    listarCategorias,
    buscarCategoria,
    cadastrarCategoria,
    atualizarCategoria,
    excluirCategoria
};