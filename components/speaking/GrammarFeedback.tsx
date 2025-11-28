import React from "react";
import GenericFeedback from "./GenericFeedback";

interface GrammarFeedbackProps {
  data: {
    score: number;
    evaluation: {
      criteria: string;
      description: string;
    }[];
    errors: {
      original: string;
      suggested: string;
      explanation: string;
    }[];
    feedback: string;
  };
}

const GrammarFeedback: React.FC<GrammarFeedbackProps> = ({ data }) => {
  return <GenericFeedback data={data} />;
};

export default GrammarFeedback;
