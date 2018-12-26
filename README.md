---
description: >-
  NearDB is a simple database that leverages cloud infrastructure like document
  storage and CDN to deliver an inexpensive unbelievably scalable document
  database optimized for reads and perfect for edge
---

# What is NearDB

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9edcdbf53d47468e9917676d80277188)](https://www.codacy.com/app/leo/neardb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=leoafarias/neardb&amp;utm_campaign=Badge_Grade) [![Build Status](https://travis-ci.org/leoafarias/neardb.svg?branch=master)](https://travis-ci.org/leoafarias/neardb) [![Coverage Status](https://coveralls.io/repos/github/leoafarias/neardb/badge.svg?branch=master)](https://coveralls.io/github/leoafarias/neardb?branch=master)

## Motivation

While working on building edge applications for higher performance and lower latency there is a need store persistent data also on edge.

There are multiple distributed database solutions but they are very involved and costly while having a much lower global footprint than a CDN.

The idea came up to leverage ubiquitous and mature infrastructure like cloud storage and CDNs to deliver a persistent data solution from the edge.

### Use with Edge Apps/Functions

* [Zeit Now](https://zeit.co/now) - Global Serverless Deployments
* [Cloudflare Workers](https://www.cloudflare.com/products/cloudflare-workers/) - Serverless applications on Cloudflare's global network
* [Lambda@Edge](https://aws.amazon.com/lambda/edge/) - Run Lambda functions on CloudFront
* [Fly.io](https://fly.io) - Javascript at the edge

#### Works with the following for database storage

* [AWS S3](https://aws.amazon.com/s3/)
* [Google Cloud Storage](https://cloud.google.com/storage/)
* [Digital Ocean Spaces](https://www.digitalocean.com/products/spaces/)
* [Minio](https://www.minio.io/)
* any S3 API compatible storage service

#### Who is this for

This is perfect for persistent data that is read frequently and needs to be avaialble on the edge application to deliver dynamic data while keeping the costs low. Some examples of the best uses are:

* Key-value
* Configuration
* Cached data

#### Probably not for you if

* You plan on using this as your primary database for an app that has complex data needs. 
* You need transactions. \(I have some ideas on how to accomplish this, but its currently not implemented.\)
* Do many writes/sec in the same document. Reads are incredibly efficient, fast and inexpensive; however, writes are always at the origin.

### Inspiration

The design of NearDBs API is heavily inspired by [Firestore](https://firebase.google.com/docs/firestore/).

## Running the tests

```bash
npm run test
```

### Documentation

See the [documentation generated from TypeDoc](https://leoafarias.github.io/neardb/).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/leoafarias/neardb/tree/7e9dd64e576316dadfdec2ad51bd7d054ed598c7/LICENSE/README.md) file for details

