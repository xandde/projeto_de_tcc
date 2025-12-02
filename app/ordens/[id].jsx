import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api'; // Ajuste o caminho se necessário

export default function DetalheOrdemScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [ordem, setOrdem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrdem();
  }, [id]);

  const fetchOrdem = async () => {
    try {
      const response = await api.get(`/api/ordens/${id}`);
      setOrdem(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a ordem.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar a data feia do Java (ISO) para BR
  const formatarData = (dataISO) => {
    if (!dataISO) return 'Data desconhecida';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const alterarStatus = async (novoStatus) => {
    try {
      await api.patch(`/api/ordens/${id}/status`, { status: novoStatus });
      Alert.alert('Sucesso', `Status alterado para: ${novoStatus}`);
      fetchOrdem(); 
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar status.');
    }
  };

  const handleDeletar = async () => {
    Alert.alert('Excluir', 'Tem certeza? Essa ação é irreversível.', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sim, Apagar', style: 'destructive', 
        onPress: async () => {
          try {
            await api.delete(`/api/ordens/${id}`);
            router.replace('/home');
          } catch (e) { Alert.alert('Erro', 'Falha ao excluir.'); }
        }
      }
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1E90FF" /></View>;
  if (!ordem) return <View style={styles.center}><Text>Ordem não encontrada.</Text></View>;

  // Definição de cores e progresso baseada no status
  const isConcluida = ordem.status === 'CONCLUÍDA';
  const isAguardando = ordem.status === 'AGUARDANDO PEÇA';
  const statusColor = isConcluida ? '#27ae60' : isAguardando ? '#f1c40f' : '#e67e22';

  return (
    <ScrollView style={styles.container}>
      
      {/* 1. Cabeçalho com ID e Lixeira */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>O.S. #{ordem.id}</Text>
        <TouchableOpacity onPress={handleDeletar} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* 2. Barra de Status (Timeline Visual) */}
      <View style={styles.timelineContainer}>
        <View style={styles.progressBar}>
            {/* Barra de Fundo */}
            <View style={{ height: 4, backgroundColor: '#e0e0e0', flex: 1 }} />
            {/* Bolinha Aberta */}
            <View style={[styles.dot, { backgroundColor: '#e67e22' }]} />
            {/* Bolinha Aguardando */}
            <View style={[styles.dot, { backgroundColor: (isAguardando || isConcluida) ? '#f1c40f' : '#e0e0e0', left: '50%', marginLeft: -8 }]} />
            {/* Bolinha Concluída */}
            <View style={[styles.dot, { backgroundColor: isConcluida ? '#27ae60' : '#e0e0e0', right: 0 }]} />
        </View>
        <View style={styles.labelsContainer}>
            <Text style={styles.labelTime}>ABERTA</Text>
            <Text style={styles.labelTime}>PEÇAS</Text>
            <Text style={styles.labelTime}>PRONTO</Text>
        </View>
        
        {/* Status Grande em Destaque */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons name={isConcluida ? "checkmark-circle" : "construct"} size={20} color="#fff" style={{marginRight: 8}}/>
            <Text style={styles.statusText}>{ordem.status}</Text>
        </View>
      </View>

      {/* 3. Card de Informações Principais */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Informações do Veículo</Text>
        
        <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="car-sport" size={24} color="#1E90FF" />
            </View>
            <View>
                <Text style={styles.label}>VEÍCULO</Text>
                <Text style={styles.value}>{ordem.veiculoModelo}</Text>
            </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="person" size={24} color="#1E90FF" />
            </View>
            <View>
                <Text style={styles.label}>CLIENTE</Text>
                <Text style={styles.value}>{ordem.clienteNome}</Text>
            </View>
        </View>
        
        <View style={styles.divider} />

        <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="calendar" size={24} color="#1E90FF" />
            </View>
            <View>
                <Text style={styles.label}>Data de Abertura</Text>
                <Text style={styles.value}>{formatarData(ordem.dataAbertura)}</Text>
            </View>
        </View>
      </View>

      {/* 4. Descrição do Problema */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Relato do Problema</Text>
        <Text style={styles.description}>{ordem.descricaoProblema}</Text>
      </View>

      {/* 5. Botões de Ação (Só se não estiver concluída) */}
      {!isConcluida && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.btnAction, { backgroundColor: '#f1c40f' }]} 
            onPress={() => alterarStatus('AGUARDANDO PEÇA')}
          >
            <Ionicons name="time" size={24} color="white" />
            <Text style={styles.btnText}>PEÇAS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnAction, { backgroundColor: '#27ae60', flex: 1.5 }]} 
            onPress={() => alterarStatus('CONCLUÍDA')}
          >
            <Ionicons name="checkmark-done" size={24} color="white" />
            <Text style={styles.btnText}>FINALIZAR</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Espaço extra no final */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  backBtn: { padding: 8 },
  deleteBtn: { padding: 8, backgroundColor: '#ffebee', borderRadius: 8 },

  timelineContainer: { alignItems: 'center', marginBottom: 20, paddingHorizontal: 40 },
  progressBar: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 20, position: 'relative' },
  dot: { width: 16, height: 16, borderRadius: 8, position: 'absolute', top: -6 },
  labelsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '110%', marginTop: 5, marginBottom: 15 },
  labelTime: { fontSize: 12, color: '#999' },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, elevation: 3 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  card: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 20, borderRadius: 12, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, backgroundColor: '#E6F4FE', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  label: { fontSize: 12, color: '#999' },
  value: { fontSize: 16, fontWeight: '500', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15, marginLeft: 55 },
  
  description: { fontSize: 15, color: '#555', lineHeight: 22, backgroundColor: '#fafafa', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#f0f0f0' },

  actionsContainer: { flexDirection: 'row', gap: 10, padding: 20 },
  btnAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, elevation: 2 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});