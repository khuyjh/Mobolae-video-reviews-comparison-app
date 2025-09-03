# SignInWithOauthRequestBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**redirectUri** | **string** | Kakao 의 경우에는 필수입니다.&lt;br/&gt; 인가 코드를 얻을 때 사용하였던 redirect_uri 값을 그대로 사용합니다. | [optional] [default to undefined]
**token** | **string** | 간편 로그인 과정을 통해 발급받은 토큰입니다.&lt;br /&gt; Google 의 경우에는 &lt;b&gt;Google Id 토큰&lt;/b&gt;(JWT) 입니다.&lt;br/&gt; Kakao 의 경우에는 &lt;b&gt;인가 코드&lt;/b&gt; 입니다. | [default to undefined]

## Example

```typescript
import { SignInWithOauthRequestBody } from './api';

const instance: SignInWithOauthRequestBody = {
    redirectUri,
    token,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
