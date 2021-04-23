import { Client } from '../../resources/Client';

test('client defaults', function() {
    const client = new Client();
    expect(client.sessions).toEqual([]);
});
