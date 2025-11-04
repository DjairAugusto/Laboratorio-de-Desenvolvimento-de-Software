package com.projeto.service;

import com.projeto.dto.VantagemRequestDTO;
import com.projeto.dto.VantagemResponseDTO;
import com.projeto.dto.PageResponseDTO;
import com.projeto.model.Vantagem;
import com.projeto.model.Aluno;
import com.projeto.model.Transacao;
import com.projeto.model.EmpresaParceira;
import com.projeto.repository.VantagemRepository;
import com.projeto.repository.AlunoRepository;
import com.projeto.repository.TransacaoRepository;
import com.projeto.repository.EmpresaParceiraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VantagemService {

    @Autowired
    private VantagemRepository vantagemRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private EmpresaParceiraRepository empresaParceiraRepository;

    /**
     * Lista todas as vantagens com paginação otimizada
     */
    public PageResponseDTO<VantagemResponseDTO> listarTodas(Pageable pageable) {
        Page<Vantagem> page = vantagemRepository.findAll(pageable);
        return convertToPageResponse(page);
    }

    /**
     * Busca uma vantagem por ID
     */
    public Optional<VantagemResponseDTO> buscarPorId(Long id) {
        Optional<Vantagem> vantagem = vantagemRepository.findById(id);
        return vantagem.map(this::converterParaResponseDTO);
    }

    /**
     * Lista vantagens de uma empresa específica com paginação otimizada
     */
    public PageResponseDTO<VantagemResponseDTO> listarPorEmpresa(Long empresaId, Pageable pageable) {
        Page<Vantagem> page = vantagemRepository.findByEmpresaParceira_Id(empresaId, pageable);
        return convertToPageResponse(page);
    }

    /**
     * Cria uma nova vantagem já vinculada à empresa informada no caminho
     */
    @Transactional
    public VantagemResponseDTO criarParaEmpresa(Long empresaId, VantagemRequestDTO requestDTO) {
        Vantagem vantagem = new Vantagem();
        vantagem.setDescricao(requestDTO.getDescricao());
        vantagem.setCustoMoedas(requestDTO.getCustoMoedas());

        if (requestDTO.getFoto() != null && !requestDTO.getFoto().isEmpty()) {
            try {
                byte[] fotoBytes = Base64.getDecoder().decode(requestDTO.getFoto());
                vantagem.setFoto(fotoBytes);
            } catch (IllegalArgumentException ignored) {
            }
        }

        EmpresaParceira empresa = empresaParceiraRepository.findById(empresaId)
                .orElseThrow(() -> new IllegalArgumentException("Empresa parceira não encontrada"));
        vantagem.setEmpresaParceira(empresa);

        Vantagem vantagemSalva = vantagemRepository.save(vantagem);
        return converterParaResponseDTO(vantagemSalva);
    }

    /**
     * Atualiza uma vantagem garantindo que pertence à empresa informada
     */
    @Transactional
    public Optional<VantagemResponseDTO> atualizarParaEmpresa(Long empresaId, Long id, VantagemRequestDTO requestDTO) {
        return vantagemRepository.findByIdAndEmpresaParceira_Id(id, empresaId).map(vantagem -> {
            vantagem.setDescricao(requestDTO.getDescricao());
            vantagem.setCustoMoedas(requestDTO.getCustoMoedas());

            if (requestDTO.getFoto() != null && !requestDTO.getFoto().isEmpty()) {
                try {
                    byte[] fotoBytes = Base64.getDecoder().decode(requestDTO.getFoto());
                    vantagem.setFoto(fotoBytes);
                } catch (IllegalArgumentException ignored) {
                }
            }

            Vantagem atualizado = vantagemRepository.save(vantagem);
            return converterParaResponseDTO(atualizado);
        });
    }

    /**
     * Exclui uma vantagem garantindo que pertence à empresa informada
     */
    @Transactional
    public boolean deletarParaEmpresa(Long empresaId, Long id) {
        return vantagemRepository.findByIdAndEmpresaParceira_Id(id, empresaId).map(v -> {
            vantagemRepository.delete(v);
            return true;
        }).orElse(false);
    }

    /**
     * Cria uma nova vantagem
     */
    @Transactional
    public VantagemResponseDTO criar(VantagemRequestDTO requestDTO) {
        Vantagem vantagem = new Vantagem();
        vantagem.setDescricao(requestDTO.getDescricao());
        vantagem.setCustoMoedas(requestDTO.getCustoMoedas());
        
        // Converter foto de Base64 para byte array se fornecida
        if (requestDTO.getFoto() != null && !requestDTO.getFoto().isEmpty()) {
            try {
                byte[] fotoBytes = Base64.getDecoder().decode(requestDTO.getFoto());
                vantagem.setFoto(fotoBytes);
            } catch (IllegalArgumentException e) {
                // Se não for Base64 válido, ignorar
                vantagem.setFoto(null);
            }
        }

        // Vincular empresa se fornecida
        if (requestDTO.getEmpresaId() != null) {
            empresaParceiraRepository.findById(requestDTO.getEmpresaId())
                    .ifPresent(vantagem::setEmpresaParceira);
        }

        Vantagem vantagemSalva = vantagemRepository.save(vantagem);
        return converterParaResponseDTO(vantagemSalva);
    }

    /**
     * Atualiza uma vantagem existente
     */
    @Transactional
    public Optional<VantagemResponseDTO> atualizar(Long id, VantagemRequestDTO requestDTO) {
        Optional<Vantagem> vantagemExistente = vantagemRepository.findById(id);
        
        if (vantagemExistente.isPresent()) {
            Vantagem vantagem = vantagemExistente.get();
            
            vantagem.setDescricao(requestDTO.getDescricao());
            vantagem.setCustoMoedas(requestDTO.getCustoMoedas());
            
            // Converter foto de Base64 para byte array se fornecida
            if (requestDTO.getFoto() != null && !requestDTO.getFoto().isEmpty()) {
                try {
                    byte[] fotoBytes = Base64.getDecoder().decode(requestDTO.getFoto());
                    vantagem.setFoto(fotoBytes);
                } catch (IllegalArgumentException e) {
                    // Se não for Base64 válido, manter foto atual
                }
            }

            // Atualizar vínculo com empresa se fornecido
            if (requestDTO.getEmpresaId() != null) {
                EmpresaParceira empresa = empresaParceiraRepository
                        .findById(requestDTO.getEmpresaId()).orElse(null);
                vantagem.setEmpresaParceira(empresa);
            }

            Vantagem vantagemAtualizada = vantagemRepository.save(vantagem);
            return Optional.of(converterParaResponseDTO(vantagemAtualizada));
        }
        
        return Optional.empty();
    }

    /**
     * Deleta uma vantagem
     */
    @Transactional
    public boolean deletar(Long id) {
        if (vantagemRepository.existsById(id)) {
            vantagemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Resgata uma vantagem (aluno troca moedas por vantagem)
     */
    @Transactional
    public VantagemResponseDTO resgatarVantagem(Long vantagemId, Long alunoId) {
        // Buscar vantagem
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new IllegalArgumentException("Vantagem não encontrada"));

        // Buscar aluno
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        // Verificar se o aluno tem moedas suficientes
        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new IllegalArgumentException("Saldo de moedas insuficiente. " +
                    "Necessário: " + vantagem.getCustoMoedas() + ", Disponível: " + aluno.getSaldoMoedas());
        }

        // Debitar moedas do aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        // Criar transação de resgate
        // Aluno é quem está resgatando (usuario), não há destinatário neste caso
        Transacao transacao = new Transacao();
        transacao.setUsuario(aluno);
        transacao.setUsuarioDestino(null); // Não há destinatário em resgate de vantagem
        transacao.setData(new Date());
        transacao.setValor(vantagem.getCustoMoedas());
        transacao.setTipo("RESGATE");
        transacao.setMotivo("Resgate de vantagem: " + vantagem.getDescricao());
        transacaoRepository.save(transacao);

        return converterParaResponseDTO(vantagem);
    }

    /**
     * Converte Vantagem para VantagemResponseDTO
     */
    private VantagemResponseDTO converterParaResponseDTO(Vantagem vantagem) {
        // Converter foto de byte array para Base64
        String fotoBase64 = null;
        if (vantagem.getFoto() != null && vantagem.getFoto().length > 0) {
            fotoBase64 = Base64.getEncoder().encodeToString(vantagem.getFoto());
        }

        EmpresaParceira empresa = vantagem.getEmpresaParceira();
        String empresaNome = null;
        if (empresa != null) {
            // Preferir nomeFantasia quando disponível; caso contrário, usar nome herdado de Usuario
            empresaNome = (empresa.getNomeFantasia() != null && !empresa.getNomeFantasia().isBlank())
                    ? empresa.getNomeFantasia()
                    : empresa.getNome();
        }

        return new VantagemResponseDTO(
                vantagem.getId(),
                vantagem.getDescricao(),
                fotoBase64,
                vantagem.getCustoMoedas(),
                empresa != null ? empresa.getId() : null,
                empresaNome
        );
    }

    /**
     * Converte Page do Spring Data para PageResponseDTO customizado
     */
    private PageResponseDTO<VantagemResponseDTO> convertToPageResponse(Page<Vantagem> page) {
        List<VantagemResponseDTO> items = page.getContent().stream()
            .map(this::converterParaResponseDTO)
            .collect(Collectors.toList());
        
        PageResponseDTO.PaginationMetadata metadata = new PageResponseDTO.PaginationMetadata(
            page.getNumber(),           // currentPage
            page.getTotalPages(),        // totalPages
            page.getTotalElements(),     // totalItems
            page.getSize(),              // pageSize
            page.hasNext(),              // hasNext
            page.hasPrevious()           // hasPrevious
        );
        
        return new PageResponseDTO<>(items, metadata);
    }
}
