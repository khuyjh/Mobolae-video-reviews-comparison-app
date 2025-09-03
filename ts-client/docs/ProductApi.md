# ProductApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createProduct**](#createproduct) | **POST** /{teamId}/products | |
|[**deleteProduct**](#deleteproduct) | **DELETE** /{teamId}/products/{productId} | |
|[**favorite**](#favorite) | **POST** /{teamId}/products/{productId}/favorite | |
|[**listProduct**](#listproduct) | **GET** /{teamId}/products | |
|[**listReviews**](#listreviews) | **GET** /{teamId}/products/{productId}/reviews | |
|[**retrieveProduct**](#retrieveproduct) | **GET** /{teamId}/products/{productId} | |
|[**unfavorite**](#unfavorite) | **DELETE** /{teamId}/products/{productId}/favorite | |
|[**updateProduct**](#updateproduct) | **PATCH** /{teamId}/products/{productId} | |

# **createProduct**
> ProductDetailType createProduct(createProductRequestBody)

상품 생성

### Example

```typescript
import {
    ProductApi,
    Configuration,
    CreateProductRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let teamId: string; // (default to undefined)
let createProductRequestBody: CreateProductRequestBody; //

const { status, data } = await apiInstance.createProduct(
    teamId,
    createProductRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProductRequestBody** | **CreateProductRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**ProductDetailType**

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

# **deleteProduct**
> DeleteProduct200Response deleteProduct()

상품 삭제

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let productId: number; // (default to undefined)
let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteProduct(
    productId,
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**number**] |  | defaults to undefined|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**DeleteProduct200Response**

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

# **favorite**
> ProductDetailType favorite()

상품 찜하기

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let teamId: string; // (default to undefined)
let productId: number; //찜할 상품 ID (default to undefined)

const { status, data } = await apiInstance.favorite(
    teamId,
    productId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|
| **productId** | [**number**] | 찜할 상품 ID | defaults to undefined|


### Return type

**ProductDetailType**

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

# **listProduct**
> CursorBasedPaginationResponseProductListType listProduct()

상품 목록 조회

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let teamId: string; //팀 ID (default to undefined)
let keyword: string; //상품명 검색 키워드 (optional) (default to undefined)
let category: number; //카테고리 ID (optional) (default to undefined)
let order: 'recent' | 'rating' | 'reviewCount'; // (optional) (default to undefined)
let cursor: number; //다음 페이지를 위한 커서 (optional) (default to undefined)

const { status, data } = await apiInstance.listProduct(
    teamId,
    keyword,
    category,
    order,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] | 팀 ID | defaults to undefined|
| **keyword** | [**string**] | 상품명 검색 키워드 | (optional) defaults to undefined|
| **category** | [**number**] | 카테고리 ID | (optional) defaults to undefined|
| **order** | [**&#39;recent&#39; | &#39;rating&#39; | &#39;reviewCount&#39;**]**Array<&#39;recent&#39; &#124; &#39;rating&#39; &#124; &#39;reviewCount&#39;>** |  | (optional) defaults to undefined|
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

# **listReviews**
> CursorBasedPaginationResponseReview listReviews()

상품 리뷰 목록 조회

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let productId: number; // (default to undefined)
let teamId: string; // (default to undefined)
let order: 'recent' | 'ratingDesc' | 'ratingAsc' | 'likeCount'; //정렬 순서 (optional) (default to undefined)
let cursor: number; //다음 페이지를 위한 커서 (optional) (default to undefined)

const { status, data } = await apiInstance.listReviews(
    productId,
    teamId,
    order,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**number**] |  | defaults to undefined|
| **teamId** | [**string**] |  | defaults to undefined|
| **order** | [**&#39;recent&#39; | &#39;ratingDesc&#39; | &#39;ratingAsc&#39; | &#39;likeCount&#39;**]**Array<&#39;recent&#39; &#124; &#39;ratingDesc&#39; &#124; &#39;ratingAsc&#39; &#124; &#39;likeCount&#39;>** | 정렬 순서 | (optional) defaults to undefined|
| **cursor** | [**number**] | 다음 페이지를 위한 커서 | (optional) defaults to undefined|


### Return type

**CursorBasedPaginationResponseReview**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |
|**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **retrieveProduct**
> ProductDetailType retrieveProduct()

상품 상세 조회

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let productId: number; // (default to undefined)
let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.retrieveProduct(
    productId,
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**number**] |  | defaults to undefined|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**ProductDetailType**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |
|**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unfavorite**
> ProductDetailType unfavorite()

상품 찜하기 취소

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let teamId: string; // (default to undefined)
let productId: number; //찜할 상품 ID (default to undefined)

const { status, data } = await apiInstance.unfavorite(
    teamId,
    productId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|
| **productId** | [**number**] | 찜할 상품 ID | defaults to undefined|


### Return type

**ProductDetailType**

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

# **updateProduct**
> ProductDetailType updateProduct(updateProductRequestBody)

상품 수정

### Example

```typescript
import {
    ProductApi,
    Configuration,
    UpdateProductRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let productId: number; // (default to undefined)
let teamId: string; // (default to undefined)
let updateProductRequestBody: UpdateProductRequestBody; //

const { status, data } = await apiInstance.updateProduct(
    productId,
    teamId,
    updateProductRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProductRequestBody** | **UpdateProductRequestBody**|  | |
| **productId** | [**number**] |  | defaults to undefined|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**ProductDetailType**

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

