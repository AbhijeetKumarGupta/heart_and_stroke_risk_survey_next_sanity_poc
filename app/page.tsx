'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { documentToReact, fetchSurveyData } from '@/src/utils/survey';
import RoutingButton from '@/components/RoutingButton/RoutingButton';
import { SELECTORS } from '@/cypress/selectors';
import { setSurveyData } from '@/src/store/surveySlice';
import client from '@/contentful/apolloClient';
import { GET_SURVEY_INFORMATION } from '@/contentful/graphql/queries/getSurveyInformation';

import styles from './page.module.css';

export default function Home() {
  const dispatch = useDispatch();

  const {
    surveyData
  } = useSelector((state: any) => state);

  useEffect(() => {
    const setSurveyInfo = async () => {
      try {
        // GraphQL Test //
        const { data } = await client.query<any>({
          query: GET_SURVEY_INFORMATION,
        });
        // ------------ //
        const { data: surveyInfo } = await fetchSurveyData();
        dispatch(setSurveyData(surveyInfo));
      } catch (error) {
        console.error('Error fetching survey information:', error);
      }
    };
    setSurveyInfo();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1
          data-test={SELECTORS.WELCOME_PAGE.TITLE}
          className={styles.title}
        >
          {surveyData?.title || 'Loading...'}
        </h1>
        <div
          data-test={SELECTORS.WELCOME_PAGE.DESCRIPTION}
          className={styles.description}
        >
          {surveyData?.description
            ? documentToReact(surveyData.description)
            : 'Loading description...'}
        </div>
        <RoutingButton
          dataTest={SELECTORS.WELCOME_PAGE.START_SURVEY_BUTTON}
          route="/survey"
          buttonText="Start Survey"
          className={styles.startButton}
        />
      </div>
    </div>
  );
}
