export type Sector = {
  id?: string;
    name: string;
    address: string;
    scheduleFromMinutes: number;
    scheduleToMinutes: number;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  