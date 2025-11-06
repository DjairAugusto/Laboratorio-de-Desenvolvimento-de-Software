package com.projeto.controller;

import com.projeto.dto.EmpresaParceiraRequestDTO;
import com.projeto.dto.EmpresaParceiraResponseDTO;
import com.projeto.dto.VantagemRequestDTO;
import com.projeto.dto.VantagemResponseDTO;
import com.projeto.dto.PageResponseDTO;
import com.projeto.service.EmpresaParceiraService;
import com.projeto.service.VantagemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
public class EmpresaParceiraController {

    @Autowired
    private EmpresaParceiraService empresaService;

    @Autowired
    private VantagemService vantagemService;

    @GetMapping
    public ResponseEntity<List<EmpresaParceiraResponseDTO>> listarTodos() {
        return ResponseEntity.ok(empresaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<EmpresaParceiraResponseDTO> opt = empresaService.buscarPorId(id);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EmpresaParceiraResponseDTO> criar(@Valid @RequestBody EmpresaParceiraRequestDTO dto) {
        EmpresaParceiraResponseDTO criado = empresaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody EmpresaParceiraRequestDTO dto) {
        Optional<EmpresaParceiraResponseDTO> opt = empresaService.atualizar(id, dto);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean ok = empresaService.deletar(id);
        if (ok) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

    // ============= ENDPOINTS DE VANTAGENS DA EMPRESA =============

    /**
     * Lista vantagens de uma empresa específica com paginação
     * GET /api/empresas/{empresaId}/vantagens?page=0&size=10&sortBy=descricao&direction=asc
     */
    @GetMapping("/{empresaId}/vantagens")
    public ResponseEntity<PageResponseDTO<VantagemResponseDTO>> listarVantagensDaEmpresa(
            @PathVariable Long empresaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        PageResponseDTO<VantagemResponseDTO> response = vantagemService.listarPorEmpresa(empresaId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Cria uma vantagem já vinculada à empresa do path
     * POST /api/empresas/{empresaId}/vantagens
     */
    @PostMapping("/{empresaId}/vantagens")
    public ResponseEntity<VantagemResponseDTO> criarVantagemParaEmpresa(
            @PathVariable Long empresaId,
            @Valid @RequestBody VantagemRequestDTO dto) {
        VantagemResponseDTO vantagem = vantagemService.criarParaEmpresa(empresaId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(vantagem);
    }

    /**
     * Atualiza uma vantagem garantindo que pertence à empresa
     * PUT /api/empresas/{empresaId}/vantagens/{vantagemId}
     */
    @PutMapping("/{empresaId}/vantagens/{vantagemId}")
    public ResponseEntity<VantagemResponseDTO> atualizarVantagemDaEmpresa(
            @PathVariable Long empresaId,
            @PathVariable Long vantagemId,
            @Valid @RequestBody VantagemRequestDTO dto) {
        Optional<VantagemResponseDTO> vantagem = vantagemService.atualizarParaEmpresa(empresaId, vantagemId, dto);
        return vantagem.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Exclui uma vantagem garantindo que pertence à empresa
     * DELETE /api/empresas/{empresaId}/vantagens/{vantagemId}
     */
    @DeleteMapping("/{empresaId}/vantagens/{vantagemId}")
    public ResponseEntity<Void> deletarVantagemDaEmpresa(
            @PathVariable Long empresaId,
            @PathVariable Long vantagemId) {
        boolean deletado = vantagemService.deletarParaEmpresa(empresaId, vantagemId);
        if (deletado) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
