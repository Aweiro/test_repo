// src/utils/getProducts.ts
import { Product } from '../types/ProductType';

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function getProducts(api: string): Promise<Product[]> {
  await wait(500);

  try {
    const response = await fetch(`/api/${api}.json`);

    if (!response.ok) {
      console.error(`❌ File not found: /api/${api}.json (status ${response.status})`);
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`❌ Invalid content-type: ${contentType}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('❌ Failed to parse JSON:', err);
    return [];
  }
}