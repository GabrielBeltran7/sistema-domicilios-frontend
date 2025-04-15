import React, { useState, useRef } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useDispatch } from 'react-redux';
import { addSector } from '../../redux/actions';
import { AppDispatch } from '../../redux/store';
import styles from './SectorForm.module.css';
import Swal from 'sweetalert2';

type Sector = {
  name: string;
  address: string;
  scheduleFrom: string;
  scheduleTo: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type SectorToSave = {
  name: string;
  address: string;
  scheduleFromMinutes: number;
  scheduleToMinutes: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

const libraries: ("places" | "drawing" | "geometry")[] = ["places"];

export const SectorForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [form, setForm] = useState<Sector>({
    name: '',
    address: '',
    scheduleFrom: '',
    scheduleTo: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  });

  const [errors, setErrors] = useState<Partial<Sector>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, ] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof Sector]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) {
      setErrors(prev => ({ ...prev, address: 'No se pudo cargar el autocompletado' }));
      return;
    }

    const place = autocompleteRef.current.getPlace();

    if (!place.geometry || !place.geometry.location) {
      setErrors(prev => ({ ...prev, address: 'Selecciona una dirección válida del listado' }));
      return;
    }

    const address = place.formatted_address || '';
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setForm(prev => ({
      ...prev,
      address,
      coordinates: {
        lat,
        lng,
      },
    }));

    setErrors(prev => ({ ...prev, address: undefined }));
  };

  const validateTimeFormat = (time: string) => {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  const validate = () => {
    const newErrors: Partial<Sector> = {};

    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';

    if (!form.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    } else if (form.coordinates.lat === 0 && form.coordinates.lng === 0) {
      newErrors.address = 'Selecciona una dirección válida del listado';
    }

    if (!form.scheduleFrom || !form.scheduleTo) {
      newErrors.scheduleFrom = 'Debes ingresar ambas horas';
      newErrors.scheduleTo = 'Debes ingresar ambas horas';
    } else if (!validateTimeFormat(form.scheduleFrom) || !validateTimeFormat(form.scheduleTo)) {
      newErrors.scheduleFrom = 'Formato de hora inválido';
      newErrors.scheduleTo = 'Formato de hora inválido';
    } else if (form.scheduleFrom >= form.scheduleTo) {
      newErrors.scheduleFrom = 'La hora de inicio debe ser antes que la hora de fin';
      newErrors.scheduleTo = 'La hora de inicio debe ser antes que la hora de fin';
    }

    return newErrors;
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const sectorToSave: SectorToSave = {
        name: form.name,
        address: form.address,
        scheduleFromMinutes: timeToMinutes(form.scheduleFrom),
        scheduleToMinutes: timeToMinutes(form.scheduleTo),
        coordinates: form.coordinates,
      };

      await dispatch(addSector(sectorToSave));

      setForm({
        name: '',
        address: '',
        scheduleFrom: '',
        scheduleTo: '',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      });

      Swal.fire({
        icon: 'success',
        title: '¡Sector registrado!',
        text: 'El sector se ha registrado correctamente',
        confirmButtonColor: '#3498db',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al registrar el sector. Intenta de nuevo.',
        confirmButtonColor: '#e74c3c',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadError) return <p className="text-center mt-4">Error al cargar el mapa</p>;
  if (!isLoaded) return <p className="text-center mt-4">Cargando mapa...</p>;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Crear Sector</h2>

      {submitError && <p className={styles.errorText}>{submitError}</p>}

      <label className={styles.label}>
        Nombre del sector:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}
      </label>

      <label className={styles.label}>
        Dirección:
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={onPlaceChanged}
          fields={['formatted_address', 'geometry.location']}
        >
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className={styles.input}
            placeholder="Busca una dirección"
          />
        </Autocomplete>
        {errors.address && <p className={styles.errorText}>{errors.address}</p>}
      </label>

      <label className={styles.label}>
        Horario de atención Domicilios:
        <div className={styles.timeInputs}>
          <span className={styles.timeSeparator}>Desde las</span>
          <input
            type="time"
            name="scheduleFrom"
            value={form.scheduleFrom}
            onChange={handleChange}
            className={styles.input}
          />
          <span className={styles.timeSeparator}>hasta las</span>
          <input
            type="time"
            name="scheduleTo"
            value={form.scheduleTo}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        {(errors.scheduleFrom || errors.scheduleTo) && (
          <p className={styles.errorText}>{errors.scheduleFrom || errors.scheduleTo}</p>
        )}
      </label>

      <button
        type="submit"
        disabled={loading}
        className={styles.submitButton}
      >
        {loading ? 'Enviando...' : 'Guardar Sector'}
      </button>
    </form>
  );
};
