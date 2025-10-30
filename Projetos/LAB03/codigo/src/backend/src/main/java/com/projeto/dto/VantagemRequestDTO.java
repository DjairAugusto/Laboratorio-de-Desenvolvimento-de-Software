package com.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class VantagemRequestDTO {

      @NotBlank(message = "Descrição é obrigatória")
      private String descricao;

      private String foto; // Base64 encoded image or URL

      @Positive(message = "Custo em moedas deve ser positivo")
      private double custoMoedas;

      private Long empresaId; // ID da empresa que oferece a vantagem

      // Constructors
      public VantagemRequestDTO() {
      }

      public VantagemRequestDTO(String descricao, String foto, double custoMoedas, Long empresaId) {
            this.descricao = descricao;
            this.foto = foto;
            this.custoMoedas = custoMoedas;
            this.empresaId = empresaId;
      }

      // Getters and Setters
      public String getDescricao() {
            return descricao;
      }

      public void setDescricao(String descricao) {
            this.descricao = descricao;
      }

      public String getFoto() {
            return foto;
      }

      public void setFoto(String foto) {
            this.foto = foto;
      }

      public double getCustoMoedas() {
            return custoMoedas;
      }

      public void setCustoMoedas(double custoMoedas) {
            this.custoMoedas = custoMoedas;
      }

      public Long getEmpresaId() {
            return empresaId;
      }

      public void setEmpresaId(Long empresaId) {
            this.empresaId = empresaId;
      }
}
