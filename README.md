<p align="center"><image src="./logo.png" height="200px" width="200px"/></p>

>NearDB is a simple database that leverages cloud infrastructure like document storage and CDN to deliver an inexpensive unbelievably scalable document database optimized for reads and perfect for edge applications.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9edcdbf53d47468e9917676d80277188)](https://www.codacy.com/app/leo/neardb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=leoafarias/neardb&amp;utm_campaign=Badge_Grade) [![Build Status](https://travis-ci.org/leoafarias/neardb.svg?branch=master)](https://travis-ci.org/leoafarias/neardb) [![Coverage Status](https://coveralls.io/repos/github/leoafarias/neardb/badge.svg?branch=master)](https://coveralls.io/github/leoafarias/neardb?branch=master)

## Motivation

While working on building edge applications for higher performance and lower latency I found a need to store persistent data also on edge.

During research, I validated multiple distributed database solutions but found they were very involved and costly while not being able to provide a very high global footprint.

The idea came up to leverage ubiquitous and mature infrastructure like cloud storage and CDNs to deliver a persistent data solution from the edge.

#### Use with Edge Apps/Functions
* [Zeit Now](https://zeit.co/now) - Global Serverless Deployments
* [Cloudflare Workers](https://www.cloudflare.com/products/cloudflare-workers/) - Serverless applications on Cloudflare's global network
* [Lambda@Edge](https://aws.amazon.com/lambda/edge/) - Run Lambda functions on CloudFront
* [Fly.io](https://fly.io) - Javascript at the edge


#### Who is this for?

This is perfect for persistent data that is read frequently and  needs to be avaialble on the edge application to deliver very low while keeping the costs low. Some examples of the best uses are:
- Key-value
- Configuration
- Cached data

#### Probably not for you if...

- You plan on using this as your primary database for an app that has complex data needs. 
- You need transactions. (I have some ideas on how to accomplish this, but its currently not implemented.)
- Do many writes/sec in the same document. Reads are incredibly efficient, fast and inexpensive; however, writes are always in the origin.


### Installing

A step by step series of examples that tell you how to get a development env running


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
    // These options will change by the final release to provide more control
    // cdnEndpoint?: string
    // cacheExpiration?: number
    // options?: {
    //     endpoint: string
    //     useSSL?: boolean
    //     accessKeyId?: string
    //     secretAccessKey?: string
    //     signatureVersion?: string
    //     s3ForcePathStyle?: boolean
    // }
}

const neardb = NearDB.database(config);
```
### References
You are able to store the reference of a collection or document, and use the reference when interacting with them.
```typescript
const statesRef = nearDB.collection('states');

const nyRef = nearDB.collection('states').doc('ny')
```
### Add a Document
By using set for document creation  allows you to *set* the document id
```typescript

nearDB.collection('states').doc('ny').set({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City'
})
```
By calling *add* on the collection a document id is auto-generated
```typescript
nearDB.collection('states').add({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City'
})
```
### Update a Document
By using *set* if the document does not exist it will create it. If it does exist you can use set to overwrite the whole document.
```typescript
nearDB.collection('states').doc('ny').set({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City',
    eastCoast: true
})
```
If you wish to update fields within a document without overwriting all the data you should use *update*
```typescript
nearDB.collection('states').doc('ny').update({
    eastCoast: true
})
```

### Delete a Document
By using *set* if the document does not exist it will create it. If it does exist you can use set to overwrite the whole document.
```typescript
nearDB.collection('states').doc('ny').delete()
```

### Get a Document
You can get the content of a single document by using *get*
```typescript
nearDB.collection('states').doc('ny').get()
```

There a few options that you are able to pass on get depending where you want to get the data from.

By default *get* will try to retrieve the document the following way.
1.  Get local data if it exists and has not expired
2. If CDN is configured will get from there
3. If there is no local cache and CDN is not configured, it will get from the origin. 

There are a few options you are able to pass to force where you get the data from.
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

## Dependencies

* [aws sdk](https://github.com/aws/aws-sdk-js) - AWS SDK for JavaScript in the browser and node.js
* [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js

## Inspiration
The design of NearDBs API is heavily inspired by [Firestore](https://firebase.google.com/docs/firestore/).

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
