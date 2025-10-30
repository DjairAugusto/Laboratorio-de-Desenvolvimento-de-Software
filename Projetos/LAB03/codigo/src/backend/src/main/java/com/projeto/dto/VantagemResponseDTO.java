package com.projeto.dto;

public class VantagemResponseDTO {

      private Long id;
      private String descricao;
      private String foto;
      private double custoMoedas;
      private Long empresaId;
      private String empresaNome;

      // Constructors
      public VantagemResponseDTO() {
      }

      public VantagemResponseDTO(Long id, String descricao, String foto, double custoMoedas, Long empresaId,
                  String empresaNome) {
            this.id = id;
            this.descricao = descricao;
            this.foto = foto;
            this.custoMoedas = custoMoedas;
            this.empresaId = empresaId;
            this.empresaNome = empresaNome;
      }

      // Getters and Setters
      public Long getId() {
            return id;
      }

      public void setId(Long id) {
            this.id = id;
      }

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

      public String getEmpresaNome() {
            return empresaNome;
      }

      public void setEmpresaNome(String empresaNome) {
            this.empresaNome = empresaNome;
      }
}
