package com.example.tcc.service;

import com.example.tcc.model.OrdemServicoModel;
import com.example.tcc.repository.OrdemServicoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemServicoRepository;

    public OrdemServicoService(OrdemServicoRepository ordemServicoRepository) {
        this.ordemServicoRepository = ordemServicoRepository;
    }

    public List<OrdemServicoModel> listarTodas() {
        return ordemServicoRepository.findAll();
    }

    // --- COMENTEI AQUI PARA NÃO DAR ERRO NO MVP ---
    // public List<OrdemServicoModel> listarPorCliente(Long clienteId) {
    //    return ordemServicoRepository.findByClienteId(clienteId);
    // }
    //
    public Optional<OrdemServicoModel> buscarPorId(Long id) {
        return ordemServicoRepository.findById(id);
    }

    public OrdemServicoModel salvar(OrdemServicoModel ordemServico) {
        // Aqui é onde a mágica acontece. Ex: definir data automaticamente se não vier
        if (ordemServico.getDataAbertura() == null) {
            ordemServico.setDataAbertura(java.time.LocalDateTime.now());
        }
        if (ordemServico.getStatus() == null) {
            ordemServico.setStatus("ABERTA");
        }
        return ordemServicoRepository.save(ordemServico);
    }

    public Optional<OrdemServicoModel> atualizarStatus(Long id, String status) {
        Optional<OrdemServicoModel> existente = ordemServicoRepository.findById(id);
        if (existente.isPresent()) {
            OrdemServicoModel os = existente.get();
            os.setStatus(status);
            return Optional.of(ordemServicoRepository.save(os));
        }
        return Optional.empty();
    }

    public void deletar(Long id) {
        ordemServicoRepository.deleteById(id);
    }
}