import { SafeAreaView, StatusBar, StyleSheet, FlatList, View } from "react-native"
import NotaEditor from "./src/componentes/NotaEditor"
import { useEffect, useState } from "react"
import { Nota } from "./src/componentes/Nota"
import { buscaNotas, buscaNotasPorCategoria, criaTabela } from "./src/servicos/Notas"
import { Picker } from "@react-native-picker/picker"

export default function App() {

  useEffect(() => {
    criaTabela()
    mostraNotas()
  }, [])

  const [notaSelecionada, setNotaSelecionada] = useState({})
  const [notas, setNotas] = useState([])
  const [categoria, setCategoria] = useState("Todas")

  async function mostraNotas() {
    const todasNotas = await buscaNotas()
    setNotas(todasNotas)
  }

  async function mostraNotasPorCategoria(novaCategoria) {
    setCategoria(novaCategoria)
    if(novaCategoria == "Todas") {
      mostraNotas()
    } else {
      setNotas(await buscaNotasPorCategoria(novaCategoria))
    }
  }

  return (
    <SafeAreaView style={estilos.container}>
      <FlatList
        data={notas}
        renderItem={(nota) => <Nota {...nota} setNotaSelecionada={setNotaSelecionada} />}
        keyExtractor={nota => nota.id}
        ListHeaderComponent={() => {
          return (
            <View style={estilos.picker}>
              <Picker
                selectedValue={categoria}
                onValueChange={(novaCategoria) => mostraNotasPorCategoria(novaCategoria)}>
                <Picker.Item label="Todas" value="Todas" />
                <Picker.Item label="Pessoal" value="Pessoal" />
                <Picker.Item label="Trabalho" value="Trabalho" />
                <Picker.Item label="Outros" value="Outros" />
              </Picker>
            </View>
          )
        }}
      />
      <NotaEditor
        mostraNotas={mostraNotas}
        notaSelecionada={notaSelecionada}
        setNotaSelecionada={setNotaSelecionada} />
      <StatusBar />
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#EEEEEE",
    marginBottom: 16,
  }
})

