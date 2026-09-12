import styles from "./loading-screen.module.scss";

type LoadingScreenProps = {
  className?: string;
};

export function LoadingScreen({ className }: LoadingScreenProps) {
  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.illustration}>
        <img
          className={styles.walk}
          src="/assets/animations/hero-character.png"
          width={750}
          height={750}
          alt=""
          decoding="sync"
          fetchPriority="high"
        />
      </div>
      <p className={styles.label}>LOADING..</p>
    </div>
  );
}
