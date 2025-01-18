import RoutingButton from '@/components/RoutingButton/RoutingButton';
import { SELECTORS } from '@/cypress/selectors';

import styles from './page.module.css';

export default function Home() {

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 
          data-test={SELECTORS.WELCOME_PAGE.TITLE} 
          className={styles.title}
        >
          Welcome to Our Survey
        </h1>
        <p 
          data-test={SELECTORS.WELCOME_PAGE.DESCRIPTION} 
          className={styles.description}
        >
          We're excited to have you here. Click the button below to start the survey.
        </p>
        <RoutingButton 
          dataTest={SELECTORS.WELCOME_PAGE.START_SURVEY_BUTTON} 
          route='/survey' 
          buttonText='Start Survey' 
          className={styles.startButton} 
        />
      </div>
    </div>
  );
}
