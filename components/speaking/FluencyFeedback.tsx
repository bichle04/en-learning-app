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

interface FluencyFeedbackProps {
  data: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
  };
}

const FluencyFeedback: React.FC<FluencyFeedbackProps> = ({ data }) => {
  return <GenericFeedback data={data} />;
};

export default FluencyFeedback;
