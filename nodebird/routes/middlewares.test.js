const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

describe('isLoggedIn', () => {
    //가짜 객체, 가짜 함수를 넣는 행위 : 모킹
    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    };
    const next = jest.fn();

    test('로그인되어 있으면 isLoggedIn next 호출', () => {
        const req = {
            isAuthenticated: jest.fn(() => true)
        };
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인되어 있지 않으면 isLoggedIn 에러 응답', () => {
        const req = {
            isAuthenticated: jest.fn(() => false)
        };
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
});

describe('isNotLoggedIn', () => {
    const res = {
        redirect: jest.fn()
    };
    const next = jest.fn();

    test('로그인되어 있으면 isNotLoggedIn 에러 응답', () => {
        const req = {
            isAuthenticated: jest.fn(() => true)
        };
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인한 상태');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    
    test('로그인되어 있지 않으면 isNotLoggedIn next 호출', () => {
        const req = {
            isAuthenticated: jest.fn(() => false)
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});