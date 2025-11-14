module.exports = [
"[project]/src/pages/cart/CartPage.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "cart-modal": "CartPage-module-scss-module__8MX3ba__cart-modal",
  "cart-modal__button": "CartPage-module-scss-module__8MX3ba__cart-modal__button",
  "cart-modal__buttons": "CartPage-module-scss-module__8MX3ba__cart-modal__buttons",
  "cart__block": "CartPage-module-scss-module__8MX3ba__cart__block",
  "cart__info": "CartPage-module-scss-module__8MX3ba__cart__info",
  "cart__item": "CartPage-module-scss-module__8MX3ba__cart__item",
  "cart__item-counter": "CartPage-module-scss-module__8MX3ba__cart__item-counter",
  "cart__item-img": "CartPage-module-scss-module__8MX3ba__cart__item-img",
  "cart__item-photo": "CartPage-module-scss-module__8MX3ba__cart__item-photo",
  "cart__item-remove": "CartPage-module-scss-module__8MX3ba__cart__item-remove",
  "cart__item-title": "CartPage-module-scss-module__8MX3ba__cart__item-title",
  "cart__total": "CartPage-module-scss-module__8MX3ba__cart__total",
  "cart__total-checkout": "CartPage-module-scss-module__8MX3ba__cart__total-checkout",
  "cart__total-count": "CartPage-module-scss-module__8MX3ba__cart__total-count",
  "cart__total-line": "CartPage-module-scss-module__8MX3ba__cart__total-line",
  "cart__wrapper": "CartPage-module-scss-module__8MX3ba__cart__wrapper",
  "container": "CartPage-module-scss-module__8MX3ba__container",
});
}),
"[project]/src/components/BackLink/BackLink.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "back-link": "BackLink-module-scss-module__oZKMCW__back-link",
  "container": "BackLink-module-scss-module__oZKMCW__container",
});
}),
"[project]/src/components/BackLink/BackLink.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BackLink",
    ()=>BackLink
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$BackLink$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/BackLink/BackLink.module.scss [ssr] (css module)");
'use client';
;
;
;
;
const BackLink = ({ category = '/' })=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const rawFrom = params?.get('from');
    // Якщо в URL є from= → повертаємось туди
    // Якщо нема → повертаємось у категорію
    const backHref = rawFrom ? decodeURIComponent(rawFrom) : `/${category}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: backHref,
        className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$BackLink$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['back-link']}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "icon icon--arrow-left"
            }, void 0, false, {
                fileName: "[project]/src/components/BackLink/BackLink.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Back"
            }, void 0, false, {
                fileName: "[project]/src/components/BackLink/BackLink.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BackLink/BackLink.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/BackLink/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$BackLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BackLink/BackLink.tsx [ssr] (ecmascript)");
;
}),
"[project]/src/types/ProductsType.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductsType",
    ()=>ProductsType
]);
var ProductsType = /*#__PURE__*/ function(ProductsType) {
    ProductsType["Phones"] = "phones";
    ProductsType["Accessories"] = "accessories";
    ProductsType["Products"] = "products";
    ProductsType["Tablets"] = "tablets";
    return ProductsType;
}({});
}),
"[project]/src/components/Loader/Loader.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader",
    ()=>Loader
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
'use client';
;
;
;
const Loader = ()=>{
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "Loader",
        "data-cy": "loader",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "Loader__content"
        }, void 0, false, {
            fileName: "[project]/src/components/Loader/Loader.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Loader/Loader.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Loader/index.tsx [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Loader/Loader.tsx [ssr] (ecmascript)");
;
}),
"[project]/src/components/Modal/Modal.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Modal-module-scss-module__k1ZY8q__container",
  "modal": "Modal-module-scss-module__k1ZY8q__modal",
  "modal-overlay": "Modal-module-scss-module__k1ZY8q__modal-overlay",
});
}),
"[project]/src/components/Modal/Modal.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Modal",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$Modal$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Modal/Modal.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/classnames [external] (classnames, cjs)");
;
;
;
const Modal = ({ children, onCloseModal, className })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$Modal$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['modal-overlay'],
                onClick: ()=>onCloseModal(false)
            }, void 0, false, {
                fileName: "[project]/src/components/Modal/Modal.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__["default"])([
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$Modal$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].modal
                ], className),
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/Modal/Modal.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
}),
"[project]/src/components/Modal/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$Modal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Modal/Modal.tsx [ssr] (ecmascript)");
;
}),
"[project]/src/hooks/useCategoriesRTK.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// src/hooks/useCategoriesRTK.ts
__turbopack_context__.s([
    "useCategoriesRTK",
    ()=>useCategoriesRTK
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/productsApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
function useCategoriesRTK(api) {
    const { data, isLoading, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useGetProductsByCategoryQuery"])(api);
    return {
        categorie: data || [],
        loading: isLoading,
        error: isError
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/cart/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CartPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/cart/CartPage.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/BackLink/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$BackLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BackLink/BackLink.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ButtonType.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ProductsType$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ProductsType.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Loader/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Loader/Loader.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Modal/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$Modal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Modal/Modal.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useCategoriesRTK.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/cart/cartSlice.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
function CartPage() {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    const { items: cartIds } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])((state)=>state.cart);
    const allCartQuantity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["selectAllCartQuantity"]);
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const cartQuantity = (id)=>cartIds.find((unit)=>unit.id === id)?.quantity ?? 0;
    const { categorie: products, loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useCategoriesRTK"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ProductsType$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ProductsType"].Products);
    const [showModalCheckout, setShowModalCheckout] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const currentProducts = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>products.filter((el)=>cartIds.some((item)=>item.id === el.itemId)), [
        cartIds,
        products
    ]);
    if (!mounted) return null;
    const CartItem = ({ product })=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].cart__item,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    className: `icon icon--close ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__item-remove']}`,
                    onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["toggleCart"])(product.itemId))
                }, void 0, false, {
                    fileName: "[project]/src/pages/cart/index.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__item-photo'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                        src: product.image,
                        alt: product.name,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__item-img']
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cart/index.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/cart/index.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: `body-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__item-title']}`,
                    children: product.name
                }, void 0, false, {
                    fileName: "[project]/src/pages/cart/index.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__item-counter'],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            isRatio: true,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ButtonType"].Minus,
                            onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["changeCartQuantity"])({
                                    id: product.itemId,
                                    delta: -1
                                }))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/cart/index.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        product.quantity,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            isRatio: true,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ButtonType"].Plus,
                            onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["changeCartQuantity"])({
                                    id: product.itemId,
                                    delta: 1
                                }))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/cart/index.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/cart/index.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                    children: [
                        "$",
                        product.sum
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/cart/index.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/cart/index.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this);
    };
    const visibleProducts = currentProducts.map((el)=>({
            ...el,
            sum: cartQuantity(el.itemId) * el.price,
            quantity: cartQuantity(el.itemId)
        }));
    const allPrice = visibleProducts.reduce((accumulator, currentValue)=>accumulator + currentValue.sum, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].cart__info,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$BackLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["BackLink"], {}, void 0, false, {
                        fileName: "[project]/src/pages/cart/index.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        children: "Cart"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cart/index.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/cart/index.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            cartIds.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                    className: "not-found__img",
                    src: "img/cart-is-empty.png",
                    alt: "empty-cart"
                }, void 0, false, {
                    fileName: "[project]/src/pages/cart/index.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/cart/index.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, this) : loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Loader"], {}, void 0, false, {
                fileName: "[project]/src/pages/cart/index.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this) : error ? 'error' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].cart__block}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].cart__wrapper,
                                children: visibleProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CartItem, {
                                        product: product
                                    }, product.id, false, {
                                        fileName: "[project]/src/pages/cart/index.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/cart/index.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].cart__total,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        children: [
                                            "$",
                                            allPrice
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/cart/index.tsx",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: `body-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__total-count']}`,
                                        children: [
                                            "Total for ",
                                            allCartQuantity,
                                            " items"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/cart/index.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("hr", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__total-line']
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/cart/index.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: `button-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart__total-checkout']}`,
                                        onClick: ()=>setShowModalCheckout(true),
                                        children: "Checkout"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/cart/index.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/cart/index.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/cart/index.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    showModalCheckout && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$Modal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Modal"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart-modal'],
                        onCloseModal: setShowModalCheckout,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                children: "Checkout is not implemented yet. Do you want to clear the Cart?"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/cart/index.tsx",
                                lineNumber: 127,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart-modal__buttons'],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart-modal__button'],
                                        isSelected: true,
                                        onClick: ()=>setShowModalCheckout(false),
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/cart/index.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cart$2f$CartPage$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['cart-modal__button'],
                                        onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["clearCart"])()),
                                        children: "Confirm"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/cart/index.tsx",
                                        lineNumber: 136,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/cart/index.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/cart/index.tsx",
                        lineNumber: 126,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/cart/index.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cbf5cc39._.js.map