package com.example.tcc.controller;

import com.example.tcc.model.CadastroModel;
import com.example.tcc.service.CadastroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // <-- CORREÇÃO 1: PERMITE A CONEXÃO
public class LoginController {

    private final CadastroService cadastroService;

    public LoginController(CadastroService cadastroService) {
        this.cadastroService = cadastroService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dadosLogin) {
        String email = dadosLogin.get("email");
        String senha = dadosLogin.get("senha"); // O backend continua a esperar "senha"

        Optional<CadastroModel> usuario = cadastroService.autenticar(email, senha);

        if (usuario.isPresent()) {
            CadastroModel user = usuario.get();

            // SOLUÇÃO SEGURA: Usar HashMap em vez de Map.of
            // Isso evita o erro 500 se algum campo estiver null
            java.util.Map<String, Object> resposta = new java.util.HashMap<>();
            resposta.put("id", user.getId());
            resposta.put("nome", user.getNome());
            resposta.put("email", user.getEmail());
            resposta.put("role", user.getRole());

            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(401).body(Map.of("erro", "Email ou senha inválidos"));
        }
    }
}