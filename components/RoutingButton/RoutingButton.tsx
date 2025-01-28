import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { resetSurveyState } from '@/src/store/surveySlice';

export default function RoutingButton({ buttonText, route, className, dataTest, onClick }: {
  buttonText: string;
  route: string;
  className: string;
  dataTest?: string
  onClick?: () => void
}) {
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