import { User } from './../../../models/User';
import gCall from '@test_utils/gCall';
import { testUser } from '@test_utils/testUser';

const createItemMutation = `
mutation CreateItem($data: CreateItemInput!) {
  createItem(data: $data) {
    id
    name
    description
    price
    imageUrl
  }
}
`;

describe('CreateItem', () => {
  let user: User | null;
  beforeAll(async () => {
    user = await testUser();
  });

  it('should create a new item', async () => {
    const data = await gCall({
      source: createItemMutation,
      variableValues: {
        data: {
          name: 'Test Item',
          description: 'Test description',
          price: 10,
          imageUrl: 'http://test.com',
        },
      },
      userId: user?.id,
    });

    expect(data).toMatchObject({
      data: {
        createItem: {
          id: expect.any(String),
          name: 'Test Item',
          description: 'Test description',
          price: 10,
          imageUrl: 'http://test.com',
        },
      },
    });
  });

  it('should fail if not logged in', async () => {
    const data = await gCall({
      source: createItemMutation,
      variableValues: {
        data: {
          name: 'Test Item',
          description: 'Test description',
          price: 10,
          imageUrl: 'http://test.com',
        },
      },
    });
    expect(data.errors![0].message).toBe("Access denied! You don't have permission for this action!");
    expect(data.data?.createItem).toBeNull();
  });

  it('should not update if not authorized', async () => {
    
  });

  it('should fail if no name is provided', async () => {
    const data = await gCall({
      source: createItemMutation,
      variableValues: {
        data: {
          name: '',
          description: 'Test description',
          price: 10,
          imageUrl: 'http://test.com',
        },
      },
      userId: user?.id,
    });
    expect(data.errors![0].message).toBe('Argument Validation Error');
    expect(data.data?.createItem).toBeNull();
  });

  it('should fail if no price is not a float with 2 decimals', async () => {
    let data = await gCall({
      source: createItemMutation,
      variableValues: {
        data: {
          name: 'Test',
          description: 'Test description',
          price: '10',
          imageUrl: 'http://test.com',
        },
      },
      userId: user?.id,
    });

    expect(data.errors![0].message).toBe('Variable "$data" got invalid value "10" at "data.price"; Float cannot represent non numeric value: "10"');

    data = await gCall({
      source: createItemMutation,
      variableValues: {
        data: {
          name: 'Test',
          description: 'Test description',
          price: 100.0235789,
          imageUrl: 'http://test.com',
        },
      },
      userId: user?.id,
    });

    expect(data.errors![0].message).toBe('Argument Validation Error');
    expect(data.data?.createItem).toBeNull();
  });
});
