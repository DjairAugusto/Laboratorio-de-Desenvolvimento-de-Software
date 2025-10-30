package com.projeto.dto;

import java.util.Date;

public class TransacaoResponseDTO {

      private Long id;
      private Long usuarioId;
      private String usuarioNome;
      private Long empresaId;
      private String empresaNome;
      private Date data;
      private double valor;
      private String tipo; // "ENVIO", "RESGATE", "CREDITO"
      private String motivo;

      // Constructors
      public TransacaoResponseDTO() {
      }

      public TransacaoResponseDTO(Long id, Long usuarioId, String usuarioNome, Long empresaId,
                  String empresaNome, Date data, double valor, String tipo, String motivo) {
            this.id = id;
            this.usuarioId = usuarioId;
            this.usuarioNome = usuarioNome;
            this.empresaId = empresaId;
            this.empresaNome = empresaNome;
            this.data = data;
            this.valor = valor;
            this.tipo = tipo;
            this.motivo = motivo;
      }

      // Getters and Setters
      public Long getId() {
            return id;
      }

      public void setId(Long id) {
            this.id = id;
      }

      public Long getUsuarioId() {
            return usuarioId;
      }

      public void setUsuarioId(Long usuarioId) {
            this.usuarioId = usuarioId;
      }

      public String getUsuarioNome() {
            return usuarioNome;
      }

      public void setUsuarioNome(String usuarioNome) {
            this.usuarioNome = usuarioNome;
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

      public Date getData() {
            return data;
      }

      public void setData(Date data) {
            this.data = data;
      }

      public double getValor() {
            return valor;
      }

      public void setValor(double valor) {
            this.valor = valor;
      }

      public String getTipo() {
            return tipo;
      }

      public void setTipo(String tipo) {
            this.tipo = tipo;
      }

      public String getMotivo() {
            return motivo;
      }

      public void setMotivo(String motivo) {
            this.motivo = motivo;
      }
}
