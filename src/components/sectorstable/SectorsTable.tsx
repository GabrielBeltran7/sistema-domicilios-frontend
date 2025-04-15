import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getSectors, initSectorsListener } from '../../redux/actions';
import styles from './SectorTable.module.css';

const SectorTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const sectors = useSelector((state: RootState) => state.sector.sectors);
  const error = useSelector((state: RootState) => state.sector.error);

  useEffect(() => {
    dispatch(getSectors());
    const unsubscribe = dispatch(initSectorsListener());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  const formatMinutesToTime = (minutes: number): string => {
    if (isNaN(minutes) || minutes < 0) return '00:00';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Sectores Registrados</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Horario</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector) => (
              <tr key={sector.id}>
                <td>{sector.name}</td>
                <td>{sector.address}</td>
                <td>
                  {formatMinutesToTime(sector.scheduleFromMinutes)} - {formatMinutesToTime(sector.scheduleToMinutes)}
                </td>
              </tr>
            ))}
            {sectors.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.empty}>No hay sectores registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectorTable;
