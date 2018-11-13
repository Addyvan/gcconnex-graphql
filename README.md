## Installation

Note: This repo is very much so in development. 

To install run:

`npm install`

`node index`

A `creds.js` file also needs to be in the root directory for things to run.

Currently, the API can only be developed using the GCconnex dev database at 140 O'Connor which requries a local connection.

### Making queries

Currently, this is the most complex query you can make. Nesting is currently being developed/optimized; however, deeply nesting anything will greatly hinder performance. A cap on how deeply nested queries can be will probably be implemented soon.

```
{
  users {
    guid
    name
    colleagues {
      guid
      name
    }
  }
}
```
