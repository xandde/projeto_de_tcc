package com.example.tcc.service;

import com.example.tcc.model.CadastroModel;
import com.example.tcc.repository.CadastroRepository;
// REMOVER: import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroService {

    private final CadastroRepository cadastroRepository;
    // REMOVER: private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public CadastroService(CadastroRepository cadastroRepository) {
        this.cadastroRepository = cadastroRepository;
    }

    public List<CadastroModel> listarTodos() {
        return cadastroRepository.findAll();
    }

    public Optional<CadastroModel> buscarPorId(Long id) {
        return cadastroRepository.findById(id);
    }

    public CadastroModel salvar(CadastroModel cadastro) {
        // CORREÇÃO: Remove a lógica de criptografia
        return cadastroRepository.save(cadastro);
    }

    public void deletar(Long id) {
        cadastroRepository.deleteById(id);
    }

    public Optional<CadastroModel> autenticar(String email, String senha) {
        // Primeiro, o repositório precisa ter o método findByEmail(String email)
        Optional<CadastroModel> usuarioOpt = cadastroRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            CadastroModel usuario = usuarioOpt.get();

            // CUIDADO: Comparação de senha em texto plano (apenas para testes!)
            if (senha.equals(usuario.getSenha())) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }

    // REMOVER: Todo este método, pois ele depende do BCryptPasswordEncoder.
    /*
    public Optional<CadastroModel> autenticar(String email, String senha) {
        Optional<CadastroModel> usuarioOpt = cadastroRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            CadastroModel usuario = usuarioOpt.get();
            if (passwordEncoder.matches(senha, usuario.getSenha())) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }
    */
}