'use client';

import { useRouter } from 'next/navigation';

export default function RoutingButton({ buttonText, route, className}: IRoutingButtonProps) {
  const router = useRouter();

  const handleStartSurvey = () => {
    router.push(route);
  };

  return (
        <button onClick={handleStartSurvey} className={className}>
          {buttonText}
        </button>
  );
}