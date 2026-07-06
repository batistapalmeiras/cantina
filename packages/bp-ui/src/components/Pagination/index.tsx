// Local
import { PageButton, Wrapper } from './styles';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Wrapper role="navigation" aria-label="Paginação">
      <PageButton type="button" aria-label="Página anterior" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <span aria-hidden="true">‹</span>
      </PageButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PageButton
          key={page}
          type="button"
          $active={page === currentPage}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Página ${page}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      <PageButton type="button" aria-label="Próxima página" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <span aria-hidden="true">›</span>
      </PageButton>
    </Wrapper>
  );
}
