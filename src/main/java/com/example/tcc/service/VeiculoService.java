package com.example.tcc.service;

import com.example.tcc.model.VeiculoModel;
import com.example.tcc.repository.VeiculoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public List<VeiculoModel> listarTodos() {
        return veiculoRepository.findAll();
    }

    public List<VeiculoModel> listarPorCliente(Long clienteId) {
        return veiculoRepository.findByClienteId(clienteId);
    }

    public VeiculoModel salvar(VeiculoModel veiculo) {
        return veiculoRepository.save(veiculo);
    }
}