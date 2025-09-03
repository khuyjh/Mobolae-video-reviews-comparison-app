# CreateReviewRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**productId** | **number** |  | [default to undefined]
**images** | **Array&lt;string&gt;** | 이미지 URL 입니다. 최대 3개까지 가능합니다. | [optional] [default to undefined]
**content** | **string** |  | [default to undefined]
**rating** | **number** |  | [default to undefined]

## Example

```typescript
import { CreateReviewRequestBody } from './api';

const instance: CreateReviewRequestBody = {
    productId,
    images,
    content,
    rating,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
