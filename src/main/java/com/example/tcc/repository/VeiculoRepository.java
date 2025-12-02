package com.example.tcc.repository;

import com.example.tcc.model.VeiculoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VeiculoRepository extends JpaRepository<VeiculoModel, Long> {
    List<VeiculoModel> findByClienteId(Long clienteId);
}