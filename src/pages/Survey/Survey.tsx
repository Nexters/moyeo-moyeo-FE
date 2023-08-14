import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { useGetTotalInfoForSurvey } from '@/apis/survey/queries';

import NotFound from '../NotFound';
import { SurveyForm } from './SurveyForm';
import { SurveyResult } from './SurveyResult';

const Survey = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { teamBuildingUuid } = useParams();
  const { isLoading, data: totalInfoForSurvey } =
    useGetTotalInfoForSurvey(teamBuildingUuid);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isLoading) return 'loading...';
  if (!teamBuildingUuid || !totalInfoForSurvey) return <NotFound />;
  return !isSubmitted ? (
    <SurveyForm
      teamBuildingUuid={teamBuildingUuid}
      onAfterSubmit={handleSubmit}
    />
  ) : (
    <SurveyResult />
  );
};

export default Survey;
