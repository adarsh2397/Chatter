import { ChatterPage } from './app.po';

describe('chatter App', () => {
  let page: ChatterPage;

  beforeEach(() => {
    page = new ChatterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
