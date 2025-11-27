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

interface LexicalFeedbackProps {
  data: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
  };
}

const LexicalFeedback: React.FC<LexicalFeedbackProps> = ({ data }) => {
  return <GenericFeedback data={data} />;
};

export default LexicalFeedback;
