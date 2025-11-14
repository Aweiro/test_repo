(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/features/favorites/favoritesSlice.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable no-param-reassign */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "toggleFavorite",
    ()=>toggleFavorite
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [client] (ecmascript) <locals>");
;
const initialState = {
    items: []
};
const favoritesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/getProducts.tsx [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/services/productsApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/services/productsApi.ts
__turbopack_context__.s([
    "productsApi",
    ()=>productsApi,
    "useGetProductsByCategoryQuery",
    ()=>useGetProductsByCategoryQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getProducts$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getProducts.tsx [client] (ecmascript)");
;
;
const productsApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
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
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getProducts$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["getProducts"])(category);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/store.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "favoritesMiddleware",
    ()=>favoritesMiddleware,
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/favorites/favoritesSlice.ts [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../features/favorites/cartSlice'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/productsApi.ts [client] (ecmascript)");
;
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
        items: ("TURBOPACK compile-time truthy", 1) ? JSON.parse(localStorage.getItem('favorites') || '[]') : "TURBOPACK unreachable"
    }
};
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        favorites: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["default"],
        cart: cartReducer,
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["productsApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["productsApi"].reducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(favoritesMiddleware) // кастомний middleware
        .concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["productsApi"].middleware)
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderContext",
    ()=>HeaderContext,
    "HeaderProvider",
    ()=>HeaderProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const HeaderContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])({
    showNavigation: false,
    setShowNavigation: ()=>{}
});
const HeaderProvider = ({ children })=>{
    _s();
    const [showNavigation, setShowNavigation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeaderContext.Provider, {
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
_s(HeaderProvider, "WBLWMKGi51Flt43n6A7glvt2nIQ=");
_c = HeaderProvider;
var _c;
__turbopack_context__.k.register(_c, "HeaderProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useLocalStorage.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocalStorage",
    ()=>useLocalStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useLocalStorage(key, defaultValue) {
    _s();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(defaultValue);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLocalStorage.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const data = localStorage.getItem(key);
                if (data !== null) {
                    try {
                        setValue(JSON.parse(data));
                    } catch  {
                        setValue(defaultValue);
                    }
                } else {
                    localStorage.setItem(key, JSON.stringify(defaultValue));
                }
            }
        }
    }["useLocalStorage.useEffect"], [
        key,
        defaultValue
    ]);
    const save = (newValue)=>{
        setValue((prev)=>{
            const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
            return valueToStore;
        });
    };
    return [
        value,
        save
    ];
}
_s(useLocalStorage, "zp4Iw+LU/f7rg16WySk7ISePCcE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/SaveProductsContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SaveProductsContext",
    ()=>SaveProductsContext,
    "SaveProductsProvider",
    ()=>SaveProductsProvider,
    "useSaveProducts",
    ()=>useSaveProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useLocalStorage.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const SaveProductsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])({
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
    _s();
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useLocalStorage"])('cart', []);
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useReducer"])(reducer, {
        cartIds: cartItems
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SaveProductsProvider.useEffect": ()=>{
            setCartItems(state.cartIds);
        }
    }["SaveProductsProvider.useEffect"], [
        setCartItems,
        ,
        state.cartIds
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SaveProductsProvider.useMemo[value]": ()=>{
            return {
                cartIds: Array.from(state.cartIds),
                toggleCart: ({
                    "SaveProductsProvider.useMemo[value]": (product)=>dispatch({
                            type: 'TOGGLE_CART',
                            payload: product
                        })
                })["SaveProductsProvider.useMemo[value]"],
                clearCart: ({
                    "SaveProductsProvider.useMemo[value]": ()=>dispatch({
                            type: 'CLEAR_CART'
                        })
                })["SaveProductsProvider.useMemo[value]"],
                isCart: ({
                    "SaveProductsProvider.useMemo[value]": (id)=>state.cartIds.some({
                            "SaveProductsProvider.useMemo[value]": (unit)=>unit.id === id
                        }["SaveProductsProvider.useMemo[value]"])
                })["SaveProductsProvider.useMemo[value]"],
                cartQuantity: ({
                    "SaveProductsProvider.useMemo[value]": (id)=>state.cartIds.find({
                            "SaveProductsProvider.useMemo[value]": (unit)=>unit.id === id
                        }["SaveProductsProvider.useMemo[value]"])?.quantity ?? 0
                })["SaveProductsProvider.useMemo[value]"],
                allCartQuantity: state.cartIds.reduce({
                    "SaveProductsProvider.useMemo[value]": (accumulator, currentValue)=>accumulator + currentValue.quantity
                }["SaveProductsProvider.useMemo[value]"], 0),
                addCartQuantity: ({
                    "SaveProductsProvider.useMemo[value]": (id)=>dispatch({
                            type: 'UPDATE_CART_QUANTITY',
                            payload: {
                                id,
                                delta: 1
                            }
                        })
                })["SaveProductsProvider.useMemo[value]"],
                removeCartQuantity: ({
                    "SaveProductsProvider.useMemo[value]": (id)=>dispatch({
                            type: 'UPDATE_CART_QUANTITY',
                            payload: {
                                id,
                                delta: -1
                            }
                        })
                })["SaveProductsProvider.useMemo[value]"]
            };
        }
    }["SaveProductsProvider.useMemo[value]"], [
        state.cartIds
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SaveProductsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/SaveProductsContext.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SaveProductsProvider, "20tozoaIiniy8iAe0e8LWRT7tQ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocalStorage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useLocalStorage"]
    ];
});
_c = SaveProductsProvider;
const useSaveProducts = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(SaveProductsContext);
    if (!context) {
        throw new Error('useSaveProducts must be used within a SaveProductsProvider');
    }
    return context;
};
_s1(useSaveProducts, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "SaveProductsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/Header.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Header-module-scss-module__Ltmehq__container",
  "header": "Header-module-scss-module__Ltmehq__header",
  "header__navigation": "Header-module-scss-module__Ltmehq__header__navigation",
});
}),
"[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavItem",
    ()=>NavItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const NavItem = ({ to, children, ...props })=>{
    _s();
    const { setShowNavigation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["HeaderContext"]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isActive = pathname === to;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav__links--item']}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: to,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav__links--link'], {
                [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].active]: isActive
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
_s(NavItem, "n6KWhI//B0XdxWplIX2XwsD0BCY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = NavItem;
var _c;
__turbopack_context__.k.register(_c, "NavItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavButton",
    ()=>NavButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const NavButton = ({ to, children, ...props })=>{
    _s();
    const { setShowNavigation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["HeaderContext"]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isActive = pathname === to;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav__buttons--item'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: to,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav__buttons--link'], {
                [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].active]: isActive
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
_s(NavButton, "n6KWhI//B0XdxWplIX2XwsD0BCY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = NavButton;
var _c;
__turbopack_context__.k.register(_c, "NavButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/hooks.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const useAppDispatch = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"])();
};
_s(useAppDispatch, "jI3HA1r1Cumjdbu14H7G+TUj798=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"]
    ];
});
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SaveProductsContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SaveProductsContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const Navigation = ()=>{
    _s();
    const { allCartQuantity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SaveProductsContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useSaveProducts"])();
    const { items: favorites } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "Navigation.useAppSelector": (state)=>state.favorites
    }["Navigation.useAppSelector"]);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navigation.useEffect": ()=>{
            setMounted(true);
        }
    }["Navigation.useEffect"], []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].nav,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].nav__links,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NavItem"], {
                        to: "/",
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NavItem"], {
                        to: "/phones",
                        children: "Phones"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NavItem"], {
                        to: "/tablets",
                        children: "Tablets"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NavItem"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].nav__buttons,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NavButton"], {
                        to: "/favorites",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `icon icon--favorites`
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            favorites.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav__buttons--count'],
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NavButton"], {
                        to: "/cart",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon icon--shopping"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            allCartQuantity > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav__buttons--count'],
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
_s(Navigation, "1rLtzZ6KQ8xF4IesiwhyC/zdWgE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SaveProductsContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useSaveProducts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = Navigation;
var _c;
__turbopack_context__.k.register(_c, "Navigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/components/Navigation/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavItem.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$NavButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/NavButton.tsx [client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/TopBar/TopBar.module.scss [client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/assets/img/Logo.svg.mjs { IMAGE => \"[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/TopBar/TopBar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopBar",
    ()=>TopBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/img/Logo.svg.mjs { IMAGE => "[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const TopBar = ()=>{
    _s();
    const { showNavigation, setShowNavigation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["HeaderContext"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['top-bar'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['top-bar__wrapper'],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['top-bar__left-block'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['top-bar__logo'],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['top-bar__right-block'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])('icon', {
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
_s(TopBar, "Ts1wNE4tqlFlVP9lZsS4h2HT3/U=");
_c = TopBar;
var _c;
__turbopack_context__.k.register(_c, "TopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/TopBar/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/components/Menu/Menu.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Menu-module-scss-module__9OUOhG__container",
  "menu": "Menu-module-scss-module__9OUOhG__menu",
  "menu__navigation": "Menu-module-scss-module__9OUOhG__menu__navigation",
});
}),
"[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Menu",
    ()=>Menu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/Menu.module.scss [client] (css module)");
;
;
;
;
const Menu = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].menu,
        id: "menu",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                fileName: "[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].menu__navigation,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
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
_c = Menu;
var _c;
__turbopack_context__.k.register(_c, "Menu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/components/Menu/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/Header.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/Header.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Navigation/Navigation.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/TopBar/TopBar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/components/Menu/Menu.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const Header = ()=>{
    _s();
    const { showNavigation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["HeaderContext"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].header}`,
                id: "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$TopBar$2f$TopBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                        fileName: "[project]/src/modules/shared/layout/Header/Header.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].header__navigation,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Navigation$2f$Navigation$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
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
            showNavigation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$components$2f$Menu$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Menu"], {}, void 0, false, {
                fileName: "[project]/src/modules/shared/layout/Header/Header.tsx",
                lineNumber: 21,
                columnNumber: 26
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(Header, "Gzkhl7H0GpeeFrGdnqXsfIH9zWk=");
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Header/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/Header.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Footer/Footer.module.scss [client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/components/Button/Button.module.scss [client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/components/Button/Button.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
;
;
;
const Button = ({ icon, iconActive, disabled = false, isDisabled = false, isRatio = false, isSelected = false, isFavorite = false, isPage = false, isCircle = false, isCapacity = false, className = '', children, ...props })=>{
    const currentIcon = isSelected && iconActive ? iconActive : icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(className, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].button, {
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].button__disabled]: isDisabled || isFavorite && isSelected,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].primary]: !isRatio && !icon,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].heart]: isFavorite,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].ratio]: isRatio,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].selected]: isSelected,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].page]: isPage && !disabled,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].circle]: isCircle,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].capacity]: isCapacity,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['page--dots']]: isPage && disabled
        }),
        ...props,
        children: icon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Button/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/ButtonType.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Footer/Footer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Footer/Footer.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ButtonType.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/img/Logo.svg.mjs { IMAGE => "[project]/src/assets/img/Logo.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
;
;
;
;
;
;
;
const Footer = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer__wrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer__logo,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer__logo-img'],
                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$Logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer__nav,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer__link}`,
                                children: "Github"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 18,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer__link}`,
                                children: "Contacts"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: `uppercase-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer__link}`,
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer__button-top'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer__button-top-text']}`,
                                children: "Back to top"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shared/layout/Footer/Footer.tsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ButtonType"].Top,
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
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shared/layout/Footer/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Footer/Footer.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/_app.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$store$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/store.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/context/HeaderContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SaveProductsContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SaveProductsContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Header/Header.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Footer/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shared/layout/Footer/Footer.tsx [client] (ecmascript)");
;
;
;
;
;
;
;
;
// import { useConditionalScroll } from '@/hooks/useConditionalScroll';
function App({ Component, pageProps }) {
    // useConditionalScroll();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SaveProductsContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SaveProductsProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Provider"], {
            store: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$store$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["store"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "App",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$context$2f$HeaderContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["HeaderProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Header$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                            fileName: "[project]/src/pages/_app.tsx",
                            lineNumber: 19,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/_app.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "App-content",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                            ...pageProps
                        }, void 0, false, {
                            fileName: "[project]/src/pages/_app.tsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/_app.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shared$2f$layout$2f$Footer$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                        fileName: "[project]/src/pages/_app.tsx",
                        lineNumber: 24,
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
_c = App;
const __TURBOPACK__default__export__ = App;
var _c;
__turbopack_context__.k.register(_c, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/_app";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/_app.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/_app\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__b76475c5._.js.map