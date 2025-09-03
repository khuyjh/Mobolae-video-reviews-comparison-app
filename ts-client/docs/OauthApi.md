# OauthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**upsertOauthApp**](#upsertoauthapp) | **POST** /{teamId}/oauthApps | |

# **upsertOauthApp**
> OauthApp upsertOauthApp(upsertOauthAppRequestBody)

간편 로그인 App 등록/수정<br/> Google, Kakao 간편 로그인을 위한 App 을 등록하거나 수정합니다.<br/> 이미 등록된 앱이 있을 경우 덮어씌워집니다.  요청 데이터 중 appKey 는 각 서비스에서 발급받은 인증 키 입니다.<br/> Google 의 경우에는 <b>\"클라이언트 id\"</b> 입니다.<br/> Kakao 의 경우에는 <b>\"REST API 키\"</b> 입니다.<br/> 실습을 위해 발급받은 키를 등록해주세요. 실제 서비스에서 사용 하는 키를 등록해서는 안됩니다.

### Example

```typescript
import {
    OauthApi,
    Configuration,
    UpsertOauthAppRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new OauthApi(configuration);

let teamId: string; // (default to undefined)
let upsertOauthAppRequestBody: UpsertOauthAppRequestBody; //

const { status, data } = await apiInstance.upsertOauthApp(
    teamId,
    upsertOauthAppRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **upsertOauthAppRequestBody** | **UpsertOauthAppRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**OauthApp**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

