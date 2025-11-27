import React from "react";
import GenericFeedback from "./GenericFeedback";

interface CriteriaDetail {
  name: string;
  score: string;
  feedback: string;
  errorSections?: Array<{
    title: string;
    errors: Array<{
      type: string;
      count: string;
    }>;
  }>;
}

interface GrammarFeedbackProps {
  data: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
  };
}

const GrammarFeedback: React.FC<GrammarFeedbackProps> = ({ data }) => {
  return <GenericFeedback data={data} />;
};

export default GrammarFeedback;
