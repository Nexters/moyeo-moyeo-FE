import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { useGetTotalInfoForSurvey } from '@/apis/survey/queries';

import NotFound from '../NotFound';
import { SurveyForm } from './SurveyForm';
import { SurveyResult } from './SurveyResult';

const Survey = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { teamBuildingUuid } = useParams();
  const query = useGetTotalInfoForSurvey(teamBuildingUuid);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (!query.isFetched) return 'loading...';
  if (!teamBuildingUuid || !query.data) return <NotFound />;
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
