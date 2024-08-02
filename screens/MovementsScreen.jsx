import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useEffect } from "react";
import MovementCard from "../components/MovementCard";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { recuperarMovimentacoes } from "../db";
import { Text } from "react-native";
import { enumTipoMovimentacao } from "../enums/Enums";

const MovementsScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalizador, setTotalizador] = useState(0);

  useEffect(() => {
    listarMovimentacoes();
  }, []);

  const listarMovimentacoes = async () => {
    setLoading(true);
    try {
      const movimentacoes = await recuperarMovimentacoes(db);

      setMovimentacoes(movimentacoes);
      calcularTotalizadores(movimentacoes);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalizadores = (movimentacoes) => {
    let total = 0;

    movimentacoes.forEach((movimentacao) => {
      total +=
        movimentacao.tipo === enumTipoMovimentacao.SAIDA
          ? -movimentacao.valor
          : movimentacao.valor;
    });

    setTotalizador(total);
  };

  return (
    <>
      <View style={styles.view}>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Button
            buttonColor="blue"
            mode="contained"
            style={{ marginTop: 5 }}
            onPress={listarMovimentacoes}
            icon={"refresh"}
          >
            Atualizar
          </Button>
          <Button
            buttonColor="blue"
            mode="contained"
            icon="plus"
            style={{ marginTop: 5 }}
            onPress={() => {
              navigation.navigate("Nova movimentação");
            }}
          >
            Novo
          </Button>
        </View>
      </View>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <View style={{ display: "flex", justifyContent: "space-between", height: '90%' }}>
          <ScrollView>
            {movimentacoes.map((movimentacao, i) => (
              <MovementCard
                movimentacao={movimentacao}
                key={movimentacao.id}
                index={i}
                navigation={navigation}
              />
            ))}
          </ScrollView>
          <Text style={{ textAlign: "center", fontSize: 22 }}>
            Total: R${totalizador}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    marginLeft: "auto",
  },
});

export default MovementsScreen;
