import { useSettingsService } from "../../context/useSettingsService";
import styles from './GeneralSettings.module.scss'

const GeneralSettings = () => {

  const {
    mosqueName,
    setMosqueName,
    locationName,
    setLocationName,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    adhanLeadMins,
    setAdhanLeadMins,
    slideIntervalMs,
    setSlideIntervalMs,
    iqamahIntervalMs,
    setIqamahIntervalMs
  } = useSettingsService();

  const handleChange = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement;
    console.log(`name ${typeof name} ${name}`)
    if (name === 'mosqueName') {
      setMosqueName(value);
    }
    if (name === 'locationName') {
      setLocationName(value);
    }
    if (name === 'latitude') {
      setLatitude(value);
    }
    if (name === 'longitude') {
      setLongitude(value);
    }
    if (name === 'adhanLeadMins') {
      setAdhanLeadMins(value);
    }
    if (name === 'slideIntervalMs') {
      setSlideIntervalMs(value);
    }
    if (name === 'iqamahIntervalMs') {
      setIqamahIntervalMs(value);
    }
  }

  return (
    <div class={styles.container}>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Mosque or Surau Name
        </label>
        <input class={styles.formInput} name="mosqueName" value={mosqueName()} onInput={handleChange} />
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Location Name
        </label>
        <input class={styles.formInput} name="locationName" value={locationName()} onInput={handleChange} />
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Latitude
        </label>
        <input class={styles.formInput} name="latitude" value={latitude()} onInput={handleChange} />
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Longitude
        </label>
        <input class={styles.formInput} name="longitude" value={longitude()} onInput={handleChange} />
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Papar Skrin Countdown Azan
        </label>
        <input class={styles.formInput} type="number" name="adhanLeadMins" value={adhanLeadMins()} onInput={handleChange} />
        <small class={styles.hint}>Minit sebelum waktu solat</small>
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Selang masa tukar paparan
        </label>
        <input class={styles.formInput} type="number" name="slideIntervalMs" value={slideIntervalMs()} onInput={handleChange} />
        <small class={styles.hint}>Miliseconds sebelum tukar paparan seterusnya</small>
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Selang masa sebelum Iqamah
        </label>
        <input class={styles.formInput} type="number" name="iqamahIntervalMs" value={iqamahIntervalMs()} onInput={handleChange} />
        <small class={styles.hint}>Miliseconds (12 mins. 1 sec=1000 miliseconds) </small>
      </div>
    </div>
  );
};

export default GeneralSettings;