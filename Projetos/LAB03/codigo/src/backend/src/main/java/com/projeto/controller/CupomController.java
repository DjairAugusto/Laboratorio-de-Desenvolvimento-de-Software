package com.projeto.controller;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.model.Cupom;
import com.projeto.repository.CupomRepository;

@RestController
@RequestMapping("/api/cupoms")
@CrossOrigin(origins = "*")
public class CupomController {

      @Autowired
      private CupomRepository cupomRepository;

      /**
       * Marca um cupom como utilizado a partir do seu código.
       * Método: POST /api/cupoms/{codigo}/usar
       */
      @PostMapping("/{codigo}/usar")
      public ResponseEntity<?> usarCupom(@PathVariable String codigo) {
            try {
                  Optional<Cupom> opt = cupomRepository.findByCodigo(codigo);
                  if (opt.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cupom não encontrado");
                  }

                  Cupom cupom = opt.get();

                  // Verificações
                  if (!cupom.isValido()) {
                        return ResponseEntity.badRequest().body("Cupom inválido");
                  }

                  if (cupom.isUtilizado()) {
                        return ResponseEntity.badRequest().body("Cupom já utilizado");
                  }

                  Date now = new Date();
                  if (cupom.getDataVencimento() != null && cupom.getDataVencimento().before(now)) {
                        return ResponseEntity.badRequest().body("Cupom vencido");
                  }

                  // Marcar como utilizado
                  cupom.setUtilizado(true);
                  cupom.setDataUtilizacao(now);
                  cupomRepository.save(cupom);

                  return ResponseEntity.ok(Map.of(
                              "codigo", cupom.getCodigo(),
                              "utilizado", true,
                              "dataUtilizacao", cupom.getDataUtilizacao(),
                              "vantagemId", cupom.getVantagem() != null ? cupom.getVantagem().getId() : null));
            } catch (Exception e) {
                  return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                              .body("Erro ao validar cupom: " + e.getMessage());
            }
      }
}
