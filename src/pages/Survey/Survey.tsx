import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { useGetTotalInfoForSurvey } from '@/apis/survey/queries';
import { SurveyFormResult } from '@/types';

import NotFound from '../NotFound';
import { SurveyForm } from './SurveyForm';
import { SurveyResult } from './SurveyResult';

const Survey = () => {
  const [formResult, setFormResult] = useState<SurveyFormResult>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { teamBuildingUuid } = useParams();
  const { isLoading, data: totalInfoForSurvey } =
    useGetTotalInfoForSurvey(teamBuildingUuid);

  const handleSubmit = (result: SurveyFormResult) => {
    setIsSubmitted(true);
    setFormResult(result);
  };

  if (isLoading) return 'loading...';
  if (!teamBuildingUuid || !totalInfoForSurvey) return <NotFound />;
  return !isSubmitted ? (
    <SurveyForm
      teamBuildingUuid={teamBuildingUuid}
      onAfterSubmit={handleSubmit}
    />
  ) : (
    <SurveyResult formResult={formResult} />
  );
};

export default Survey;
