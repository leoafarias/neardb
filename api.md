# API

### References

You are able to store the reference of a collection or document, and use the reference when interacting with them.

```typescript
const statesRef = nearDB.collection('states');

const nyRef = nearDB.collection('states').doc('ny')
```

### Add a Document

Using _set_ for document creation allows you to set the document id:

```typescript
nearDB.collection('states').doc('ny').set({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City'
})
```

By calling _add_ on the collection, a document id is auto-generated:

```typescript
nearDB.collection('states').add({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City'
})
```

### Update a Document

By using _set_, if the document does not exist, NearDB will create it. If it does exist, `set` will overwrite the whole document.

```typescript
nearDB.collection('states').doc('ny').set({
    name: 'New York',
    population: 19849399,
    largestCity: 'New York City',
    eastCoast: true
})
```

If you wish to update fields within a document without overwriting all the data, you should use _update_:

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

By using _delete_, the whole document will be deleted from the bucket:

```typescript
nearDB.collection('states').doc('ny').delete()
```

### Get a Document

You can get the contents of a single document by using _get_:

```typescript
nearDB.collection('states').doc('ny').get()
```

_get_ takes a few options to specify where you want to get the data from. By default, _get_ will try to retrieve the document as follows:

1. Get local data if it exists and has not expired
2. If CDN is configured, get from there
3. If there is no local cache and CDN is not configured, get from the origin. 

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

## 

