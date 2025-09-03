# UpdateReviewRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**images** | [**Array&lt;UpdateReviewRequestBodyImagesInner&gt;**](UpdateReviewRequestBodyImagesInner.md) | 기존 이미지를 유지하려면 id를, 새로운 이미지를 추가하려면 source를 넣어주세요. &lt;br /&gt; 요청에 포함되지 않는 기존 이미지는 삭제됩니다. | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**rating** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateReviewRequestBody } from './api';

const instance: UpdateReviewRequestBody = {
    images,
    content,
    rating,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
