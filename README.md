# StartOff API 테스트 React project

## 무엇을 테스트해야함?
1. **Login할 때**
    - AccessToken, RefreshToken 잘 저장이 되는지?
        - AccessToken > Header, RefreshToken > Cookie 에 저장되는지?
    - RefreshToken이 Redis에 잘 저장되는지?
        - Redis 서버가 꺼져있다면?
2. **AccessToken이 유효할 때**
    - 다른 API를 잘 사용할 수 있는지?
3. **AccessToken이 만료 되었을 때**
    - RefreshToken을 활용해서 AccessToken을 재발급 받을 수 있는지?
    - RefreshToken 또한 같이 만료되었을때, 로그아웃 처리를 하는지?
4. **Logout 할 때**
    - Redis에 저장된 RefreshToken을 삭제하고, 최근 사용한 AccessToken을 BlackList로 올리는지?