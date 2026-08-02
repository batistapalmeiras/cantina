// Libs
import { Search } from 'lucide-react';
// Local
import { SearchInput, SearchWrap } from './styles';

interface IOrdersSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function OrdersSearch({ value, onChange }: IOrdersSearchProps) {
  return (
    <SearchWrap>
      <Search size={16} />
      <SearchInput
        placeholder="Buscar por nome do cliente…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </SearchWrap>
  );
}
