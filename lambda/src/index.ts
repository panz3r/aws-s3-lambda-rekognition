import { Rekognition, S3 } from 'aws-sdk';
import { S3Handler } from 'aws-lambda';

const RekognitionClient = new Rekognition();
const S3Client = new S3();

interface Dictionary<T> {
  [key: string]: T;
}

const handler: S3Handler = async (event, context, callback) => {
  const s3Record = event.Records[0].s3;
  if (!s3Record) {
    // Record not found!
    return callback();
  }

  try {
    const targetBucket: S3.BucketName = s3Record.bucket.name;
    const targetObjectKey: S3.ObjectKey = s3Record.object.key;

    const sourceObj = await S3Client.headObject({
      Bucket: targetBucket,
      Key: targetObjectKey,
    }).promise();

    // console.log('sourceObj', sourceObj);

    if (
      !!sourceObj.Metadata &&
      !!sourceObj.Metadata.processed &&
      sourceObj.Metadata.processed === 'true'
    ) {
      // Object has already been processed
      return callback();
    }

    const rekognitionOpts: Rekognition.DetectLabelsRequest = {
      Image: {
        S3Object: {
          Bucket: targetBucket,
          Name: targetObjectKey,
        },
      },
      MaxLabels: 10,
      MinConfidence: 75,
    };

    const rekRes = await RekognitionClient.detectLabels(
      rekognitionOpts,
    ).promise();

    // console.log('rekognition end:', rekRes);

    const labelPairs = (rekRes.Labels || []).reduce<Dictionary<string>>(
      (acc, label) => {
        if (!label.Name || !label.Confidence) {
          return acc;
        }

        return {
          ...acc,
          [label.Name]: label.Confidence.toFixed(0),
        };
      },
      {},
    );

    // console.log({ labelPairs });

    const copyObjOpts: S3.CopyObjectRequest = {
      ACL: 'public-read',
      Bucket: targetBucket,
      ContentType: sourceObj.ContentType,
      CopySource: `${targetBucket}/${targetObjectKey}`,
      Key: targetObjectKey,
      Metadata: {
        labels: JSON.stringify(labelPairs),
        processed: 'true',
      },
      MetadataDirective: 'REPLACE',
    };

    await S3Client.copyObject(copyObjOpts).promise();

    callback();
  } catch (err) {
    callback(err);
  }
};

export { handler };
