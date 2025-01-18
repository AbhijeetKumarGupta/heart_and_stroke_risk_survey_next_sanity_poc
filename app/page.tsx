import RoutingButton from '@/components/RoutingButton/RoutingButton';

import styles from './page.module.css';

export default function Home() {

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Our Survey</h1>
        <p className={styles.description}>
          We're excited to have you here. Click the button below to start the survey.
        </p>
        <RoutingButton route='/survey' buttonText='Start Survey' className={styles.startButton} />
      </div>
    </div>
  );
}
