import styles from "./select.module.css";

export default function Select({ options, value, onChange }) {
  return (
    <select className={styles.pre + " card"} value={value} onChange={onChange}>
      <option value="">--- TOPIC ---</option>
      {options.map((option) => {
        return (
          <option key={`option_${option}`} value={option.toLowerCase()}>
            {option}
          </option>
        );
      })}
    </select>
  );
}
