import { useState } from 'react';

import { SurveyForm } from './SurveyForm';
import { SurveyResult } from './SurveyResult';

const Survey = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return !isSubmitted ? (
    <SurveyForm onAfterSubmit={handleSubmit} />
  ) : (
    <SurveyResult />
  );
};

export default Survey;
