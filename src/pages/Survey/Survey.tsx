import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { useGetTotalInfoForSurvey } from '@/apis/survey/queries';
import Spinner from '@/components/Spinner';
import { SurveyFormResult } from '@/types';

import NotFound from '../NotFound';
import { SurveyForm } from './SurveyForm';
import { SurveyNotAvailable } from './SurveyNotAvailable';
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

  if (isLoading) return <Spinner />;
  if (!teamBuildingUuid || !totalInfoForSurvey) return <NotFound />;
  // FIXME:
  // @ts-expect-error Round 타입에 START를 아직 추가하지 않아서 ts 에러가 발생해서 일단 막음
  if (totalInfoForSurvey.teamBuildingInfo.roundStatus !== 'START')
    return <SurveyNotAvailable />;
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
