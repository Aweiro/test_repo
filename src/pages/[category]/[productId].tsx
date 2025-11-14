import React from 'react';
import { useRouter } from 'next/router';
import { ProductDetailsPage } from './ProductDetailsPage/ProductDetailsPage';

const ProductPage = () => {
  const router = useRouter();
  const { category } = router.query;

  if (!category) return null;

  return <ProductDetailsPage />;
};

export default ProductPage;
