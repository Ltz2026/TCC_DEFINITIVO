import { useEffect, useState } from "react";

import "./Carrinho.css";

function Carrinho() {

    const [carrinho, setCarrinho] =
        useState([]);

    const [finalizando, setFinalizando] =
        useState(false);


    // ==========================================
    // CARREGAR CARRINHO
    // ==========================================

    useEffect(() => {

        carregarCarrinho();

    }, []);


    function carregarCarrinho() {

        const carrinhoSalvo =
            localStorage.getItem(
                "carrinho"
            );


        if (!carrinhoSalvo) {

            setCarrinho([]);

            return;

        }


        try {

            const dados =
                JSON.parse(
                    carrinhoSalvo
                );

            setCarrinho(dados);

        } catch {

            setCarrinho([]);

            localStorage.removeItem(
                "carrinho"
            );

        }

    }


    // ==========================================
    // REMOVER PRODUTO DO CARRINHO
    // ==========================================

    function removerProduto(id) {

        const novoCarrinho =
            carrinho.filter(
                produto =>
                    produto._id !== id
            );


        setCarrinho(
            novoCarrinho
        );


        localStorage.setItem(
            "carrinho",
            JSON.stringify(
                novoCarrinho
            )
        );

    }


    // ==========================================
    // ALTERAR QUANTIDADE
    // ==========================================

    function alterarQuantidade(
        id,
        quantidade
    ) {

        if (quantidade < 1) {

            return;

        }


        const novoCarrinho =
            carrinho.map(
                produto => {

                    if (
                        produto._id === id
                    ) {

                        // Não ultrapassar estoque

                        if (
                            quantidade >
                            produto.estoque
                        ) {

                            alert(
                                "Quantidade maior que o estoque disponível."
                            );

                            return produto;

                        }


                        return {

                            ...produto,

                            quantidade:
                                quantidade

                        };

                    }


                    return produto;

                }
            );


        setCarrinho(
            novoCarrinho
        );


        localStorage.setItem(
            "carrinho",
            JSON.stringify(
                novoCarrinho
            )
        );

    }


    // ==========================================
    // FINALIZAR COMPRA
    // ==========================================

    async function finalizarCompra() {

        if (
            carrinho.length === 0
        ) {

            alert(
                "Seu carrinho está vazio."
            );

            return;

        }


        try {

            setFinalizando(true);


            // Comprar cada produto

            for (
                const produto
                of carrinho
            ) {

                const resposta =
                    await fetch(
                        `http://localhost:3001/produtos/${produto._id}/comprar`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    quantidade:
                                        produto.quantidade

                                })

                        }
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        "Erro ao finalizar compra."
                    );

                }

            }


            // ==========================================
            // LIMPAR CARRINHO
            // ==========================================

            localStorage.removeItem(
                "carrinho"
            );


            setCarrinho([]);


            alert(
                "Compra realizada com sucesso!"
            );


        } catch (error) {

            console.error(error);


            alert(
                error.message ||
                "Erro ao finalizar compra."
            );


            /*
            Recarregar o carrinho
            caso alguma operação
            tenha falhado.
            */

            carregarCarrinho();

        } finally {

            setFinalizando(false);

        }

    }


    // ==========================================
    // CALCULAR TOTAL
    // ==========================================

    const total =
        carrinho.reduce(
            (
                soma,
                produto
            ) => {

                return (
                    soma +
                    (
                        Number(
                            produto.preco
                        ) *
                        produto.quantidade
                    )
                );

            },
            0
        );


    return (

        <main className="carrinho">

            <div className="carrinho-container">


                <h1>
                    Meu Carrinho
                </h1>


                {/* =================================
                    CARRINHO VAZIO
                ================================== */}

                {carrinho.length === 0 ? (

                    <div className="carrinho-vazio">

                        <h2>
                            Seu carrinho está vazio
                        </h2>

                        <p>
                            Adicione produtos para continuar.
                        </p>

                    </div>

                ) : (


                    /* =================================
                       PRODUTOS
                    ================================= */

                    <>

                        <div className="carrinho-produtos">


                            {carrinho.map(
                                produto => (

                                    <div
                                        className="carrinho-item"
                                        key={
                                            produto._id
                                        }
                                    >


                                        {/* IMAGEM */}

                                        {produto.imagem && (

                                            <img
                                                src={
                                                    produto.imagem
                                                }
                                                alt={
                                                    produto.nome
                                                }
                                            />

                                        )}


                                        {/* INFORMAÇÕES */}

                                        <div>

                                            <h3>
                                                {
                                                    produto.nome
                                                }
                                            </h3>


                                            <p>
                                                R${" "}
                                                {Number(
                                                    produto.preco
                                                ).toFixed(2)}
                                            </p>

                                        </div>


                                        {/* QUANTIDADE */}

                                        <div className="quantidade">

                                            <button
                                                onClick={() =>
                                                    alterarQuantidade(
                                                        produto._id,
                                                        produto.quantidade - 1
                                                    )
                                                }
                                            >
                                                −
                                            </button>


                                            <span>
                                                {
                                                    produto.quantidade
                                                }
                                            </span>


                                            <button
                                                onClick={() =>
                                                    alterarQuantidade(
                                                        produto._id,
                                                        produto.quantidade + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>


                                        {/* REMOVER */}

                                        <button
                                            className="remover-carrinho"
                                            onClick={() =>
                                                removerProduto(
                                                    produto._id
                                                )
                                            }
                                        >
                                            Remover
                                        </button>

                                    </div>

                                )
                            )}

                        </div>


                        {/* =================================
                            TOTAL
                        ================================== */}

                        <div className="carrinho-total">

                            <h2>
                                Total: R${" "}
                                {total.toFixed(2)}
                            </h2>


                            <button
                                className="finalizar-compra"
                                onClick={
                                    finalizarCompra
                                }
                                disabled={
                                    finalizando
                                }
                            >

                                {finalizando
                                    ? "Processando..."
                                    : "Finalizar Compra"
                                }

                            </button>

                        </div>

                    </>

                )}

            </div>

        </main>

    );

}

export default Carrinho;