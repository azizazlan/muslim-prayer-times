import { Component, createSignal, createMemo, For } from 'solid-js';
import styles from './ColorThemeSettings.module.scss';
import { useThemeService } from '../../context/useThemeService';
import { ColorTheme } from '../../types/theme';

const ColorThemeSettings: Component = () => {

  const { colorTheme, toggleColorTheme } = useThemeService();

  const [selectedColorTheme, setSelectedColorTheme] = createSignal(colorTheme()); // Initialize with context value


  const handleChange = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement;
    console.log(`name ${typeof name} ${name}`)
    toggleColorTheme(value);
    setSelectedColorTheme(value);
  }

  return (
    <div class={styles.container}>
      <div class={styles.field}>
        <label class={styles.fieldLabel}>
          Warna Tema
        </label>
        <select class={styles.formSelectInput} name="colorTheme" onInput={handleChange} value={selectedColorTheme()}>
          <option value={ColorTheme.BLACK_AND_WHITE}>Hitam dan Putih</option>
          <option value={ColorTheme.BLUE_AND_WHITE}>Biru dan Putih</option>
          <option value={ColorTheme.PINK_AND_TIFFANY}>Pink and Biru Tiffany</option>
          <option value={ColorTheme.GREENGRASS_AND_FLIRTMAROON}>Hijau Rumput dan Maroon</option>
          <option value={ColorTheme.GREENGRASS_AND_BLACK}>Hijau Rumput dan Hitam</option>
          <option value={ColorTheme.GOLD_AND_DARKBLUE}>Emas dan Biru Gelap</option>
          <option value={ColorTheme.FORESTBLUE_AND_REDWOORD}>Biru Hutan dan Merah Kayu</option>
          <option value={ColorTheme.RED_MONOCHROMATIC}>Merah Monokromatik</option>
          <option value={ColorTheme.PINKGLAMOUR_MONOCHROMATIC}>Pink Glamor Monokromatik</option>
          <option value={ColorTheme.GREY_MONOCHROMATIC}>Kelabu Monokromatik</option>
        </select>
      </div>
    </div>
  )
}
export default ColorThemeSettings;