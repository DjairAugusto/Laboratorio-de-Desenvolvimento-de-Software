package com.projeto.config;

import com.projeto.dto.AlunoRequestDTO;
import com.projeto.dto.EmpresaParceiraRequestDTO;
import com.projeto.dto.VantagemRequestDTO;
import com.projeto.model.InstituicaoEnsino;
import com.projeto.repository.InstituicaoEnsinoRepository;
import com.projeto.repository.AlunoRepository;
import com.projeto.repository.EmpresaParceiraRepository;
import com.projeto.repository.VantagemRepository;
import com.projeto.service.AlunoService;
import com.projeto.service.EmpresaParceiraService;
import com.projeto.service.VantagemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seed de dados mínimos em ambiente H2 para facilitar testes locais.
 * Cria: Instituição, Empresa Parceira, Aluno com saldo e uma Vantagem.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final InstituicaoEnsinoRepository instituicaoRepo;
    private final EmpresaParceiraService empresaService;
    private final EmpresaParceiraRepository empresaRepo;
    private final AlunoService alunoService;
    private final AlunoRepository alunoRepo;
    private final VantagemService vantagemService;
    private final VantagemRepository vantagemRepo;

    public DataSeeder(InstituicaoEnsinoRepository instituicaoRepo,
                      EmpresaParceiraService empresaService,
                      EmpresaParceiraRepository empresaRepo,
                      AlunoService alunoService,
                      AlunoRepository alunoRepo,
                      VantagemService vantagemService,
                      VantagemRepository vantagemRepo) {
        this.instituicaoRepo = instituicaoRepo;
        this.empresaService = empresaService;
        this.empresaRepo = empresaRepo;
        this.alunoService = alunoService;
        this.alunoRepo = alunoRepo;
        this.vantagemService = vantagemService;
        this.vantagemRepo = vantagemRepo;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (instituicaoRepo.count() == 0) {
            InstituicaoEnsino inst = new InstituicaoEnsino("Instituto Teste");
            inst = instituicaoRepo.save(inst);
            log.info("Instituição criada id={}", inst.getId());
        }
        Long instId = instituicaoRepo.findAll().get(0).getId();

        if (empresaRepo.count() == 0) {
            EmpresaParceiraRequestDTO empresaDTO = new EmpresaParceiraRequestDTO(
                    "Empresa Teste", "DOC123", "empresa@teste.com", "empresateste", "senha123", "Empresa Teste LTDA", "12345678000199"
            );
            var empresa = empresaService.criar(empresaDTO);
            log.info("Empresa criada id={}", empresa.getId());
        }
        Long empresaId = empresaRepo.findAll().get(0).getId();

        if (alunoRepo.count() == 0) {
            AlunoRequestDTO alunoDTO = new AlunoRequestDTO(
                    "Aluno Demo", "ALU123", "aluno@demo.com", "alunoteste", "senha123", "RG123456", "Rua Exemplo, 123", "Computação", 200.0, instId
            );
            var aluno = alunoService.criar(alunoDTO);
            log.info("Aluno criado id={} saldo={}", aluno.getId(), aluno.getSaldoMoedas());
        }
        Long alunoId = alunoRepo.findAll().get(0).getId();

        if (vantagemRepo.count() == 0) {
            VantagemRequestDTO vantagemDTO = new VantagemRequestDTO(
                    "Desconto de 10%", null, 50.0, empresaId
            );
            var vantagem = vantagemService.criar(vantagemDTO);
            log.info("Vantagem criada id={} custoMoedas={}", vantagem.getId(), vantagem.getCustoMoedas());
            log.info("Para testar resgate: POST /api/vantagens/{}/resgatar?alunoId={}", vantagem.getId(), alunoId);
        }
    }
}
