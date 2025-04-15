


import { SectorForm } from '../../components/sectorform/SectorForm'; // Componente para crear sectores
import SectorTable from '../../components/sectorstable/SectorsTable';
import AvailableSectors from '../../components/availablesectors/AvailableSectors';

export const SectorManagementPage: React.FC = () => {


  return (
    <div className="sector-management-page">
      <h1>Gestión de Sectores</h1> 
      <SectorForm />
      <SectorTable />
      <AvailableSectors />
    
    </div>
  );
};
