package com.projeto.dto;

import java.util.List;

/**
 * DTO genérico para respostas paginadas com metadados otimizados
 */
public class PageResponseDTO<T> {
    
    private List<T> items;
    private PaginationMetadata pagination;

    public PageResponseDTO() {
    }

    public PageResponseDTO(List<T> items, PaginationMetadata pagination) {
        this.items = items;
        this.pagination = pagination;
    }

    // Getters and Setters
    public List<T> getItems() {
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public PaginationMetadata getPagination() {
        return pagination;
    }

    public void setPagination(PaginationMetadata pagination) {
        this.pagination = pagination;
    }

    /**
     * Classe interna para metadados de paginação
     */
    public static class PaginationMetadata {
        private int currentPage;
        private int totalPages;
        private long totalItems;
        private int pageSize;
        private boolean hasNext;
        private boolean hasPrevious;

        public PaginationMetadata() {
        }

        public PaginationMetadata(int currentPage, int totalPages, long totalItems, 
                                 int pageSize, boolean hasNext, boolean hasPrevious) {
            this.currentPage = currentPage;
            this.totalPages = totalPages;
            this.totalItems = totalItems;
            this.pageSize = pageSize;
            this.hasNext = hasNext;
            this.hasPrevious = hasPrevious;
        }

        // Getters and Setters
        public int getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public long getTotalItems() {
            return totalItems;
        }

        public void setTotalItems(long totalItems) {
            this.totalItems = totalItems;
        }

        public int getPageSize() {
            return pageSize;
        }

        public void setPageSize(int pageSize) {
            this.pageSize = pageSize;
        }

        public boolean isHasNext() {
            return hasNext;
        }

        public void setHasNext(boolean hasNext) {
            this.hasNext = hasNext;
        }

        public boolean isHasPrevious() {
            return hasPrevious;
        }

        public void setHasPrevious(boolean hasPrevious) {
            this.hasPrevious = hasPrevious;
        }
    }
}
