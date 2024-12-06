'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const handleStartSurvey = () => {
    router.push('/survey');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Our Survey</h1>
        <p className={styles.description}>
          We're excited to have you here. Click the button below to start the survey.
        </p>
        <button onClick={handleStartSurvey} className={styles.startButton}>
          Start Survey
        </button>
      </div>
    </div>
  );
}
