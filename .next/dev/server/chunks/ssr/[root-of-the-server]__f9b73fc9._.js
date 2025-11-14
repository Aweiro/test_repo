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
"[project]/src/features/cart/cartSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* eslint-disable no-param-reassign */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "isCart",
    ()=>isCart,
    "toggleCart",
    ()=>toggleCart
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
const cartSlice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__["createSlice"])({
    name: 'cart',
    initialState,
    reducers: {
        toggleCart: (state, action)=>{
            const existsCart = state.items.some((unit)=>unit.id === action.payload);
            state.items = existsCart ? state.items.filter((unit)=>unit.id !== action.payload) : [
                ...state.items,
                {
                    id: action.payload,
                    quantity: 1
                }
            ];
        }
    }
});
const isCart = (state, id)=>state.cart?.items?.some((item)=>item.id === id) ?? false;
const { toggleCart } = cartSlice.actions;
const __TURBOPACK__default__export__ = cartSlice.reducer;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/cart/cartSlice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/productsApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const favoritesMiddleware = (store)=>(next)=>(action)=>{
            // Перевірка, що action є об’єктом з type
            if (action && typeof action.type === 'string' && action.type.startsWith('favorites/')) {
                const state = store.getState();
                localStorage.setItem('favorites', JSON.stringify(state.favorites.items));
            }
            return next(action);
        };
