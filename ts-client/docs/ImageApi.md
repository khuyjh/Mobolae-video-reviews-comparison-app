# ImageApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**imageUpload**](#imageupload) | **POST** /{teamId}/images/upload | |

# **imageUpload**
> ImageUpload200Response imageUpload()

이미지 업로드, 프로젝트에 저장하는 이미지들은 이 엔드포인트를 통해 업로드한 후 URL을 획득하여 사용합니다.

### Example

```typescript
import {
    ImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageApi(configuration);

let teamId: string; // (default to undefined)
let image: File; //이미지 파일, 최대 용량은 5MB입니다. (default to undefined)

const { status, data } = await apiInstance.imageUpload(
    teamId,
    image
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|
| **image** | [**File**] | 이미지 파일, 최대 용량은 5MB입니다. | defaults to undefined|


### Return type

**ImageUpload200Response**

### Authorization

[jwt](../README.md#jwt)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

