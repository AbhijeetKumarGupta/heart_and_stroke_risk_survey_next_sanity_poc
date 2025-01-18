'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { resetSurveyState } from '@/src/store/surveySlice';

export default function RoutingButton({ buttonText, route, className, dataTest, onClick}: IRoutingButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleStartSurvey = () => {
    onClick?.()
    dispatch(resetSurveyState());
    router.push(route);
  };

  return (
        <button data-test={dataTest} id="button" onClick={handleStartSurvey} className={className}>
          {buttonText}
        </button>
  );
}