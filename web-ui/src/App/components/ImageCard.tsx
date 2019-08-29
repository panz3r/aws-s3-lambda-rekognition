import React from 'react';
import { Flex, Image } from 'rebass';
import { Card } from '@blueprintjs/core';

import { S3ListObject } from '../hooks';
import TagsList from './TagsList';

interface IImageCardProps {
  object: S3ListObject;
}

const ImageCard: React.FC<IImageCardProps> = ({ object }) => {
  return (
    <Card key={object.Key}>
      <Flex>
        <Image
          src={object.Url}
          sx={{
            width: 150,
            height: 150,
            borderRadius: 8,
          }}
        />
        <Flex flexDirection="column" alignItems="flex-start" px={3}>
          <h3>{object.Key}</h3>
          <TagsList object={object} />
        </Flex>
      </Flex>
    </Card>
  );
};

export default React.memo(ImageCard);
