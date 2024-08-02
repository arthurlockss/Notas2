export const NOME_DATABASE = 'appfinanceiro.db';

const CRIACAO_TABELA = `CREATE TABLE IF NOT EXISTS movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo INTEGER NOT NULL CHECK(tipo IN (0, 1)),
    valor REAL NOT NULL,
    descricao TEXT NOT NULL,
    titulo TEXT NOT NULL,
    datacadastro TEXT NOT NULL
  );`;
// const ADICIONAR_COLUNA_TITULO = `ALTER TABLE movimentacoes ADD COLUMN titulo TEXT;`;
const INSERIR_MOVIMENTACAO = `INSERT INTO movimentacoes (tipo, valor, descricao, datacadastro, titulo) VALUES (?, ?, ?, ?, ?);`;
const ATUALIZAR_MOVIMENTACAO = `UPDATE movimentacoes SET tipo = ?, valor = ?, descricao = ?, datacadastro = ?, titulo = ? WHERE id = ?;`;
const LISTAR_MOVIMENTACOES = `SELECT * FROM movimentacoes;`;
const LISTAR_MOVIMENTACAO_POR_ID = `SELECT * FROM movimentacoes WHERE id = ?;`;
const EXCLUIR_MOVIMENTACAO = `DELETE FROM movimentacoes WHERE id = ?;`;

export const criacaoTabelaSeNecessario = async function criacaoTabelaSeNecessario(db) {
    const VERSAO_DATABASE = 1;
    let { user_version } = await db.getFirstAsync('PRAGMA user_version');

    if (user_version >= VERSAO_DATABASE) {
        return;
    }

    if (user_version === 0 || user_version === null || user_version === undefined) {
        await db.execAsync(CRIACAO_TABELA);

        user_version = 1;
    }

    await db.execAsync(`PRAGMA user_version = ${VERSAO_DATABASE}`);
}

export const inserirMovimentacoes = async (db, tipo, valor, descricao, datacadastro, titulo) => {
    await db.runAsync(INSERIR_MOVIMENTACAO, tipo, valor, descricao, datacadastro, titulo);
}

export const atualizarMovimentacao = async (db, id, tipo, valor, descricao, datacadastro, titulo) => {
    await db.runAsync(ATUALIZAR_MOVIMENTACAO, tipo, valor, descricao, datacadastro, titulo, id);
}

export const recuperarMovimentacoes = async (db) => {
    return await db.getAllAsync(LISTAR_MOVIMENTACOES);
}

export const recuperarMovimentacaoPorId = async (db, id) => {
    return await db.getFirstAsync(LISTAR_MOVIMENTACAO_POR_ID, id);
}

export const excluirMovimentacao = async (db, id) => {
    await db.runAsync(EXCLUIR_MOVIMENTACAO, id);
}