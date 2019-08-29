import { useCallback, useEffect, useState } from 'react';
import aws from 'aws-sdk';

export const useTheme = (): [(newTheme: string) => void, string] => {
  const [theme, setTheme] = useState(
    localStorage.getItem('app-theme') || 'light',
  );

  useEffect(() => {
    // Update the data-theme attribute of our html tag
    document.getElementsByTagName('HTML')[0].setAttribute('data-theme', theme);

    return () => {
      // Update the data-theme attribute of our html tag
      document.getElementsByTagName('HTML')[0].removeAttribute('data-theme');
    };
  }, [theme]);

  const changeTheme = useCallback(
    newTheme => {
      localStorage.setItem('app-theme', newTheme);
      setTheme(newTheme);
    },
    [setTheme],
  );

  return [changeTheme, theme];
};

const awsRegion: string = process.env.REACT_APP_AWS_REGION;
const bucketName: string = process.env.REACT_APP_AWS_BUCKET;
const IdentityPoolId: string = process.env.REACT_APP_AWS_COGNITO_POOL_ID;

aws.config.update({
  region: awsRegion,
  // Initialize the Amazon Cognito credentials provider
  credentials: new aws.CognitoIdentityCredentials({
    IdentityPoolId,
  }),
});

const options = {
  ACL: 'public-read',
  Bucket: bucketName,
  region: awsRegion,
};

const s3 = new aws.S3(options);

export type S3ListObject = aws.S3.Object & {
  Metadata?: aws.S3.Metadata;
  Url?: string;
};

export const useS3Objects = (
  includeHead: boolean,
): [boolean, S3ListObject[]] => {
  const [loading, setLoading] = useState(false);
  const [S3Objects, setS3Objects] = useState<S3ListObject[]>([]);

  useEffect(() => {
    setLoading(true);

    s3ListObjects(includeHead)
      .then(data => setS3Objects(data))
      .catch(err => {
        console.log('Error fetching objects');
        setS3Objects([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [includeHead, setLoading, setS3Objects]);

  return [loading, S3Objects];
};

type UploadFn = (file: File) => void;

export const useS3Uploader = (): [UploadFn, boolean] => {
  const [uploading, setUploading] = useState(false);

  const uploadToS3 = useCallback(
    (file: File) => {
      const fileName = file.name;
      setUploading(true);

      s3.upload(
        {
          ACL: 'public-read',
          Body: file,
          Bucket: bucketName,
          Key: encodeURIComponent(fileName),
        },
        function(err, data) {
          setUploading(false);

          if (err) {
            return alert(
              'There was an error uploading your photo: ' + err.message,
            );
          }

          alert('Successfully uploaded photo.');
        },
      );
    },
    [setUploading],
  );

  return [uploadToS3, uploading];
};

export const useS3 = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [objects, setS3Objects] = useState<S3ListObject[]>([]);

  const getObjects = useCallback(() => {
    setLoading(true);

    s3ListObjects()
      .then(data => setS3Objects(data))
      .catch(err => {
        console.log('Error fetching objects');
        setS3Objects([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setS3Objects]);

  const putObject = useCallback(
    (file: File) => {
      const fileName = file.name;
      setUploading(true);

      return s3
        .upload({
          ACL: 'public-read',
          Body: file,
          Bucket: bucketName,
          Key: encodeURIComponent(fileName),
        })
        .promise()
        .then(() => {
          setUploading(false);

          setTimeout(() => {
            setLoading(true);
            getObjects();
          }, 1000);
        })
        .catch(err => {
          setUploading(false);
          throw err;
        });
    },
    [getObjects, setUploading],
  );

  return {
    loading,
    objects,
    uploading,
    getObjects,
    putObject,
  };
};

//recursive function to list s3 objects
async function s3ListObjects(
  includeHead: boolean = true,
  s3DataContents: S3ListObject[] = [],
  params: aws.S3.ListObjectsRequest = { Bucket: bucketName },
): Promise<S3ListObject[]> {
  try {
    const data = await s3.listObjects(params).promise();
    const contents = data.Contents || [];
    if (includeHead) {
      for (let i = 0; i < contents.length; i++) {
        let element: S3ListObject = contents[i];
        const fileObject = !!element.Key
          ? await getS3ObjectHead(element.Key)
          : {};
        element.Metadata = fileObject.Metadata;
        element.Url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${element.Key}`;
      }
    }
    s3DataContents = s3DataContents.concat(contents);
    if (data.IsTruncated) {
      // Set Marker to last returned key
      params.Marker = contents[contents.length - 1].Key;
      return await s3ListObjects(includeHead, s3DataContents, params);
    } else {
      return s3DataContents;
    }
  } catch (error) {
    throw error;
  }
}

function getS3ObjectHead(filename: string): Promise<aws.S3.HeadObjectOutput> {
  const params: aws.S3.HeadObjectRequest = {
    Bucket: bucketName,
    Key: filename,
  };
  return s3.headObject(params).promise();
}
