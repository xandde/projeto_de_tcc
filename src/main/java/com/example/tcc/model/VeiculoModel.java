package com.example.tcc.model;

import com.example.tcc.model.CadastroModel;
import jakarta.persistence.*;

@Entity
@Table(name = "veiculos")
public class VeiculoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private CadastroModel cliente;

    private String marca;
    private String modelo;
    private String placa;
    private Integer ano;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CadastroModel getCliente() { return cliente; }
    public void setCliente(CadastroModel cliente) { this.cliente = cliente; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
}