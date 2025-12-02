package com.example.tcc.controller;

import com.example.tcc.model.OrdemServicoModel;
import com.example.tcc.service.OrdemServicoService; // <-- Agora importamos o Service
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens")
// @CrossOrigin(origins = "*") // Descomente se não tiver a config global
public class OrdemServicoController {

    private final OrdemServicoService service; // <-- Mudou de Repository para Service

    public OrdemServicoController(OrdemServicoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<OrdemServicoModel> criar(@RequestBody OrdemServicoModel novaOs) {
        // O Controller delega para o Service
        OrdemServicoModel osSalva = service.salvar(novaOs);
        return ResponseEntity.ok(osSalva);
    }

    // 2. LISTAR TUDO (GET) - Usado na HOME (Corrige o Erro 405)
    @GetMapping
    public List<OrdemServicoModel> listar() {
        return service.listarTodas();
    }

    // GET - Buscar por ID (Para a tela de detalhes)
    @GetMapping("/{id}")
    public ResponseEntity<OrdemServicoModel> buscarPorId(@PathVariable Long id) {
        // Usando o Service que seus colegas criaram
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. ATUALIZAR STATUS (PATCH/PUT) - Para o botão "Finalizar"
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrdemServicoModel> atualizarStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload) {

        String novoStatus = payload.get("status");

        return service.atualizarStatus(id, novoStatus)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. DELETAR (DELETE) - Para o botão de Lixeira
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build(); // Retorna status 204 (Sucesso sem conteúdo)
    }
    }