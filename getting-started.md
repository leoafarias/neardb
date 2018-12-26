# Getting Started

### Installing

```bash
npm install neardb
# or
yarn add neardb
```

### Usage

```typescript
import Neardb from 'neardb'

const config = {
    database: 'bucketName'
    //...
}

const neardb = NearDB.database(config);
```

#### Config Options

| Property | Description | Type |
| :--- | :--- | :--- |
| database | Bucket name that is used to store the data on object storage | string |
| cdn | CDN configurations for get requests. | object |
| - url | Http endpoint of the CDN that has the bucket as the origin | string |
| - headers | Configure headers needed for your CDN here. Cache rules | object |
| cacheExpiration | Number in milliseconds which you would like to keep the data cached locally | number |
| storage | Object storage configuration | object |
| - endpoint | Endpoint to object storage | string |
| - useSSL | Set this if you are using a secure connection | bool |
| - accessKeyId | Access Key to object storage service | string |
| - secretAccessKey | Secret Key to object storage service | string |
| signatureVersion | Identifies the version of signature that you want to support for authenticated requests | string |
| S3ForcePathStyle | Whether to force path style URLs for S3 objects. | bool |
| indices | Create a collection index when document is stored \(experimental\) | bool |

### 

