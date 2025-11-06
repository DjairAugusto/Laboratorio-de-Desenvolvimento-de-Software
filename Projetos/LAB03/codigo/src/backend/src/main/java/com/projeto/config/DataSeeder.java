package com.projeto.config;

import com.projeto.model.*;
import com.projeto.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private InstituicaoEnsinoRepository instituicaoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private EmpresaParceiraRepository empresaRepository;

    @Autowired
    private VantagemRepository vantagemRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Override
    public void run(String... args) throws Exception {
        // Limpar dados existentes (opcional - comentar em produção)
        transacaoRepository.deleteAll();
        vantagemRepository.deleteAll();
        alunoRepository.deleteAll();
        professorRepository.deleteAll();
        empresaRepository.deleteAll();
        instituicaoRepository.deleteAll();

        // 1. Criar Instituição
        InstituicaoEnsino pucMinas = new InstituicaoEnsino("PUC Minas");
        instituicaoRepository.save(pucMinas);
        System.out.println("✅ Instituição criada: " + pucMinas.getNome());

        // 2. Criar Alunos
        Aluno ana = new Aluno(
            "Ana Silva",
            "12345678900",
            "ana@aluno.pucminas.br",
            "ana.silva",
            "senha123",
            "MG-12.345.678",
            "Rua das Flores, 123",
            "Engenharia de Software",
            1250.0,
            pucMinas
        );
        alunoRepository.save(ana);

        Aluno bruno = new Aluno(
            "Bruno Costa",
            "98765432100",
            "bruno@aluno.pucminas.br",
            "bruno.costa",
            "senha123",
            "MG-98.765.432",
            "Av. Central, 456",
            "Ciência da Computação",
            800.0,
            pucMinas
        );
        alunoRepository.save(bruno);
        System.out.println("✅ Alunos criados: Ana (1250 moedas), Bruno (800 moedas)");

        // 3. Criar Professor
        Professor carlos = new Professor(
            "Prof. Carlos Souza",
            "11122233344",
            "carlos@prof.pucminas.br",
            "carlos.souza",
            "senha123",
            "Departamento de Informática",
            5000.0,
            pucMinas
        );
        professorRepository.save(carlos);
        System.out.println("✅ Professor criado: Carlos (5000 moedas)");

        // 4. Criar Empresas Parceiras
        EmpresaParceira tech = new EmpresaParceira(
            "Tech Solutions LTDA",
            "12345678000190",
            "contato@techsolutions.com",
            "tech.solutions",
            "senha123",
            "Tech Solutions",
            "12.345.678/0001-90"
        );
        empresaRepository.save(tech);

        EmpresaParceira edu = new EmpresaParceira(
            "Edu Books SA",
            "98765432000100",
            "contato@edubooks.com",
            "edu.books",
            "senha123",
            "Edu Books",
            "98.765.432/0001-00"
        );
        empresaRepository.save(edu);
        System.out.println("✅ Empresas criadas: Tech Solutions, Edu Books");

        // 5. Criar Vantagens
        Vantagem v1 = new Vantagem(
            "Gift Card Amazon R$ 50",
            null,
            300.0
        );
        v1.setEmpresaParceira(tech);
        vantagemRepository.save(v1);

        Vantagem v2 = new Vantagem(
            "Curso Online - Programação Avançada",
            null,
            500.0
        );
        v2.setEmpresaParceira(tech);
        vantagemRepository.save(v2);

        Vantagem v3 = new Vantagem(
            "Livro Técnico - Clean Code",
            null,
            150.0
        );
        v3.setEmpresaParceira(edu);
        vantagemRepository.save(v3);

        Vantagem v4 = new Vantagem(
            "Caneca Personalizada Tech",
            null,
            100.0
        );
        v4.setEmpresaParceira(tech);
        vantagemRepository.save(v4);

        Vantagem v5 = new Vantagem(
            "Desconto 20% em Livros Técnicos",
            null,
            200.0
        );
        v5.setEmpresaParceira(edu);
        vantagemRepository.save(v5);

        System.out.println("✅ 5 Vantagens criadas com sucesso!");

        // 6. Criar Transações de Exemplo
        Transacao t1 = new Transacao(
            carlos,
            ana,
            new Date(),
            150.0,
            "TRANSFERENCIA_PROFESSOR_ALUNO",
            "Excelente participação em aula"
        );
        transacaoRepository.save(t1);

        Transacao t2 = new Transacao(
            carlos,
            bruno,
            new Date(),
            100.0,
            "TRANSFERENCIA_PROFESSOR_ALUNO",
            "Projeto bem desenvolvido"
        );
        transacaoRepository.save(t2);

        System.out.println("✅ Transações criadas");
        System.out.println("\n🎉 DADOS MOCADOS CARREGADOS COM SUCESSO!");
        System.out.println("\n📊 RESUMO:");
        System.out.println("   - 1 Instituição");
        System.out.println("   - 2 Alunos");
        System.out.println("   - 1 Professor");
        System.out.println("   - 2 Empresas");
        System.out.println("   - 5 Vantagens");
        System.out.println("   - 2 Transações");
    }
}
