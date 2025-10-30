package com.projeto.controller;

import com.projeto.dto.TransacaoResponseDTO;
import com.projeto.service.TransacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST para operações relacionadas a transações
 */
@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "*")
public class TransacaoController {

      @Autowired
      private TransacaoService transacaoService;

      /**
       * Lista todas as transações do sistema
       * GET /api/transacoes
       */
      @GetMapping
      public ResponseEntity<List<TransacaoResponseDTO>> listarTodas() {
            List<TransacaoResponseDTO> transacoes = transacaoService.listarTodas();
            return ResponseEntity.ok(transacoes);
      }

      /**
       * Busca uma transação específica por ID
       * GET /api/transacoes/{id}
       */
      @GetMapping("/{id}")
      public ResponseEntity<TransacaoResponseDTO> buscarPorId(@PathVariable Long id) {
            Optional<TransacaoResponseDTO> transacao = transacaoService.buscarPorId(id);
            return transacao.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
      }

      /**
       * Lista transações de um aluno específico
       * GET /api/transacoes/aluno/{alunoId}
       */
      @GetMapping("/aluno/{alunoId}")
      public ResponseEntity<List<TransacaoResponseDTO>> listarPorAluno(@PathVariable Long alunoId) {
            List<TransacaoResponseDTO> transacoes = transacaoService.listarPorUsuario(alunoId);
            return ResponseEntity.ok(transacoes);
      }

      /**
       * Lista transações de um professor específico
       * GET /api/transacoes/professor/{professorId}
       */
      @GetMapping("/professor/{professorId}")
      public ResponseEntity<List<TransacaoResponseDTO>> listarPorProfessor(@PathVariable Long professorId) {
            List<TransacaoResponseDTO> transacoes = transacaoService.listarPorUsuario(professorId);
            return ResponseEntity.ok(transacoes);
      }

      /**
       * Lista transações de uma empresa específica
       * GET /api/transacoes/empresa/{empresaId}
       */
      @GetMapping("/empresa/{empresaId}")
      public ResponseEntity<List<TransacaoResponseDTO>> listarPorEmpresa(@PathVariable Long empresaId) {
            List<TransacaoResponseDTO> transacoes = transacaoService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(transacoes);
      }

      /**
       * Lista transações por tipo
       * GET /api/transacoes/tipo/{tipo}
       * Tipos válidos: ENVIO, RESGATE, CREDITO
       */
      @GetMapping("/tipo/{tipo}")
      public ResponseEntity<List<TransacaoResponseDTO>> listarPorTipo(@PathVariable String tipo) {
            List<TransacaoResponseDTO> transacoes = transacaoService.listarPorTipo(tipo);
            return ResponseEntity.ok(transacoes);
      }
}
