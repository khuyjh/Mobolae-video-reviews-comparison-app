# UserApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**listUserCreatedProducts**](#listusercreatedproducts) | **GET** /{teamId}/users/{userId}/created-products | |
|[**listUserFavoriteProducts**](#listuserfavoriteproducts) | **GET** /{teamId}/users/{userId}/favorite-products | |
|[**listUserFollowees**](#listuserfollowees) | **GET** /{teamId}/users/{userId}/followees | |
|[**listUserFollowers**](#listuserfollowers) | **GET** /{teamId}/users/{userId}/followers | |
|[**listUserReviewedProducts**](#listuserreviewedproducts) | **GET** /{teamId}/users/{userId}/reviewed-products | |
|[**me**](#me) | **GET** /{teamId}/users/me | |
|[**updateMe**](#updateme) | **PATCH** /{teamId}/users/me | |
|[**userDetail**](#userdetail) | **GET** /{teamId}/users/{userId} | |
|[**userRanking**](#userranking) | **GET** /{teamId}/users/ranking | |

# **listUserCreatedProducts**
> CursorBasedPaginationResponseProductListType listUserCreatedProducts()

유저가 생성한 상품 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; //teamId에 대한 설명 (default to undefined)
let userId: number; // (default to undefined)
let cursor: number; //다음 페이지를 위한 커서 (optional) (default to undefined)

const { status, data } = await apiInstance.listUserCreatedProducts(
    teamId,
    userId,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] | teamId에 대한 설명 | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|
| **cursor** | [**number**] | 다음 페이지를 위한 커서 | (optional) defaults to undefined|


### Return type

**CursorBasedPaginationResponseProductListType**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listUserFavoriteProducts**
> CursorBasedPaginationResponseProductListType listUserFavoriteProducts()

유저가 찜한 상품 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; //teamId에 대한 설명 (default to undefined)
let userId: number; // (default to undefined)
let cursor: number; //다음 페이지를 위한 커서 (optional) (default to undefined)

const { status, data } = await apiInstance.listUserFavoriteProducts(
    teamId,
    userId,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] | teamId에 대한 설명 | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|
| **cursor** | [**number**] | 다음 페이지를 위한 커서 | (optional) defaults to undefined|


### Return type

**CursorBasedPaginationResponseProductListType**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listUserFollowees**
> CursorBasedPaginationResponseIdNumberFolloweeUser listUserFollowees()

유저가 팔로우한 유저 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; //teamId에 대한 설명 (default to undefined)
let userId: number; // (default to undefined)
let cursor: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.listUserFollowees(
    teamId,
    userId,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] | teamId에 대한 설명 | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|
| **cursor** | [**number**] |  | (optional) defaults to undefined|


### Return type

**CursorBasedPaginationResponseIdNumberFolloweeUser**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listUserFollowers**
> CursorBasedPaginationResponseIdNumberFollowerUser listUserFollowers()

유저를 팔로우한 유저 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; //teamId에 대한 설명 (default to undefined)
let userId: number; // (default to undefined)
let cursor: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.listUserFollowers(
    teamId,
    userId,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] | teamId에 대한 설명 | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|
| **cursor** | [**number**] |  | (optional) defaults to undefined|


### Return type

**CursorBasedPaginationResponseIdNumberFollowerUser**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listUserReviewedProducts**
> CursorBasedPaginationResponseProductListType listUserReviewedProducts()

유저가 리뷰한 상품 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; //teamId에 대한 설명 (default to undefined)
let userId: number; // (default to undefined)
let cursor: number; //다음 페이지를 위한 커서 (optional) (default to undefined)

const { status, data } = await apiInstance.listUserReviewedProducts(
    teamId,
    userId,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] | teamId에 대한 설명 | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|
| **cursor** | [**number**] | 다음 페이지를 위한 커서 | (optional) defaults to undefined|


### Return type

**CursorBasedPaginationResponseProductListType**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **me**
> UserDetail me()

내 정보 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.me(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**UserDetail**

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

# **updateMe**
> UpdateMe200Response updateMe(updateUserRequestBody)

내 정보 수정

### Example

```typescript
import {
    UserApi,
    Configuration,
    UpdateUserRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; // (default to undefined)
let updateUserRequestBody: UpdateUserRequestBody; //

const { status, data } = await apiInstance.updateMe(
    teamId,
    updateUserRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserRequestBody** | **UpdateUserRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**UpdateMe200Response**

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

# **userDetail**
> UserDetail userDetail()

유저 정보 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; // (default to undefined)
let userId: number; // (default to undefined)

const { status, data } = await apiInstance.userDetail(
    teamId,
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|


### Return type

**UserDetail**

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

# **userRanking**
> Array<UserRanking> userRanking()

유저 랭킹 조회

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.userRanking(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**Array<UserRanking>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

