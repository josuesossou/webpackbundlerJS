// Load the required clients and packages
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

/*** Initialize the Amazon Cognito credentials provider and provides and s3 object to the window 
 * IAM Credentials must be an object in this format:
 * {
 *  accessKeyId: 'YOUR_ACCESS_KEY_HERE',
 *  secretAccessKey: 'YOUR_SECRET_KEY_HERE',
 *  expiration: 'OPTIONAL',
 *  sessionToken: 'OPTIONAL'
 * }
 * make sure not to make your keys viewable by the public.
 * If withPoolId is set to true, you must provide a poolID, no need for IAM credentials
 */
const initialize = (region, bucketName, {iamCredentials={}, withPoolId=false, poolID='',} = {}) => {
  if (!region) return
  if (withPoolId && poolID === '') return
  if (!withPoolId && !iamCredentials) return
  
  let s3 = null
  if (withPoolId) {
    s3 = new S3Client({
      region,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region }),
        identityPoolId: poolID,
      }),
    })
  } else {
    s3 = new S3Client({
      region,
      credentials: iamCredentials,
    })
  }

  window.s3 = s3
  window.bucketName = bucketName
}

window.aws_init = initialize
window.isAwsInit = false
window.PutObjectCommand = PutObjectCommand, 
window.ListObjectsCommand = ListObjectsCommand, 
window.DeleteObjectCommand = DeleteObjectCommand, 
window.DeleteObjectsCommand = DeleteObjectsCommand