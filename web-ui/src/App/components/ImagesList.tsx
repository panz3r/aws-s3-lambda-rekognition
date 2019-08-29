import React from 'react';
import { Box } from 'rebass';
import { Spinner } from '@blueprintjs/core';

import { S3ListObject } from '../hooks';

import ImageCard from './ImageCard';

interface IImagesListProps {
  loading: boolean;
  objects: S3ListObject[];
}

const ImagesList: React.FC<IImagesListProps> = ({ loading, objects }) => {
  if (loading) {
    return <Spinner size={50} />;
  }

  return (
    <Box>
      {objects.map(s3Object => (
        <ImageCard object={s3Object} />
      ))}
    </Box>
  );
};

export default React.memo(ImagesList);
