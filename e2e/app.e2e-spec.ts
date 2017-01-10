import { MercuryTwoPage } from './app.po';

describe('mercury-two App', function() {
  let page: MercuryTwoPage;

  beforeEach(() => {
    page = new MercuryTwoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
