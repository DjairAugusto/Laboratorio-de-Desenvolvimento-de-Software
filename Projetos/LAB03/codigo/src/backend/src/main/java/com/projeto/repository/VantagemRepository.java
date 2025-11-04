package com.projeto.repository;

import com.projeto.model.Vantagem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {
    List<Vantagem> findByEmpresaParceira_Id(Long empresaId);
    Page<Vantagem> findByEmpresaParceira_Id(Long empresaId, Pageable pageable);
    java.util.Optional<Vantagem> findByIdAndEmpresaParceira_Id(Long id, Long empresaId);
}