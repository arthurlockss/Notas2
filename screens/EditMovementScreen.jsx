import { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, As, Alert } from "react-native";
import { Button, Switch, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NoteContext } from "../App";
import {
  atualizarMovimentacao,
  excluirMovimentacao,
  recuperarMovimentacaoPorId,
} from "../db";
import { useSQLiteContext } from "expo-sqlite";
import { enumTipoMovimentacao } from "../enums/Enums";

const EditMovementScreen = ({ navigation, route }) => {
  const db = useSQLiteContext();
  const { id } = route.params;
  const [valor, setValor] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errorDescricao, setErrorDescricao] = useState(false);
  const [errorValor, setErrorValor] = useState(false);
  const [errorTitulo, setErrorTitulo] = useState(false);
  const [entrada, setEntrada] = useState(false);

  const onToggleSwitch = () => setEntrada(!entrada);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarMovimentacaoPorId(id);
  }, [id]);
  useEffect(() => {
    setErrorDescricao(descricao.length < 5);
  }, [descricao]);

  useEffect(() => {
    setErrorValor(valor <= 0 || isNaN(valor));
  }, [valor]);

  useEffect(() => {
    setErrorTitulo(titulo.length < 5);
  }, [titulo]);

  const listarMovimentacaoPorId = async (id) => {
    setLoading(true);
    try {
      const movimentacao = await recuperarMovimentacaoPorId(db, id);

      console.log(movimentacao);

      setValor(movimentacao.valor);
      setDescricao(movimentacao.descricao);
      setEntrada(movimentacao.tipo === enumTipoMovimentacao.ENTRADA);
      setTitulo(movimentacao.titulo);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    try {
      const movimentacao = {
        tipo: entrada
          ? enumTipoMovimentacao.ENTRADA
          : enumTipoMovimentacao.SAIDA,
        valor,
        descricao,
        datacadastro: new Date().toLocaleDateString(),
        titulo,
      };

      await atualizarMovimentacao(
        db,
        id,
        movimentacao.tipo,
        movimentacao.valor,
        movimentacao.descricao,
        movimentacao.datacadastro,
        movimentacao.titulo
      );
      navigation.navigate("Movimentações");
    } catch (error) {
      alert(error);
    }
  };

  const handleDeleteNote = async () => {
    Alert.alert(
      "Deseja realmente excluir este registro?",
      "Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => deletarMovimentacao(id) },
      ]
    );
  };

  const deletarMovimentacao = async (id) => {
    try {
      await excluirMovimentacao(db, id);
      navigation.navigate("Movimentações");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView>
      <View style={{ padding: 20, justifyContent: "space-around" }}>
        <TextInput
          style={styles.textarea}
          placeholder="Digite aqui"
          mode="contained"
          multiline={true}
          label={"Título"}
          numberOfLines={5}
          error={errorTitulo}
          value={titulo}
          onChangeText={(text) => setTitulo(text)}
        />
        <TextInput
          style={styles.textarea}
          placeholder="Digite aqui"
          mode="contained"
          multiline={true}
          label={"Descrição"}
          numberOfLines={5}
          error={errorDescricao}
          value={descricao}
          onChangeText={(text) => setDescricao(text)}
        />
        <TextInput
          style={styles.textarea}
          keyboardType="decimal"
          placeholder="Digite aqui"
          mode="contained"
          multiline={true}
          label={"Valor"}
          numberOfLines={5}
          value={valor.toString()}
          error={errorValor}
          onChangeText={(valor) => setValor(valor)}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            marginBottom: 8,
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: 22 }}>Saída</Text>
          <Switch value={entrada} onValueChange={onToggleSwitch} />
          <Text style={{ fontSize: 22 }}>Entrada</Text>
        </View>
        <Button
          style={{ marginBottom: 5 }}
          buttonColor="#009067"
          onPress={handleSaveNote}
          mode="contained"
          icon="pencil"
          disabled={errorDescricao || errorValor}
        >
          Salvar
        </Button>
        <Button
          buttonColor="#b40028"
          onPress={handleDeleteNote}
          mode="contained"
          icon="delete"
        >
          Excluir
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textarea: {
    marginBottom: 8,
  },
});
export default EditMovementScreen;
