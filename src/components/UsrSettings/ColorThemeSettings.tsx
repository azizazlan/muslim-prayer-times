import { Component, createSignal, createMemo, For } from 'solid-js';
import styles from './ColorThemeSettings.module.scss';
import { useThemeService } from '../../context/useThemeService';
import { ColorTheme } from '../../types/theme';

const ColorThemeSettings: Component = () => {

  const { colorTheme, setColorTheme } = useThemeService();

  const handleChange = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement;
    console.log(`name ${typeof name} ${name}`)
    setColorTheme(value);
  }

  return (
    <div class={styles.container}>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Tema warna
        </label>
        <select class={styles.formSelectInput} name="colorTheme" onInput={handleChange}>
          <option value={ColorTheme.BLACK_AND_WHITE}>Hitam dan putih</option>
          <option value={ColorTheme.BLUE_AND_WHITE}>Biru dan putih</option>
        </select>
      </div>
    </div>
  )
}
export default ColorThemeSettings;