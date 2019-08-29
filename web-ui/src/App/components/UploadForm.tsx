import React from 'react';
import { Box } from 'rebass';
import { Button, ControlGroup, FileInput } from '@blueprintjs/core';

interface IUploadFormProps {
  fileToUpload?: File | null;
  onFileSelected: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadToS3: () => void;
  uploading: boolean;
}

const UploadForm: React.FC<IUploadFormProps> = ({
  fileToUpload,
  onFileSelected,
  onUploadToS3,
  uploading,
}) => {
  return (
    <Box p={3}>
      <ControlGroup>
        <FileInput
          hasSelection={!!fileToUpload}
          id="file-input"
          inputProps={{
            accept: 'image/*',
          }}
          onInputChange={onFileSelected}
          text={fileToUpload ? fileToUpload.name : 'Choose file...'}
          disabled={uploading}
        />
        <Button
          disabled={!fileToUpload || uploading}
          icon="upload"
          onClick={onUploadToS3}
        >
          Upload
        </Button>
      </ControlGroup>
    </Box>
  );
};

export default React.memo(UploadForm);
