import { expect } from 'chai';
import Pagination from '@helpers/Pagination';

const paginate = new Pagination(2, 5);

describe('Pagination', () => {
  it('should return pagination metadata', () => {
    const metadata = paginate.getQueryMetadata();

    expect(metadata.limit).to.equal(5);
    expect(metadata.offset).to.equal(5);
  });

  it('should return page metadat without extra query if there is none', () => {
    const metadata = paginate.getPageMetadata(22, '/url');

    expect(metadata.prev).to.equal('/url?page=1&limit=5');
    expect(metadata.next).to.equal('/url?page=3&limit=5');
    expect(metadata.pages).to.equal(5);
    expect(metadata.totalItems).to.equal(22);
  });

  it('should return page metadata without extra query if there is an extra query', () => {
    const metadata = paginate.getPageMetadata(22, '/url', 'date=2019-06-18');

    expect(metadata.prev).to.equal('/url?date=2019-06-18&page=1&limit=5');
    expect(metadata.next).to.equal('/url?date=2019-06-18&page=3&limit=5');
    expect(metadata.pages).to.equal(5);
    expect(metadata.totalItems).to.equal(22);
  });
});
