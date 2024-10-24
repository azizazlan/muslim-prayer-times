import { useDailyVerseService } from "../../context/useDailyVerseService";
import { useSettingsService } from "../../context/useSettingsService";
import styles from './GeneralSettings.module.scss'

const GeneralSettings = () => {

  const {
    enabledSlides,
    setEnabledSlides,
    calculationMethod,
    setCalculationMethod,
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
    iqamahIntervalMins,
    setIqamahIntervalMins
  } = useSettingsService();

  const { isOnline, enableDailyVerse, setEnableDailyVerse } = useDailyVerseService();

  const handleChange = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement;
    console.log(`name ${typeof name} ${name}`)
    if (name === 'calculationMethod') {
      setCalculationMethod(value);
    }
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
    if (name === 'iqamahIntervalMins') {
      setIqamahIntervalMins(value);
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
          Kaedah pengiraan masa solat
        </label>
        {/* <input class={styles.formInput} name="calculationMethod" value={calculationMethod()} onInput={handleChange} /> */}
        {/* <small class={styles.hint}>JAKIM | Egypt | ISNA | Jafari | Makkah | MF | MWL | Tehran</small> */}
        <select class={styles.formSelectInput} name="calculationMethod" value={calculationMethod()} onInput={handleChange}>
          <option value="JAKIM">JAKIM</option>
          <option value="Egypt">Egypt</option>
          <option value="ISNA">ISNA</option>
          <option value="Jafari">Jafari</option>
          <option value="Karachi">Karachi</option>
          <option value="Makkah">Makkah</option>
          <option value="MF">MF</option>
          <option value="MWL">MWL</option>
          <option value="Tehran">Tehran</option>
        </select>
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
          Papar Countdown Azan
        </label>
        <input class={styles.formInput} type="number" name="adhanLeadMins" value={adhanLeadMins()} onInput={handleChange} />
        <small class={styles.hint}>minit sebelum waktu</small>
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Papar Countdown Iqamah
        </label>
        <input class={styles.formInput} type="number" name="iqamahIntervalMs" value={iqamahIntervalMins()} onInput={handleChange} />
        <small class={styles.hint}>minit sebelum iqamah</small>
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Tukar paparan
        </label>
        <input
          class={styles.formCheckboxInput}
          type="checkbox"
          name="enabledSlides"
          checked={enabledSlides()}
          onChange={(event) => {
            setEnabledSlides(event.target.checked);
          }}
        />
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Selang masa tukar paparan
        </label>
        <input class={styles.formInput} type="number" name="slideIntervalMs" value={slideIntervalMs()} onInput={handleChange} />
        <small class={styles.hint}>miliseconds sebelum tukar paparan seterusnya</small>
      </div>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Papar Teks Al-Quran
        </label>
        <input
          checked={enableDailyVerse()}
          disabled={!isOnline()}
          class={styles.formCheckboxInput}
          type="checkbox"
          name="enabledDAilyVerse"
          onChange={(event) => {
            setEnableDailyVerse(event.target.checked);
          }}
        />
      </div>
    </div>
  );
};

export default GeneralSettings;