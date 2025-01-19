import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import { SELECTORS } from '@/cypress/selectors';

const mockSurveyData = {
  survey_name: 'Survey Title',
  description: 'This is a survey description.',
  risk_range: {
    low_risk_range: { min: 0, max: 10, message: 'Low risk' },
    moderate_risk_range: { min: 11, max: 20, message: 'Moderate risk' },
    high_risk_range: { min: 21, max: 30, message: 'High risk' },
  },
  first_question: {
    multipleSelect: false,
    options: [],
    title: 'Question 1',
    isRequired: true,
    name: 'q1',
    description: 'First question description',
    field_type: 'string',
    _id: 'q1_id',
  },
  non_dependent_questions_count: 5,
};

describe('Header Component', () => {
  it('renders the survey name and description correctly', () => {
    const { container } = render(
      <Header
        surveyData={mockSurveyData}
        noOfQuestions={10}
        answeredQuestions={5}
        showProgressBar={false}
      />
    );

    expect(screen.getByText('Survey Title')).toBeInTheDocument();
    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.SURVEY.DESCRIPTION}"]`)
    ).toHaveTextContent('This is a survey description.');

  });

  it('renders progress bar when showProgressBar is true', () => {
    const { container } = render(
      <Header
        surveyData={mockSurveyData}
        noOfQuestions={10}
        answeredQuestions={5}
        showProgressBar={true}
      />
    );

    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.PROGRESS.LABEL}"]`)
    ).toBeInTheDocument();
    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.PROGRESS.BAR}"]`)
    ).toBeInTheDocument();
    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.PROGRESS.AMOUNT}"]`)
    ).toBeInTheDocument();
  });

  it('does not render progress bar when showProgressBar is false', () => {
    const { container } = render(
      <Header
        surveyData={mockSurveyData}
        noOfQuestions={10}
        answeredQuestions={5}
        showProgressBar={false}
      />
    );

    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.PROGRESS.LABEL}"]`)
    ).toBeNull();
    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.PROGRESS.BAR}"]`)
    ).toBeNull();
    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.PROGRESS.AMOUNT}"]`)
    ).toBeNull();
  });

  it('calculates and displays the correct progress percentage', () => {
    const { container } = render(
      <Header
        surveyData={mockSurveyData}
        noOfQuestions={10}
        answeredQuestions={5}
        showProgressBar={true}
      />
    );

    expect(
      container.querySelector(`[data-test="${SELECTORS.SURVEY_PAGE.PROGRESS.AMOUNT}"]`)
    ).toHaveTextContent('50%')
  });
});
