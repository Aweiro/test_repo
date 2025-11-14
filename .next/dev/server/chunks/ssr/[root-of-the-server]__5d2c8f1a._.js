module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/pages/[category]/CatalogPage/CatalogPage.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
});
}),
"[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CatalogPage",
    ()=>CatalogPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/[category]/CatalogPage/CatalogPage.module.scss [ssr] (css module)");
(()=>{
    const e = new Error("Cannot find module '../../types/ProductsType'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../components/ProductsList'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../components/Loader'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../components/Dropdown'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../components/Pagination'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'react-router-dom'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../types/SearchLabelsType'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../components/Breadcrumbs'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../components/PageInfo'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../hooks/useCategoriesRTK'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
;
;
;
;
;
;
;
;
var SortByValue = /*#__PURE__*/ function(SortByValue) {
    SortByValue["Newest"] = "year";
    SortByValue["Alphabetically"] = "name";
    SortByValue["Cheapest"] = "price";
    return SortByValue;
}(SortByValue || {});
const CatalogPage = ({ category })=>{
    const [searchParams] = useSearchParams();
    const sortOptions = Object.keys(SortByValue);
    const visibleItemsOptions = [
        'All',
        '4',
        '8',
        '16'
    ];
    const sortParams = searchParams.get('sort');
    const visibleItemsParams = searchParams.get('perPage');
    const activePageParams = searchParams.get('page');
    const sortBy = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>sortParams === null ? SortByValue[sortOptions[0]] : SortByValue[sortParams], [
        sortParams,
        sortOptions
    ]);
    const visibleItems = visibleItemsParams === null ? 'All' : +visibleItemsParams;
    const activePage = activePageParams === null ? 1 : +activePageParams;
    const { categorie: products, loading, error } = useCategoriesRTK(ProductsType.Products);
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return [
            ...products
        ].filter((product)=>product.category === category);
    }, [
        category,
        products
    ]);
    const currentProducts = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const sortedProducts = [
            ...filteredProducts
        ].sort((a, b)=>{
            switch(sortBy){
                case "name":
                    return a[sortBy].localeCompare(b[sortBy]);
                case "price":
                    return a[sortBy] - b[sortBy];
                default:
                    return b[sortBy] - a[sortBy];
            }
        });
        if (visibleItems === 'All') {
            return sortedProducts;
        }
        const start = visibleItems * (activePage - 1);
        const end = start + visibleItems;
        return sortedProducts.slice(start, end);
    }, [
        filteredProducts,
        visibleItems,
        activePage,
        sortBy
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].catalog}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Breadcrumbs, {}, void 0, false, {
                    fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PageInfo, {
                    title: "Mobile phones",
                    count: filteredProducts.length
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].catalog__dropdowns,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Dropdown, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['catalog__dropdowns-sort-by'],
                            title: 'Sort by',
                            values: sortOptions,
                            defaultValue: sortOptions[0],
                            searchLabel: SearchLabelsType.Sort
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Dropdown, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['catalog__dropdowns-items-per-page'],
                            title: 'Items per page',
                            values: visibleItemsOptions,
                            defaultValue: visibleItemsOptions[0],
                            searchLabel: SearchLabelsType.ItemsPerPage
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].catalog__cards,
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Loader, {}, void 0, false, {
                        fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                        lineNumber: 105,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : error ? 'error' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ProductsList, {
                        products: currentProducts
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                !loading && visibleItems !== 'All' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].catalog__pagination,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Pagination, {
                        items: filteredProducts.length,
                        itemsOnPage: visibleItems,
                        activePage: activePage,
                        searchLabel: SearchLabelsType.PageCatalog
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                        lineNumber: 115,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/pages/[category]/CatalogPage/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx [ssr] (ecmascript)");
;
}),
"[project]/src/pages/[category]/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/pages/[category]/CatalogPage/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/[category]/CatalogPage/CatalogPage.tsx [ssr] (ecmascript)");
;
;
;
const CategoryPage = ()=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { category } = router.query;
    if (!category) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$CatalogPage$2f$CatalogPage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["CatalogPage"], {
        category: category
    }, void 0, false, {
        fileName: "[project]/src/pages/[category]/index.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CategoryPage;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5d2c8f1a._.js.map