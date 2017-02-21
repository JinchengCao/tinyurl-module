import { TinyUrlClientPage } from './app.po';

describe('tiny-url-client App', function() {
  let page: TinyUrlClientPage;

  beforeEach(() => {
    page = new TinyUrlClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
