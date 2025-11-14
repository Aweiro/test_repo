module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/react-redux [external] (react-redux, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("react-redux");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@reduxjs/toolkit");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/features/favorites/favoritesSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* eslint-disable no-param-reassign */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "toggleFavorite",
    ()=>toggleFavorite
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const initialState = {
    items: []
};
const favoritesSlice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__["createSlice"])({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite: (state, action)=>{
            const id = action.payload;
            const exists = state.items.includes(id);
            state.items = exists ? state.items.filter((item)=>item !== id) : [
                ...state.items,
                id
            ];
        }
    }
});
const { toggleFavorite } = favoritesSlice.actions;
const __TURBOPACK__default__export__ = favoritesSlice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/@reduxjs/toolkit/query/react [external] (@reduxjs/toolkit/query/react, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@reduxjs/toolkit/query/react");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/utils/getProducts.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProducts",
    ()=>getProducts
]);
function wait(delay) {
    return new Promise((resolve)=>setTimeout(resolve, delay));
}
async function getProducts(api) {
    return wait(500).then(()=>fetch(`./api/${api}.json`)).then((response)=>response.json());
}
}),
"[project]/src/app/services/productsApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// src/app/services/productsApi.ts
__turbopack_context__.s([
    "productsApi",
    ()=>productsApi,
    "useGetProductsByCategoryQuery",
    ()=>useGetProductsByCategoryQuery
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit$2f$query$2f$react__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2f$query$2f$react$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit/query/react [external] (@reduxjs/toolkit/query/react, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getProducts$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getProducts.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit$2f$query$2f$react__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2f$query$2f$react$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit$2f$query$2f$react__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2f$query$2f$react$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const productsApi = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit$2f$query$2f$react__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2f$query$2f$react$2c$__esm_import$29$__["createApi"])({
    reducerPath: 'productsApi',
    // baseQuery: fetchBaseQuery({ baseUrl: '/' }), // базова URL
    baseQuery: async ()=>({
            data: null
        }),
    endpoints: (builder)=>({
            // getProductsByCategory: builder.query<Product[], ProductsType>({
            //   query: category => `api/${category}.json`, // твій шлях до json
            // }),
            getProductsByCategory: builder.query({
                queryFn: async (category)=>{
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getProducts$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["getProducts"])(category);
                        return {
                            data
                        };
                    } catch (error) {
                        return {
                            error: {
                                status: 'FETCH_ERROR',
                                error
                            }
                        };
                    }
                }
            })
        })
});
const { useGetProductsByCategoryQuery } = productsApi;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/store.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "favoritesMiddleware",
    ()=>favoritesMiddleware,
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/favorites/favoritesSlice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/productsApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const favoritesMiddleware = (store)=>(next)=>(action)=>{
            const result = next(action);
            const typedAction = action;
            if (typedAction.type.startsWith('favorites/')) {
                const state = store.getState();
                localStorage.setItem('favorites', JSON.stringify(state.favorites.items));
            }
            return result;
        };
const preloadedState = {
    favorites: {
        items: JSON.parse(localStorage.getItem('favorites') || '[]')
    }
};
const store = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__["configureStore"])({
    reducer: {
        favorites: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["productsApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["productsApi"].reducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(favoritesMiddleware) // кастомний middleware
        .concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["productsApi"].middleware)
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/_app.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// import '@/styles/globals.scss';
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/store.ts [ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/modules/shared/layout/Header/context/HeaderContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/context/SaveProductsContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/modules/shared/layout/Header'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/modules/shared/layout/Footer'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/hooks/useConditionalScroll'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function App({ Component, pageProps }) {
    useConditionalScroll();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SaveProductsProvider, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__["Provider"], {
            store: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["store"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(HeaderProvider, {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Header, {}, void 0, false, {
                        fileName: "[project]/src/pages/_app.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                            ...pageProps
                        }, void 0, false, {
                            fileName: "[project]/src/pages/_app.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/_app.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Footer, {}, void 0, false, {
                        fileName: "[project]/src/pages/_app.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/_app.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/_app.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/_app.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = App;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2e404ce5._.js.map