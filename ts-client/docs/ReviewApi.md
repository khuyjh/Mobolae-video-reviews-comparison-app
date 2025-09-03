# ReviewApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createReview**](#createreview) | **POST** /{teamId}/reviews | |
|[**deleteReview**](#deletereview) | **DELETE** /{teamId}/reviews/{reviewId} | |
|[**likeReview**](#likereview) | **POST** /{teamId}/reviews/{reviewId}/like | |
|[**unlikeReview**](#unlikereview) | **DELETE** /{teamId}/reviews/{reviewId}/like | |
|[**updateReview**](#updatereview) | **PATCH** /{teamId}/reviews/{reviewId} | |

# **createReview**
> Review createReview(createReviewRequestBody)

리뷰 생성

### Example

```typescript
import {
    ReviewApi,
    Configuration,
    CreateReviewRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewApi(configuration);

let teamId: string; // (default to undefined)
let createReviewRequestBody: CreateReviewRequestBody; //

const { status, data } = await apiInstance.createReview(
    teamId,
    createReviewRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createReviewRequestBody** | **CreateReviewRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**Review**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteReview**
> DeleteReview200Response deleteReview()

리뷰 삭제

### Example

```typescript
import {
    ReviewApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewApi(configuration);

let reviewId: number; // (default to undefined)
let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteReview(
    reviewId,
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reviewId** | [**number**] |  | defaults to undefined|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**DeleteReview200Response**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **likeReview**
> Review likeReview()

리뷰 좋아요

### Example

```typescript
import {
    ReviewApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewApi(configuration);

let teamId: string; // (default to undefined)
let reviewId: number; // (default to undefined)

const { status, data } = await apiInstance.likeReview(
    teamId,
    reviewId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|
| **reviewId** | [**number**] |  | defaults to undefined|


### Return type

**Review**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unlikeReview**
> Review unlikeReview()

리뷰 좋아요 취소

### Example

```typescript
import {
    ReviewApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewApi(configuration);

let teamId: string; // (default to undefined)
let reviewId: number; // (default to undefined)

const { status, data } = await apiInstance.unlikeReview(
    teamId,
    reviewId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|
| **reviewId** | [**number**] |  | defaults to undefined|


### Return type

**Review**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateReview**
> Review updateReview(updateReviewRequestBody)

리뷰 수정 <br/> 이미지를 수정할 때, 기존 이미지를 유지하려면 id를, 새로운 이미지를 추가하려면 source를 넣어주세요. <br /> 요청에 포함되지 않는 기존 이미지는 삭제됩니다.

### Example

```typescript
import {
    ReviewApi,
    Configuration,
    UpdateReviewRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new ReviewApi(configuration);

let reviewId: number; // (default to undefined)
let teamId: string; // (default to undefined)
let updateReviewRequestBody: UpdateReviewRequestBody; //

const { status, data } = await apiInstance.updateReview(
    reviewId,
    teamId,
    updateReviewRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateReviewRequestBody** | **UpdateReviewRequestBody**|  | |
| **reviewId** | [**number**] |  | defaults to undefined|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**Review**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

