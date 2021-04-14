import type { Request, Response, NextFunction } from 'express';
import Clerk from '../Clerk';
import { Session } from '../resources/Session';

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

test('expressWithSession with session cookie & active session', async () => {
    mockGet.mockImplementationOnce(() => { return 'foo'; });

    // @ts-ignore
    const req = { query: { _clerk_session_id: 'bar' } } as Request;
    const res = {} as Response;

    const session = new Session({ id: 'sess_heehee' });

    const clerk = Clerk.getInstance();
    clerk.sessions.verifySession = jest.fn().mockReturnValue(session);

    await clerk.expressWithSession()(req, res, mockNext as NextFunction);

    // @ts-ignore
    expect(req.session).toEqual(session);

    expect(mockNext).toHaveBeenCalledWith(); // 0 args
});

test('expressWithSession with no session cookie', async () => {
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

test('expressRequireSession with session cookie & active session', async () => {
    mockGet.mockImplementationOnce(() => { return 'foo'; });

    // @ts-ignore
    const req = { query: { _clerk_session_id: 'bar' } } as Request;
    const res = {} as Response;

    const session = new Session({ id: 'sess_heehee' });

    const clerk = Clerk.getInstance();
    clerk.sessions.verifySession = jest.fn().mockReturnValue(session);

    await clerk.expressRequireSession()(req, res, mockNext as NextFunction);

    // @ts-ignore
    expect(req.session).toEqual(session);

    expect(mockNext).toHaveBeenCalledWith(); // 0 args
});

test('expressRequireSession with no session cookie', async () => {
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
