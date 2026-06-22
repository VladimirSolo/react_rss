import { memo, useMemo } from 'react';
import type { Country } from '../../types';
import { DataTable } from '../data-table/data-table';
import { createYearDataMap } from '../../utils/data-transformers';
import { formatNumber } from '../../utils/format-utils';

import styles from './country-card.module.css';

type CountryCardProps = {
  country: Country;
  selectedYear: number;
  selectedColumns: string[];
};

export const CountryCard = memo(({ country, selectedYear, selectedColumns }: CountryCardProps) => {
  const yearDataMap = useMemo(() => createYearDataMap(country.data), [country.data]);
  const record = yearDataMap.get(selectedYear);
  const population = record?.population;
  const co2 = record?.co2;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{country.id}</h3>
        {country.iso_code && <span className={styles.isoCode}>{country.iso_code}</span>}
      </div>

      <div className={styles.stats}>
        <div>
          Population ({selectedYear}): {formatNumber(population)}
        </div>
        <div>
          CO₂ Emissions ({selectedYear}): {formatNumber(co2)} tonnes
        </div>
      </div>

      <DataTable record={record} year={selectedYear} columns={selectedColumns} />
    </div>
  );
});

CountryCard.displayName = 'CountryCard';
