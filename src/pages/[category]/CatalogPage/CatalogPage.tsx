import React, { useMemo } from 'react';
import styles from './CatalogPage.module.scss';
import { ProductsType } from '../../../types/ProductsType';
import { ProductsList } from '../../../components/ProductsList';
import { Loader } from '../../../components/Loader';
import { Dropdown } from '../../../components/Dropdown';
import { Pagination } from '../../../components/Pagination';
import { SearchLabelsType } from '../../../types/SearchLabelsType';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { PageInfo } from '../../../components/PageInfo';
import { useCategoriesRTK } from '../../../hooks/useCategoriesRTK';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { NotFoundPage } from '@/modules/NotFoundPage';

enum SortByValue {
  Newest = 'year',
  Alphabetically = 'name',
  Cheapest = 'price',
}
type SortableKeys = 'name' | 'price' | 'year';
type VisibleItemsType = 'All' | '4' | '8' | '16';

export const CatalogPage = () => {
  const { categorie: products, loading, error } = useCategoriesRTK(ProductsType.Products);
  const router = useRouter();
  const { category } = router.query;

  const searchParams = useSearchParams();
  const sortOptions = Object.keys(SortByValue) as (keyof typeof SortByValue)[];
  const visibleItemsOptions: VisibleItemsType[] = ['All', '4', '8', '16'];
  const visibleItems = searchParams?.get('perPage') ?? 'All';
  const activePage = searchParams?.get('page') ?? 1;
  const sortParams = (SortByValue[searchParams?.get('sort') as keyof typeof SortByValue] ??
    SortByValue[sortOptions[0]]) as SortableKeys;

  const filteredProducts = useMemo(() => {
    return [...products].filter((product) => product.category === category);
  }, [category, products]);

  const currentProducts = useMemo(() => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortParams) {
        case SortByValue.Alphabetically:
          return a[sortParams].localeCompare(b[sortParams]);
        case SortByValue.Cheapest:
          return a[sortParams] - b[sortParams];
        case SortByValue.Newest:
          return b[sortParams] - a[sortParams];
        default:
          return 0;
      }
    });

    if (visibleItems === 'All') {
      return sortedProducts;
    }

    const start = +visibleItems * (+activePage - 1);
    const end = start + +visibleItems;

    return sortedProducts.slice(start, end);
  }, [filteredProducts, visibleItems, activePage, sortParams]);

  const categoryParam = Array.isArray(category) ? category[0] : category;
  if (!categoryParam || !(Object.values(ProductsType) as string[]).includes(categoryParam)) {
    return <NotFoundPage />;
  }

  return (
    <section className={`section ${styles.catalog}`}>
      <div className='container'>
        <Breadcrumbs />
        <PageInfo title='Mobile phones' count={filteredProducts.length} />
        <div className={styles.catalog__dropdowns}>
          <Dropdown
            className={styles['catalog__dropdowns-sort-by']}
            title={'Sort by'}
            values={sortOptions}
            defaultValue={sortOptions[0]}
            searchLabel={SearchLabelsType.Sort}
          />

          <Dropdown
            className={styles['catalog__dropdowns-items-per-page']}
            title={'Items per page'}
            values={visibleItemsOptions}
            defaultValue={visibleItemsOptions[0]}
            searchLabel={SearchLabelsType.ItemsPerPage}
          />
        </div>
        <div className={styles.catalog__cards}>
          {loading ? <Loader /> : error ? 'error' : <ProductsList products={currentProducts} />}
        </div>

        {!loading && visibleItems !== 'All' && (
          <div className={styles.catalog__pagination}>
            <Pagination
              items={filteredProducts.length}
              itemsOnPage={+visibleItems}
              activePage={+activePage}
              searchLabel={SearchLabelsType.PageCatalog}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogPage;