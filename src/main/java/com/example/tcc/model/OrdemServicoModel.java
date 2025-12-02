package com.example.tcc.model; // Ajuste o pacote se precisar

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordens_servico")
public class OrdemServicoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clienteNome; // Por enquanto, texto livre
    private String veiculoModelo;
    private String descricaoProblema;

    private String status; // "ABERTA", "EM ANDAMENTO", "CONCLUÍDA"
    private LocalDateTime dataAbertura;

    // Construtor padrão
    public OrdemServicoModel() {
        this.dataAbertura = LocalDateTime.now(); // Data automática
        this.status = "ABERTA"; // Status padrão
    }

    // Getters e Setters (Gere pelo IntelliJ ou copie abaixo)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getClienteNome() { return clienteNome; }
    public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }
    public String getVeiculoModelo() { return veiculoModelo; }
    public void setVeiculoModelo(String veiculoModelo) { this.veiculoModelo = veiculoModelo; }
    public String getDescricaoProblema() { return descricaoProblema; }
    public void setDescricaoProblema(String descricaoProblema) { this.descricaoProblema = descricaoProblema; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDateTime dataAbertura) { this.dataAbertura = dataAbertura; }
}