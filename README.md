<p align="left"><image src="https://raw.githubusercontent.com/leoafarias/neardb/master/logo.png" height="100px" width="100px"/></p>

NearDB is a simple database that leverages cloud infrastructure like document storage and CDN to deliver an inexpensive unbelievably scalable document database optimized for reads and perfect for edge applications.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9edcdbf53d47468e9917676d80277188)](https://www.codacy.com/app/leo/neardb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=leoafarias/neardb&amp;utm_campaign=Badge_Grade) [![Build Status](https://travis-ci.org/leoafarias/neardb.svg?branch=master)](https://travis-ci.org/leoafarias/neardb) [![Coverage Status](https://coveralls.io/repos/github/leoafarias/neardb/badge.svg?branch=master)](https://coveralls.io/github/leoafarias/neardb?branch=master)

## Motivation

While working on building edge applications for higher performance and lower latency there is a need store persistent data also on edge.

Distributed database solutions but they are very involved and costly while having a lower global footprint than a CDN.

Leverage ubiquitous and mature infrastructure like cloud storage and CDNs to deliver a persistent, performance, and inexpensive db solution from the edge.

### Use with Edge Apps/Functions
*   [Zeit Now](https://zeit.co/now) - Global Serverless Deployments
*   [Cloudflare Workers](https://www.cloudflare.com/products/cloudflare-workers/) - Serverless applications on Cloudflare's global network
*   [Lambda@Edge](https://aws.amazon.com/lambda/edge/) - Run Lambda functions on CloudFront
*   [Fly.io](https://fly.io) - Javascript at the edge

#### Works with the following for database storage
*   [AWS S3](https://aws.amazon.com/s3/)
*   [Google Cloud Storage](https://www.notion.so/Google-Cloud-Storage-02b21bb5b9e643c39f6845b873f19ef4)
*   [Digital Ocean Spaces](https://www.notion.so/Digital-Ocean-Spaces-64de88aa20e24af3b48d40b611ebf102)
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

### Documentation & Guides
See [NearDB.org](https://www.notion.so/NearDB-0d5c6e1b4b344c9cbb77c1ffa08a96ed)

### TypeDoc
See the [documentation generated from TypeDoc](https://leoafarias.github.io/neardb/).

## Contributing
Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
