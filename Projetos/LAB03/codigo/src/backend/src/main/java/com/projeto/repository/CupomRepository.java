package com.projeto.repository;

import com.projeto.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CupomRepository extends JpaRepository<Cupom, Long> {
	Optional<Cupom> findByCodigo(String codigo);
}
