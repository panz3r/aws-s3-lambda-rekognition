import React from 'react';
import { Box } from 'rebass';
import { Tag } from '@blueprintjs/core';

import { S3ListObject } from '../hooks';

interface IConfidenceTagProps {
  object: S3ListObject;
}

const getLabels = (object: S3ListObject) =>
  object && !!object.Metadata && !!object.Metadata.labels
    ? Object.entries<number>(JSON.parse(object.Metadata.labels))
    : [];

const getIntentByConfidence = (confidence: number) => {
  if (confidence > 90) return 'success';
  if (confidence > 80) return 'warning';
  return 'danger';
};

const TagsList = ({ object }: IConfidenceTagProps) => {
  return (
    <Box>
      {getLabels(object).map(([label, confidence]) => (
        <Tag
          key={label}
          intent={getIntentByConfidence(confidence)}
          style={{ marginLeft: 5, marginTop: 5 }}
        >
          {label}: {confidence}%
        </Tag>
      ))}
    </Box>
  );
};

export default React.memo(TagsList);