const preloadedState = {
    favorites: {
        items: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : []
    }
};
const store = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$29$__["configureStore"])({
    reducer: {
        favorites: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        cart: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["productsApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["productsApi"].reducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
            serializableCheck: false,
            thunk: true
        }).concat(favoritesMiddleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["productsApi"].middleware)
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderContext",
    ()=>HeaderContext,
    "HeaderProvider",
    ()=>HeaderProvider
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const HeaderContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])({
    showNavigation: false,
    setShowNavigation: ()=>{}
});
const HeaderProvider = ({ children })=>{
    const [showNavigation, setShowNavigation] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(HeaderContext.Provider, {
        value: {
            showNavigation,
            setShowNavigation
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/hooks/useLocalStorage.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocalStorage",
    ()=>useLocalStorage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
function useLocalStorage(key, defaultValue) {
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(defaultValue);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        key,
        defaultValue
    ]);
    const save = (newValue)=>{
        setValue((prev)=>{
            const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return valueToStore;
        });
    };
    return [
        value,
        save
    ];
}
}),
"[project]/src/context/SaveProductsContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SaveProductsContext",
    ()=>SaveProductsContext,
    "SaveProductsProvider",
    ()=>SaveProductsProvider,
    "useSaveProducts",
    ()=>useSaveProducts
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useLocalStorage.tsx [ssr] (ecmascript)");
;
;
;
const SaveProductsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])({
    cartIds: [],
    allCartQuantity: 0,
    toggleCart: ()=>{},
    clearCart: ()=>{},
    isCart: ()=>false,
    cartQuantity: ()=>1,
    addCartQuantity: ()=>{},
    removeCartQuantity: ()=>{}
});
function reducer(state, action) {
    switch(action.type){
        case 'TOGGLE_CART':
            const existsCart = state.cartIds.some((unit)=>unit.id === action.payload);
            return {
                ...state,
                cartIds: existsCart ? state.cartIds.filter((unit)=>unit.id !== action.payload) : [
                    ...state.cartIds,
                    {
                        id: action.payload,
                        quantity: 1
                    }
                ]
            };
        case 'UPDATE_CART_QUANTITY':
            return {
                ...state,
                cartIds: state.cartIds.map((unit)=>unit.id === action.payload.id ? {
                        ...unit,
                        quantity: unit.quantity + action.payload.delta
                    } : unit).filter((unit)=>unit.quantity > 0)
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cartIds: []
            };
        default:
            return state;
    }
}
const SaveProductsProvider = ({ children })=>{
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useLocalStorage"])('cart', []);
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useReducer"])(reducer, {
        cartIds: cartItems
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setCartItems(state.cartIds);
    }, [
        setCartItems,
        ,
        state.cartIds
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return {
            cartIds: Array.from(state.cartIds),
            toggleCart: (product)=>dispatch({
                    type: 'TOGGLE_CART',
                    payload: product
                }),
            clearCart: ()=>dispatch({
                    type: 'CLEAR_CART'
                }),
            isCart: (id)=>state.cartIds.some((unit)=>unit.id === id),
            cartQuantity: (id)=>state.cartIds.find((unit)=>unit.id === id)?.quantity ?? 0,
            allCartQuantity: state.cartIds.reduce((accumulator, currentValue)=>accumulator + currentValue.quantity, 0),
            addCartQuantity: (id)=>dispatch({
                    type: 'UPDATE_CART_QUANTITY',
                    payload: {
                        id,
                        delta: 1
                    }
                }),
            removeCartQuantity: (id)=>dispatch({
                    type: 'UPDATE_CART_QUANTITY',
                    payload: {
                        id,
                        delta: -1
                    }
                })
        };
    }, [
        state.cartIds
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SaveProductsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/SaveProductsContext.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useSaveProducts = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(SaveProductsContext);
    if (!context) {
        throw new Error('useSaveProducts must be used within a SaveProductsProvider');
    }
    return context;
};
}),
"[project]/src/modules/shared/layout/Header/Header.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Header-module-scss-module__Ltmehq__container",
  "header": "Header-module-scss-module__Ltmehq__header",
  "header__navigation": "Header-module-scss-module__Ltmehq__header__navigation",
});
}),
"[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "Navigation-module-scss-module__zCGPJq__active",
  "container": "Navigation-module-scss-module__zCGPJq__container",
  "nav": "Navigation-module-scss-module__zCGPJq__nav",
  "nav__buttons": "Navigation-module-scss-module__zCGPJq__nav__buttons",
  "nav__buttons--count": "Navigation-module-scss-module__zCGPJq__nav__buttons--count",
  "nav__buttons--item": "Navigation-module-scss-module__zCGPJq__nav__buttons--item",
  "nav__buttons--link": "Navigation-module-scss-module__zCGPJq__nav__buttons--link",
  "nav__links": "Navigation-module-scss-module__zCGPJq__nav__links",
  "nav__links--item": "Navigation-module-scss-module__zCGPJq__nav__links--item",
  "nav__links--link": "Navigation-module-scss-module__zCGPJq__nav__links--link",
});
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/classnames [external] (classnames, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("classnames", () => require("classnames"));

module.exports = mod;
}),
"[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavItem",
    ()=>NavItem
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/classnames [external] (classnames, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const NavItem = ({ to, children, ...props })=>{
    const { setShowNavigation } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["HeaderContext"]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isActive = pathname === to;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
        className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['nav__links--item']}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: to,
            className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['nav__links--link'], {
                [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].active]: isActive
            }),
            onClick: ()=>setShowNavigation(false),
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavButton",
    ()=>NavButton
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/classnames [external] (classnames, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const NavButton = ({ to, children, ...props })=>{
    const { setShowNavigation } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["HeaderContext"]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isActive = pathname === to;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['nav__buttons--item'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: to,
            className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['nav__buttons--link'], {
                [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].active]: isActive
            }),
            onClick: ()=>setShowNavigation(false),
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/app/hooks.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const useAppDispatch = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__["useDispatch"])();
const useAppSelector = __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$29$__["useSelector"];
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SaveProductsContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SaveProductsContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
'use client';
;
;
;
;
;
;
;
const Navigation = ()=>{
    const { allCartQuantity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SaveProductsContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useSaveProducts"])();
    const { items: favorites } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])((state)=>state.favorites);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].nav,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].nav__links,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["NavItem"], {
                        to: "/",
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["NavItem"], {
                        to: "/phones",
                        children: "Phones"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["NavItem"], {
                        to: "/tablets",
                        children: "Tablets"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["NavItem"], {
                        to: "/accessories",
                        children: "Accessoires"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].nav__buttons,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["NavButton"], {
                        to: "/favorites",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: `icon icon--favorites`
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            favorites.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['nav__buttons--count'],
                                children: favorites.length
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["NavButton"], {
                        to: "/cart",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "icon icon--shopping"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            allCartQuantity > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['nav__buttons--count'],
                                children: allCartQuantity
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/Header/components/Navigation/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/TopBar/TopBar.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "TopBar-module-scss-module__kXPwza__container",
  "top-bar": "TopBar-module-scss-module__kXPwza__top-bar",
  "top-bar__left-block": "TopBar-module-scss-module__kXPwza__top-bar__left-block",
  "top-bar__logo": "TopBar-module-scss-module__kXPwza__top-bar__logo",
  "top-bar__navigation": "TopBar-module-scss-module__kXPwza__top-bar__navigation",
  "top-bar__right-block": "TopBar-module-scss-module__kXPwza__top-bar__right-block",
  "top-bar__wrapper": "TopBar-module-scss-module__kXPwza__top-bar__wrapper",
});
}),
"[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/Logo.fd12052e.svg");}),
"[project]/src/assets/img/Logo.svg.mjs { IMAGE => \"[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 64,
    height: 22,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/src/modules/shared/layout/TopBar/TopBar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopBar",
    ()=>TopBar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/classnames [external] (classnames, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/img/Logo.svg.mjs { IMAGE => "[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const TopBar = ()=>{
    const { showNavigation, setShowNavigation } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["HeaderContext"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['top-bar'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['top-bar__wrapper'],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['top-bar__left-block'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['top-bar__logo'],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                            alt: "logo"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/shared/layout/TopBar/TopBar.tsx",
                            lineNumber: 19,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/TopBar/TopBar.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/modules/shared/layout/TopBar/TopBar.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['top-bar__right-block'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__["default"])('icon', {
                            'icon--menu': !showNavigation
                        }, {
                            'icon--close': showNavigation
                        }),
                        onClick: ()=>setShowNavigation((prev)=>!prev)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/TopBar/TopBar.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/modules/shared/layout/TopBar/TopBar.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/modules/shared/layout/TopBar/TopBar.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/modules/shared/layout/TopBar/TopBar.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/modules/shared/layout/TopBar/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.tsx [ssr] (ecmascript)");
;
}),
"[project]/src/modules/shared/layout/Header/components/Menu/Menu.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Menu-module-scss-module__9OUOhG__container",
  "menu": "Menu-module-scss-module__9OUOhG__menu",
  "menu__navigation": "Menu-module-scss-module__9OUOhG__menu__navigation",
});
}),
"[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "Menu",
    ()=>Menu
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/Menu.module.scss [ssr] (css module)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const Menu = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].menu,
        id: "menu",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                fileName: "[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].menu__navigation,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
                    fileName: "[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/Header/components/Menu/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/Header/Header.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/Header.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const Header = ()=>{
    const { showNavigation } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["HeaderContext"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].header}`,
                id: "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/Header.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].header__navigation,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
                            fileName: "[project]/src/modules/shared/layout/Header/Header.tsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/Header.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shared/layout/Header/Header.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showNavigation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Menu"], {}, void 0, false, {
                fileName: "[project]/src/modules/shared/layout/Header/Header.tsx",
                lineNumber: 21,
                columnNumber: 26
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/Header/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/Header.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/modules/shared/layout/Footer/Footer.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Footer-module-scss-module__dmy2Ea__container",
  "footer": "Footer-module-scss-module__dmy2Ea__footer",
  "footer__button-top": "Footer-module-scss-module__dmy2Ea__footer__button-top",
  "footer__button-top-text": "Footer-module-scss-module__dmy2Ea__footer__button-top-text",
  "footer__logo": "Footer-module-scss-module__dmy2Ea__footer__logo",
  "footer__logo-img": "Footer-module-scss-module__dmy2Ea__footer__logo-img",
  "footer__nav": "Footer-module-scss-module__dmy2Ea__footer__nav",
  "footer__wrapper": "Footer-module-scss-module__dmy2Ea__footer__wrapper",
});
}),
"[project]/src/components/Button/Button.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "Button-module-scss-module__HB5Z3q__button",
  "button__disabled": "Button-module-scss-module__HB5Z3q__button__disabled",
  "capacity": "Button-module-scss-module__HB5Z3q__capacity",
  "circle": "Button-module-scss-module__HB5Z3q__circle",
  "container": "Button-module-scss-module__HB5Z3q__container",
  "heart": "Button-module-scss-module__HB5Z3q__heart",
  "page": "Button-module-scss-module__HB5Z3q__page",
  "page--dots": "Button-module-scss-module__HB5Z3q__page--dots",
  "primary": "Button-module-scss-module__HB5Z3q__primary",
  "ratio": "Button-module-scss-module__HB5Z3q__ratio",
  "selected": "Button-module-scss-module__HB5Z3q__selected",
});
}),
"[project]/src/components/Button/Button.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/classnames [external] (classnames, cjs)");
;
;
;
const Button = ({ icon, iconActive, disabled = false, isDisabled = false, isRatio = false, isSelected = false, isFavorite = false, isPage = false, isCircle = false, isCapacity = false, className = '', children, ...props })=>{
    const currentIcon = isSelected && iconActive ? iconActive : icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$classnames__$5b$external$5d$__$28$classnames$2c$__cjs$29$__["default"])(className, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].button, {
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].button__disabled]: isDisabled || isFavorite && isSelected,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].primary]: !isRatio && !icon,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].heart]: isFavorite,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].ratio]: isRatio,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].selected]: isSelected,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].page]: isPage && !disabled,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].circle]: isCircle,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].capacity]: isCapacity,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['page--dots']]: isPage && disabled
        }),
        ...props,
        children: icon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
            className: `icon icon--${currentIcon}`
        }, void 0, false, {
            fileName: "[project]/src/components/Button/Button.tsx",
            lineNumber: 56,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)) : children
    }, void 0, false, {
        fileName: "[project]/src/components/Button/Button.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/Button/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [ssr] (ecmascript)");
;
}),
"[project]/src/types/ButtonType.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ButtonType",
    ()=>ButtonType
]);
var ButtonType = /*#__PURE__*/ function(ButtonType) {
    ButtonType["Left"] = "arrow-left";
    ButtonType["Right"] = "arrow-right";
    ButtonType["Top"] = "arrow-top";
    ButtonType["Bottom"] = "arrow-bottom";
    ButtonType["HeartFilled"] = "heart-filled";
    ButtonType["Heart"] = "favorites";
    ButtonType["Plus"] = "plus";
    ButtonType["Minus"] = "minus";
    return ButtonType;
}({});
}),
"[project]/src/modules/shared/layout/Footer/Footer.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Footer/Footer.module.scss [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ButtonType.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/img/Logo.svg.mjs { IMAGE => "[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
const Footer = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].footer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__wrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__logo,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['footer__logo-img'],
                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                            alt: "Logo"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                            lineNumber: 14,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                        lineNumber: 13,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__nav,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__link}`,
                                children: "Github"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 18,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__link}`,
                                children: "Contacts"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__link}`,
                                children: "Rights"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 24,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                        lineNumber: 17,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['footer__button-top'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"]['footer__button-top-text']}`,
                                children: "Back to top"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ButtonType"].Top,
                                isRatio: true,
                                onClick: ()=>window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth'
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 31,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                lineNumber: 12,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/modules/shared/layout/Footer/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Footer/Footer.tsx [ssr] (ecmascript)");
;
}),
"[project]/src/pages/_app.tsx [ssr] (ecmascript)", (() => {{

throw new Error("An error occurred while generating the chunk item [project]/src/pages/_app.tsx [ssr] (ecmascript)\n\nCaused by:\n- CJS module can't be async.\n\nDebug info:\n- An error occurred while generating the chunk item [project]/src/pages/_app.tsx [ssr] (ecmascript)\n- Execution of <ModuleChunkItem as EcmascriptChunkItem>::content_with_async_module_info failed\n- Execution of EcmascriptChunkItemContent::new failed\n- CJS module can't be async.");

}}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f9b73fc9._.js.map