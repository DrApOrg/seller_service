import * as AWS from 'aws-sdk';

export class s3Service {
  AWS_S3_BUCKET = 'test-diego-apps';
  s3 = new AWS.S3({
    accessKeyId: 'AKIASMVSBF3EVAOZNUTO',
    secretAccessKey: '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',
  });

  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async deleteFile(fileName) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: fileName,
    };

    try {
      const deleteResponse = await this.s3.deleteObject(params).promise();
      return deleteResponse;
    } catch (e) {
      console.log(e);
    }
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
