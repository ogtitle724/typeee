import styles from "./select.module.css";

export default function Select({ options, value, placeholder, onChange }) {
  return (
    <select
      className={styles.pre + " type_a"}
      value={value}
      onChange={onChange}
    >
      <option value="">{placeholder}</option>
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
