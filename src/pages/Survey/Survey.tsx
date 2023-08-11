import { useState } from 'react';

import { SurveyForm } from './SurveyForm';
import { SurveyResult } from './SurveyResult';

const Survey = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // @todo: url에서 room-id로 방정보를 가져온 뒤 방이 존재하지 않으면 NotFound를 띄우기
  return !isSubmitted ? (
    <SurveyForm onAfterSubmit={handleSubmit} />
  ) : (
    <SurveyResult />
  );
};

export default Survey;
