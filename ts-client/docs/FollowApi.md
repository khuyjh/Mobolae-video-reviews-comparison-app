# FollowApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**follow**](#follow) | **POST** /{teamId}/follow | |
|[**unfollow**](#unfollow) | **DELETE** /{teamId}/follow | |

# **follow**
> UserDetail follow(followRequestBody)

유저 팔로우

### Example

```typescript
import {
    FollowApi,
    Configuration,
    FollowRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new FollowApi(configuration);

let teamId: string; // (default to undefined)
let followRequestBody: FollowRequestBody; //

const { status, data } = await apiInstance.follow(
    teamId,
    followRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **followRequestBody** | **FollowRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**UserDetail**

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

# **unfollow**
> UserDetail unfollow(followRequestBody)

유저 언팔로우

### Example

```typescript
import {
    FollowApi,
    Configuration,
    FollowRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new FollowApi(configuration);

let teamId: string; // (default to undefined)
let followRequestBody: FollowRequestBody; //

const { status, data } = await apiInstance.unfollow(
    teamId,
    followRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **followRequestBody** | **FollowRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**UserDetail**

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

