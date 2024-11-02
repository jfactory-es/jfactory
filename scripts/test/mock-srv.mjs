import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterAll, afterEach } from 'vitest';

export const restHandlers = [
  http.get('https://api.test.local/asset.txt', function() {
    return new HttpResponse('Hello world!', {
      status: 200
    })
  }),
  http.get('https://api.test.local/asset.html', function() {
    return new HttpResponse('<p class="jFactory-test">Hello world!</p>', {
      status: 200
    })
  }),
  http.get('https://api.test.local/asset.css', function() {
    return new HttpResponse('#dom1 {visibility: hidden;}', {
      status: 200
    })
  }),
  http.get('https://api.test.local/asset.json', function() {
    return HttpResponse.json({
      data1: 123,
      data2: 456
    }, {
      status: 200
    })
  })
];

const server = setupServer(...restHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());