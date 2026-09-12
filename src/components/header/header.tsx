import styles from "./header.module.scss";

export function Header() {
  return (
    <header className={styles.root}>
      <svg
        className={styles.logo}
        viewBox="0 0 205 40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Logo"
      >
        <path d="M4 6h28a10 10 0 0 1 0 20H20v8H4V6Z" />
        <path d="M56 12h141a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H56V12Z" />
      </svg>
    </header>
  );
}
