import { memo, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

type RowProps = {
  filteredCountries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const LIST_HEIGHT = 700;
const ITEM_BASE_HEIGHT = 180;
const ROW_HEIGHT = 36;

const CountryRow = ({
  index,
  style,
  filteredCountries,
  selectedYear,
  selectedColumns,
}: RowComponentProps<RowProps>) => {
  const country = filteredCountries[index];
  return (
    <div style={{ ...style, paddingBottom: 16 }}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const normalizedQuery = searchQuery.toLowerCase().trim();

      return countries
        .filter((c) => {
          const matchesSearch = c.id.toLowerCase().includes(normalizedQuery);
          const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          } else {
            const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
            const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
            return sortOrder === 'asc' ? popA - popB : popB - popA;
          }
        });
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const itemSize = ITEM_BASE_HEIGHT + selectedColumns.length * ROW_HEIGHT;

    return (
      <div className={styles.countryList}>
        <List
          rowCount={filteredCountries.length}
          rowHeight={itemSize}
          rowComponent={CountryRow}
          rowProps={{ filteredCountries, selectedYear, selectedColumns }}
          style={{ height: LIST_HEIGHT }}
        />
      </div>
    );
  }
);

CountryList.displayName = 'CountryList';
