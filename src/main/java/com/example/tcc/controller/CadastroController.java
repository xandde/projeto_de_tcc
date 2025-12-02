package com.example.tcc.controller;

import com.example.tcc.model.CadastroModel;
import com.example.tcc.service.CadastroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cadastros")
@CrossOrigin(origins = "*") // <-- CORREÇÃO ESSENCIAL
public class  CadastroController {

    private final CadastroService cadastroService;

    public CadastroController(CadastroService cadastroService) {
        this.cadastroService = cadastroService;
    }

    // GET - listar todos
    @GetMapping
    public List<CadastroModel> listarTodos() {
        return cadastroService.listarTodos();
    }

    // GET - buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<CadastroModel> buscarPorId(@PathVariable Long id) {
        Optional<CadastroModel> cadastro = cadastroService.buscarPorId(id);
        return cadastro.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST - salvar novo cadastro
    @PostMapping
    public CadastroModel salvar(@RequestBody CadastroModel cadastro) {
        return cadastroService.salvar(cadastro);
    }

    // PUT - atualizar cadastro existente
    @PutMapping("/{id}")
    public ResponseEntity<CadastroModel> atualizar(@PathVariable Long id, @RequestBody CadastroModel cadastro) {
        Optional<CadastroModel> existente = cadastroService.buscarPorId(id);

        if (existente.isPresent()) {
            cadastro.setId(id);
            return ResponseEntity.ok(cadastroService.salvar(cadastro));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - excluir cadastro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Optional<CadastroModel> existente = cadastroService.buscarPorId(id);

        if (existente.isPresent()) {
            cadastroService.deletar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
