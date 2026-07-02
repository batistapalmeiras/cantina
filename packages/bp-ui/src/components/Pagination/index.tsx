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
    <Wrapper>
      <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        ‹
      </PageButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PageButton key={page} $active={page === currentPage} onClick={() => onPageChange(page)}>
          {page}
        </PageButton>
      ))}

      <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        ›
      </PageButton>
    </Wrapper>
  );
}
