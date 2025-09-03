# UpsertOauthAppRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**appKey** | **string** | 간편 로그인을 위한 인증 키 입니다. Google 의 경우에는 \&quot;클라이언트 id\&quot; 입니다. Kakao 의 경우에는 \&quot;REST API 키\&quot; 입니다. 실습을 위해 발급받은 키를 등록해주세요. 실제 서비스에서 사용 하는 키는 등록하시면 안됩니다. | [default to undefined]
**provider** | [**OauthProvider**](OauthProvider.md) |  | [default to undefined]

## Example

```typescript
import { UpsertOauthAppRequestBody } from './api';

const instance: UpsertOauthAppRequestBody = {
    appKey,
    provider,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
