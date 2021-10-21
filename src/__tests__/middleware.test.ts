import type { Request, Response, NextFunction } from 'express';
import Clerk from '../Clerk';

const mockGet = jest.fn();
const mockNext = jest.fn();

afterEach(() => {
    mockNext.mockReset();
});

jest.mock('cookies', () => {
    return jest.fn().mockImplementation(() => {
        return { get: mockGet };
    });
});

test('expressWithSession with no session cookie or header', async () => {
    mockGet.mockImplementationOnce(() => { return undefined; });

    // @ts-ignore
    const req = {} as Request;
    const res = {} as Response;

    const clerk = Clerk.getInstance();

    await clerk.expressWithSession()(req, res, mockNext as NextFunction);

    // @ts-ignore
    expect(req.session).toBeUndefined();

    expect(mockNext).toHaveBeenCalledWith(); // 0 args
});

test('expressRequireSession with no session cookie or token', async () => {
    mockGet.mockImplementationOnce(() => { return undefined; });

    // @ts-ignore
    const req = {} as Request;
    const res = {} as Response;

    const clerk = Clerk.getInstance();

    await clerk.expressRequireSession()(req, res, mockNext as NextFunction);

    // @ts-ignore
    expect(req.session).toBeUndefined();

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext.mock.calls[0][0]).toBeInstanceOf(Error);
});

test('expressWithSession with session token in header', async () => {
    mockGet.mockImplementationOnce(() => { return 'foo'; });

    // @ts-ignore
    const req = { headers: { Authorization: 'bar' } } as Request;
    const res = {} as Response;

    const claims = {
        iss: 'https://clerk.issuer',
        sub: 'subject',
        sid: 'session_id',
    }

    const clerk = Clerk.getInstance();
    clerk.verifyToken = jest.fn().mockReturnValue(claims);
    clerk.decodeToken = jest.fn().mockReturnValue(claims);

    await clerk.expressWithSession()(req, res, mockNext as NextFunction);

    // @ts-ignore
    expect(req.sessionClaims).toEqual(claims);
    // @ts-ignore
    expect(req.session.id).toEqual(claims.sid)
    // @ts-ignore
    expect(req.session.userId).toEqual(claims.sub)

    expect(mockNext).toHaveBeenCalledWith(); // 0 args
});

test('expressRequireSession with session token in header', async () => {
    mockGet.mockImplementationOnce(() => { return 'foo'; });

    // @ts-ignore
    const req = { headers: { Authorization: 'bar' } } as Request;
    const res = {} as Response;

    const claims = {
        iss: 'https://clerk.issuer',
        sub: 'subject',
        sid: 'session_id',
    }

    const clerk = Clerk.getInstance();
    clerk.verifyToken = jest.fn().mockReturnValue(claims);
    clerk.decodeToken = jest.fn().mockReturnValue(claims);

    await clerk.expressRequireSession()(req, res, mockNext as NextFunction);

    // @ts-ignore
    expect(req.sessionClaims).toEqual(claims);
    // @ts-ignore
    expect(req.session.id).toEqual(claims.sid)
    // @ts-ignore
    expect(req.session.userId).toEqual(claims.sub)

    expect(mockNext).toHaveBeenCalledWith(); // 0 args
});
