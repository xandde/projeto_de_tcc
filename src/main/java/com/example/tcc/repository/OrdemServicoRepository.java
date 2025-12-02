package com.example.tcc.repository;

import com.example.tcc.model.OrdemServicoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServicoModel, Long> {
    // O Spring cria os métodos save(), findAll() automaticamente
}