import React from 'react';
import { useRouter } from 'next/router';
import { CatalogPage } from './CatalogPage/CatalogPage';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;

  if (!category) return null;

  return <CatalogPage />;
};

export default CategoryPage;