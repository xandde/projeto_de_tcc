package com.example.tcc.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cadastros")
public class CadastroModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String telefone;
    private String senha;
    private String role; // <-- CAMPO NOVO E ESSENCIAL

    public CadastroModel() {

    }

    public CadastroModel(String nome, String email, String telefone, String senha, String role) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.senha = senha;
        this.role = (role != null) ? role : "cliente"; // Define 'cliente' como padrão
    }

    // ... (Getters e Setters para id, nome, email, telefone, senha) ...

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // ... (Resto dos Getters e Setters) ...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}

