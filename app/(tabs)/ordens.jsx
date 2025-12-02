import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import api from '../../services/api'; // Ajuste o caminho se necessário

export default function OrdensTabScreen() {
  const [ordens, setOrdens] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filtros
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('TODAS'); // TODAS, ABERTA, AGUARDANDO PEÇA, CONCLUÍDA

  // Carrega dados do servidor
  const fetchOrdens = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/ordens');
      // Inverte a ordem para as mais recentes ficarem no topo
      const dadosOrdenados = response.data.reverse(); 
      setOrdens(dadosOrdenados);
      aplicarFiltros(dadosOrdenados, busca, statusFiltro);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a lista sempre que entra na tela
  useFocusEffect(
    useCallback(() => {
      fetchOrdens();
    }, [])
  );

  // Lógica de Filtro (Busca + Status)
  const aplicarFiltros = (dados, textoBusca, status) => {
    let resultado = dados;

    // 1. Filtro de Status
    if (status !== 'TODAS') {
      resultado = resultado.filter(item => item.status === status);
    }

    // 2. Filtro de Texto (Nome ou Carro)
    if (textoBusca) {
      const termo = textoBusca.toLowerCase();
      resultado = resultado.filter(item => 
        item.clienteNome.toLowerCase().includes(termo) || 
        item.veiculoModelo.toLowerCase().includes(termo) ||
        String(item.id).includes(termo)
      );
    }

    setListaFiltrada(resultado);
  };

  // Função disparada ao digitar ou clicar no filtro
  const handleFiltrar = (texto, status) => {
    setBusca(texto);
    setStatusFiltro(status);
    aplicarFiltros(ordens, texto, status);
  };

  // Componente de cada Card da Lista
  const renderItem = ({ item }) => {
    // Cores dinâmicas
    const isConcluida = item.status === 'CONCLUÍDA';
    const isAguardando = item.status === 'AGUARDANDO PEÇA';
    const statusColor = isConcluida ? '#27ae60' : isAguardando ? '#f1c40f' : '#e67e22';

    return (
      <Link href={`/ordens/${item.id}`} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardHeader}>
             <Text style={styles.idText}>#{item.id}</Text>
             <View style={[styles.badge, { backgroundColor: statusColor }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
             </View>
          </View>

          <View style={styles.cardBody}>
             <Text style={styles.cliente}>{item.clienteNome}</Text>
             <Text style={styles.veiculo}>{item.veiculoModelo}</Text>
             <Text style={styles.descricao} numberOfLines={1}>{item.descricaoProblema}</Text>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.arrow} />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Cabeçalho e Busca */}
      <View style={styles.header}>
        <Text style={styles.title}>Todas as Ordens</Text>
        
        <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput 
                style={styles.input}
                placeholder="Buscar cliente, veículo ou ID..."
                value={busca}
                onChangeText={(t) => handleFiltrar(t, statusFiltro)}
            />
            {busca.length > 0 && (
                <TouchableOpacity onPress={() => handleFiltrar('', statusFiltro)}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
            )}
        </View>

        {/* 2. Filtros de Status (Chips) */}
        <View style={styles.filtersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['TODAS', 'ABERTA', 'AGUARDANDO PEÇA', 'CONCLUÍDA'].map((st) => (
                    <TouchableOpacity 
                        key={st} 
                        style={[styles.chip, statusFiltro === st && styles.chipSelected]}
                        onPress={() => handleFiltrar(busca, st)}
                    >
                        <Text style={[styles.chipText, statusFiltro === st && styles.chipTextSelected]}>
                            {st}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
      </View>

      {/* 3. Lista */}
      <FlatList
        data={listaFiltrada}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrdens} />}
        ListEmptyComponent={
            !loading && (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={50} color="#ddd" />
                    <Text style={styles.emptyText}>Nenhuma ordem encontrada.</Text>
                </View>
            )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 15, height: 45 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },

  filtersRow: { marginTop: 15, flexDirection: 'row' },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f5f5f5', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  chipSelected: { backgroundColor: '#1E90FF', borderColor: '#1E90FF' },
  chipText: { color: '#666', fontSize: 13, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },

  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3 },
  cardHeader: { alignItems: 'center', marginRight: 15 },
  idText: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 5 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
  cardBody: { flex: 1 },
  cliente: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  veiculo: { fontSize: 14, color: '#555', marginBottom: 4 },
  descricao: { fontSize: 12, color: '#999' },
  arrow: { marginLeft: 10 },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 }
});