import gCall from '@test_utils/gCall';

const getItemsQuery = `
query GetItems {
  getItems {
    id
    name
    description
    price
    imageUrl
    quantity
  }
}
`;

describe('GetItems', () => {
  it('should return items', async () => {
    const data = await gCall({
      source: getItemsQuery,
    });

    expect(data.data?.getItems.length).toBeGreaterThan(0);
  });
});
