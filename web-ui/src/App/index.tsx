import React, { useState, useCallback, useEffect } from 'react';
import { Flex } from 'rebass';

import './index.css';

import ImagesList from './components/ImagesList';
import UploadForm from './components/UploadForm';
import { useS3 } from './hooks';

const App: React.FC = () => {
  const { loading, objects, uploading, putObject, getObjects } = useS3();

  const [fileToUpload, setFileToUpload] = useState<File | null>();
  const onFileSelected = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (evt.target.files && evt.target.files.length > 0) {
        setFileToUpload(evt.target.files[0]);
      }
    },
    [setFileToUpload],
  );

  const onUploadToS3 = useCallback(() => {
    if (fileToUpload) {
      putObject(fileToUpload)
        .then(() => {
          setFileToUpload(null);
        })
        .catch(err => {
          alert('There was an error uploading your photo: ' + err.message);
        });
    }
  }, [fileToUpload, putObject]);

  useEffect(() => {
    getObjects();
  }, [getObjects]);

  return (
    <Flex flexDirection="column" px={3}>
      <UploadForm
        fileToUpload={fileToUpload}
        onFileSelected={onFileSelected}
        onUploadToS3={onUploadToS3}
        uploading={uploading}
      />

      <h1>Uploaded files</h1>
      <ImagesList loading={loading} objects={objects} />
    </Flex>
  );
};

export default App;
