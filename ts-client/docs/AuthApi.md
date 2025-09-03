# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**signIn**](#signin) | **POST** /{teamId}/auth/signIn | |
|[**signInOauth**](#signinoauth) | **POST** /{teamId}/auth/signIn/{provider} | |
|[**signUp**](#signup) | **POST** /{teamId}/auth/signUp | |
|[**signUpOauth**](#signupoauth) | **POST** /{teamId}/auth/signUp/{provider} | |

# **signIn**
> SignInResponse signIn(signInRequestBody)

로그인

### Example

```typescript
import {
    AuthApi,
    Configuration,
    SignInRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let teamId: string; //teamId에 대한 설명 (default to undefined)
let signInRequestBody: SignInRequestBody; //

const { status, data } = await apiInstance.signIn(
    teamId,
    signInRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signInRequestBody** | **SignInRequestBody**|  | |
| **teamId** | [**string**] | teamId에 대한 설명 | defaults to undefined|


### Return type

**SignInResponse**

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

# **signInOauth**
> SignInResponse signInOauth(signInWithOauthRequestBody)

간편 로그인

### Example

```typescript
import {
    AuthApi,
    Configuration,
    SignInWithOauthRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let teamId: string; // (default to undefined)
let provider: OauthProvider; // (default to undefined)
let signInWithOauthRequestBody: SignInWithOauthRequestBody; //

const { status, data } = await apiInstance.signInOauth(
    teamId,
    provider,
    signInWithOauthRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signInWithOauthRequestBody** | **SignInWithOauthRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|
| **provider** | **OauthProvider** |  | defaults to undefined|


### Return type

**SignInResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |
|**403** | Not Registered |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **signUp**
> SignUpResponse signUp(signUpRequestBody)

회원가입

### Example

```typescript
import {
    AuthApi,
    Configuration,
    SignUpRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let teamId: string; // (default to undefined)
let signUpRequestBody: SignUpRequestBody; //

const { status, data } = await apiInstance.signUp(
    teamId,
    signUpRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signUpRequestBody** | **SignUpRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**SignUpResponse**

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

# **signUpOauth**
> SignUpResponse signUpOauth(signUpWithOauthRequestBody)

간편 회원가입

### Example

```typescript
import {
    AuthApi,
    Configuration,
    SignUpWithOauthRequestBody
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let teamId: string; // (default to undefined)
let provider: OauthProvider; // (default to undefined)
let signUpWithOauthRequestBody: SignUpWithOauthRequestBody; //

const { status, data } = await apiInstance.signUpOauth(
    teamId,
    provider,
    signUpWithOauthRequestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signUpWithOauthRequestBody** | **SignUpWithOauthRequestBody**|  | |
| **teamId** | [**string**] |  | defaults to undefined|
| **provider** | **OauthProvider** |  | defaults to undefined|


### Return type

**SignUpResponse**

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

