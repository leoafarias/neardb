<p align="center"><image src="https://raw.githubusercontent.com/leoafarias/neardb/master/logo.png" height="200px" width="200px"/></p>

>NearDB is a simple database that leverages cloud infrastructure like document storage and CDN to deliver an inexpensive unbelievably scalable document database optimized for reads and perfect for edge applications.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9edcdbf53d47468e9917676d80277188)](https://www.codacy.com/app/leo/neardb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=leoafarias/neardb&amp;utm_campaign=Badge_Grade) [![Build Status](https://travis-ci.org/leoafarias/neardb.svg?branch=master)](https://travis-ci.org/leoafarias/neardb) [![Coverage Status](https://coveralls.io/repos/github/leoafarias/neardb/badge.svg?branch=master)](https://coveralls.io/github/leoafarias/neardb?branch=master)

## Motivation

While working on building edge applications for higher performance and lower latency there is a need store persistent data also on edge.

There are multiple distributed database solutions but they are very involved and costly while having a much lower global footprint than a CDN.

The idea came up to leverage ubiquitous and mature infrastructure like cloud storage and CDNs to deliver a persistent data solution from the edge.

### Use with Edge Apps/Functions
*   [Zeit Now](https://zeit.co/now) - Global Serverless Deployments
*   [Cloudflare Workers](https://www.cloudflare.com/products/cloudflare-workers/) - Serverless applications on Cloudflare's global network
*   [Lambda@Edge](https://aws.amazon.com/lambda/edge/) - Run Lambda functions on CloudFront
*   [Fly.io](https://fly.io) - Javascript at the edge

#### Works with the following for database storage
*   [AWS S3](https://aws.amazon.com/s3/)
*   [Google Cloud Storage](https://cloud.google.com/storage/)
*   [Digital Ocean Spaces](https://www.digitalocean.com/products/spaces/)
*   [Minio](https://www.minio.io/)
*   any S3 API compatible storage service

#### Client-side compatibility
Keep in mind while using this for client-side that ACL is done on the bucket/CDN level. It was designed for edge server use so client implementation can be a bit tricky. Open an issue with your specific case, I would love to hear how you plan on using it.
*   Browser
*   React Native

#### Who is this for

This is perfect for persistent data that is read frequently and  needs to be avaialble on the edge application to deliver dynamic data while keeping the costs low. Some examples of the best uses are:
*   Key-value
*   Configuration
*   Cached data

#### Probably not for you if

*   You plan on using this as your primary database for an app that has complex data needs. 
*   You need transactions. (I have some ideas on how to accomplish this, but its currently not implemented.)
*   Do many writes/sec in the same document. Reads are incredibly efficient, fast and inexpensive; however, writes are always at the origin.

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
| Property          | Description                                                                              | Type   |
|-------------------|------------------------------------------------------------------------------------------|--------|
| database          | Bucket name that is used to store the data on object storage                             | string |
| cdn               | CDN configurations for get requests.                                                     | object |
| - url             | Http endpoint of the CDN that has the bucket as the origin                               | string |
| - headers         | Configure headers needed for your CDN here. Cache rules | object |
| cacheExpiration   | Number in milliseconds which you would like to keep the data cached locally              | number |
| storage           | Object storage configuration                                                             | object |
| - endpoint        | Endpoint to object storage                                                               | string |
| - useSSL          | Set this if you are using a secure connection                                            | bool   |
| - accessKeyId     | Access Key to object storage service                                                     | string |
| - secretAccessKey | Secret Key to object storage service                                                     | string |
| signatureVersion  | Identifies the version of signature that you want to support for authenticated requests  | string |
| S3ForcePathStyle  | Whether to force path style URLs for S3 objects.                                         | bool   |
| indices           | Create a collection index when document is stored (experimental)                         | bool   |

### Inspiration
The design of NearDBs API is heavily inspired by [Firestore](https://firebase.google.com/docs/firestore/).

### References
You are able to store the reference of a collection or document, and use the reference when interacting with them.
```typescript
const statesRef = nearDB.collection('states');

const nyRef = nearDB.collection('states').doc('ny')
```
### Add a Document
Using *set* for document creation  allows you to set the document id:
```typescript

nearDB.collection('states').doc('ny').set({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City'
})
```
By calling *add* on the collection, a document id is auto-generated:
```typescript
nearDB.collection('states').add({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City'
})
```
### Update a Document
By using *set*, if the document does not exist, NearDB will create it. If it does exist, `set` will overwrite the whole document.
```typescript
nearDB.collection('states').doc('ny').set({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City',
    eastCoast: true
})
```
If you wish to update fields within a document without overwriting all the data, you should use *update*:
```typescript
nearDB.collection('states').doc('ny').update({
    eastCoast: true
})
```

To delete a value without overwriting the whole document, use the following helper constant:
```typescript
nearDB.collection('states').doc('ny').update({
    eastCoast: NearDB.field.deleteValue
})
```

### Delete a Document
By using *delete*, the whole document will be deleted from the bucket:
```typescript
nearDB.collection('states').doc('ny').delete()
```

### Get a Document
You can get the contents of a single document by using *get*:
```typescript
nearDB.collection('states').doc('ny').get()
```

*get* takes a few options to specify where you want to get the data from. By default, *get* will try to retrieve the document as follows:

1.  Get local data if it exists and has not expired
2.  If CDN is configured, get from there
3.  If there is no local cache and CDN is not configured, get from the origin. 

```typescript
const options = {
    // Gets data from origin even if 
    // there is local cache and a cdn configured
    source: 'origin' 

    // Gets data from edge even if 
    // there is local cache and a cdn configured
    // source: 'edge' 
}
nearDB.collection('states').doc('ny').get(options)
```
## Running the tests

```bash
npm run test
```

### Documentation
See the [documentation generated from TypeDoc](https://leoafarias.github.io/neardb/).

## Dependencies

*   [aws sdk](https://github.com/aws/aws-sdk-js) - AWS SDK for JavaScript in the browser and node.js
*   [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
