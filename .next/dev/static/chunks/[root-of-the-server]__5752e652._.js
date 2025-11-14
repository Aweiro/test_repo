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
"[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "ProductDetailsPage-module-scss-module__hKNdeq__container",
  "product-details__controls": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__controls",
  "product-details__description": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description",
  "product-details__description-block": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description-block",
  "product-details__description-block--left": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description-block--left",
  "product-details__description-block--right": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description-block--right",
  "product-details__description-content": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description-content",
  "product-details__description-content-text": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description-content-text",
  "product-details__description-line": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description-line",
  "product-details__description-title": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__description-title",
  "product-details__info": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__info",
  "product-details__info-row": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__info-row",
  "product-details__info-title": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__info-title",
  "product-details__main": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__main",
  "product-details__not-found-img": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__not-found-img",
  "product-details__not-found-title": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__not-found-title",
  "product-details__options": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__options",
  "product-details__options-block": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__options-block",
  "product-details__options-buttons": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__options-buttons",
  "product-details__options-line": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__options-line",
  "product-details__options-title": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__options-title",
  "product-details__payment": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__payment",
  "product-details__photo-big": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__photo-big",
  "product-details__photo-frame": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__photo-frame",
  "product-details__photo-small": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__photo-small",
  "product-details__photos-wrapper": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__photos-wrapper",
  "product-details__price": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__price",
  "product-details__price-old": "ProductDetailsPage-module-scss-module__hKNdeq__product-details__price-old",
});
}),
"[project]/src/components/Breadcrumbs/Breadcrumbs.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "Breadcrumbs-module-scss-module__Ir3W5a__active",
  "breadcrumbs": "Breadcrumbs-module-scss-module__Ir3W5a__breadcrumbs",
  "breadcrumbs__arrow": "Breadcrumbs-module-scss-module__Ir3W5a__breadcrumbs__arrow",
  "breadcrumbs__item": "Breadcrumbs-module-scss-module__Ir3W5a__breadcrumbs__item",
  "container": "Breadcrumbs-module-scss-module__Ir3W5a__container",
});
}),
"[project]/src/components/Breadcrumbs/Breadcrumbs.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Breadcrumbs",
    ()=>Breadcrumbs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Breadcrumbs/Breadcrumbs.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client'; // потрібне для клієнтського рендера
;
;
;
;
;
const Breadcrumbs = ({ lastTitle })=>{
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"])() || '/';
    const pathnameArr = [
        '/',
        ...pathname.split('/').filter((el)=>el)
    ];
    if (lastTitle) {
        pathnameArr.pop();
        pathnameArr.push(lastTitle);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].breadcrumbs,
        children: pathnameArr.map((path, i)=>{
            const isHome = path === '/';
            const normalizePath = path.charAt(0).toUpperCase() + path.slice(1);
            if (i === pathnameArr.length - 1) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].breadcrumbs__item} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].active}`,
                    children: normalizePath
                }, i, false, {
                    fileName: "[project]/src/components/Breadcrumbs/Breadcrumbs.tsx",
                    lineNumber: 30,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0));
            }
            const pathSegments = lastTitle ? pathnameArr.slice(0, -1) : pathnameArr;
            const linkPath = isHome ? '/' : '/' + pathSegments.slice(1, i + 1).join('/');
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: linkPath,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].breadcrumbs__item, {
                            'icon icon--home': isHome
                        }),
                        children: !isHome && normalizePath
                    }, void 0, false, {
                        fileName: "[project]/src/components/Breadcrumbs/Breadcrumbs.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `icon icon--arrow-right ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].breadcrumbs__arrow}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/Breadcrumbs/Breadcrumbs.tsx",
                        lineNumber: 50,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, i, true, {
                fileName: "[project]/src/components/Breadcrumbs/Breadcrumbs.tsx",
                lineNumber: 41,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/src/components/Breadcrumbs/Breadcrumbs.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Breadcrumbs, "wVXOWZKWdId76kQQO0KX6Oz3JDA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Breadcrumbs;
var _c;
__turbopack_context__.k.register(_c, "Breadcrumbs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Breadcrumbs/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Breadcrumbs/Breadcrumbs.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/ProductsType.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Loader/Loader.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader",
    ()=>Loader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const Loader = ()=>{
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Loader.useEffect": ()=>{
            setMounted(true);
        }
    }["Loader.useEffect"], []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "Loader",
        "data-cy": "loader",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(Loader, "LrrVfNW3d1raFE0BNzCTILYmIfo=");
_c = Loader;
var _c;
__turbopack_context__.k.register(_c, "Loader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Loader/index.tsx [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Loader/Loader.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
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
"[project]/src/components/ProductsSlider/ProductsSlider.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "ProductsSlider-module-scss-module__mTDrcq__container",
  "product-slider__buttons": "ProductsSlider-module-scss-module__mTDrcq__product-slider__buttons",
  "product-slider__card": "ProductsSlider-module-scss-module__mTDrcq__product-slider__card",
  "product-slider__header": "ProductsSlider-module-scss-module__mTDrcq__product-slider__header",
  "product-slider__wrapper": "ProductsSlider-module-scss-module__mTDrcq__product-slider__wrapper",
});
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
"[project]/src/components/ProductCard/ProductCard.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "ProductCard-module-scss-module___HK1Jq__container",
  "product-card": "ProductCard-module-scss-module___HK1Jq__product-card",
  "product-card__img": "ProductCard-module-scss-module___HK1Jq__product-card__img",
  "product-card__img__img-container": "ProductCard-module-scss-module___HK1Jq__product-card__img__img-container",
  "product-card__info": "ProductCard-module-scss-module___HK1Jq__product-card__info",
  "product-card__info-name": "ProductCard-module-scss-module___HK1Jq__product-card__info-name",
  "product-card__info-row": "ProductCard-module-scss-module___HK1Jq__product-card__info-row",
  "product-card__line": "ProductCard-module-scss-module___HK1Jq__product-card__line",
  "product-card__price-prev": "ProductCard-module-scss-module___HK1Jq__product-card__price-prev",
  "product-card__price-row": "ProductCard-module-scss-module___HK1Jq__product-card__price-row",
  "product-card__title": "ProductCard-module-scss-module___HK1Jq__product-card__title",
});
}),
"[project]/src/components/PaymentsButtons/PaymentsButtons.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "page": "PaymentsButtons-module-scss-module__JD2l7G__page",
  "payments__buttons": "PaymentsButtons-module-scss-module__JD2l7G__payments__buttons",
  "payments__buttons-add": "PaymentsButtons-module-scss-module__JD2l7G__payments__buttons-add",
});
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
"[project]/src/features/favorites/favoritesSlice.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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
"[project]/src/features/cart/cartSlice.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "changeCartQuantity",
    ()=>changeCartQuantity,
    "clearCart",
    ()=>clearCart,
    "default",
    ()=>__TURBOPACK__default__export__,
    "selectAllCartQuantity",
    ()=>selectAllCartQuantity,
    "toggleCart",
    ()=>toggleCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [client] (ecmascript) <locals>");
;
const initialState = {
    items: []
};
const cartSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
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
        },
        changeCartQuantity: (state, action)=>{
            state.items = state.items.map((unit)=>unit.id === action.payload.id ? {
                    ...unit,
                    quantity: unit.quantity + action.payload.delta
                } : unit).filter((unit)=>unit.quantity > 0);
        },
        clearCart: (state)=>{
            state.items = [];
        }
    }
});
const selectAllCartQuantity = (state)=>state.cart.items.reduce((total, item)=>total + item.quantity, 0);
const { toggleCart, changeCartQuantity, clearCart } = cartSlice.actions;
const __TURBOPACK__default__export__ = cartSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PaymentsButtons/PaymentsButtons.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PaymentsButtons",
    ()=>PaymentsButtons
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/PaymentsButtons/PaymentsButtons.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ButtonType.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/favorites/favoritesSlice.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/cart/cartSlice.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const PaymentsButtons = ({ isPage = false, product })=>{
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const { items: favorites } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "PaymentsButtons.useAppSelector": (state)=>state.favorites
    }["PaymentsButtons.useAppSelector"]);
    const { items: cart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "PaymentsButtons.useAppSelector": (state)=>state.cart
    }["PaymentsButtons.useAppSelector"]);
    const isActiveCart = cart.some((item)=>item.id === product);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].payments__buttons, {
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].page]: isPage
        }),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                isSelected: isActiveCart,
                className: `button-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['payments__buttons-add']}`,
                onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$cart$2f$cartSlice$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["toggleCart"])(product)),
                children: isActiveCart ? 'Added to cart' : 'Add to cart'
            }, void 0, false, {
                fileName: "[project]/src/components/PaymentsButtons/PaymentsButtons.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                isRatio: true,
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ButtonType"].Heart,
                isFavorite: true,
                iconActive: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ButtonType"].HeartFilled,
                isSelected: favorites.includes(product),
                onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$favorites$2f$favoritesSlice$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["toggleFavorite"])(product))
            }, void 0, false, {
                fileName: "[project]/src/components/PaymentsButtons/PaymentsButtons.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PaymentsButtons/PaymentsButtons.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PaymentsButtons, "kVCFk5tev6+EI7Td+tz7QMuPGtw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = PaymentsButtons;
var _c;
__turbopack_context__.k.register(_c, "PaymentsButtons");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PaymentsButtons/index.tsx [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PaymentsButtons/PaymentsButtons.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProductCard/ProductCard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ProductCard/ProductCard.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)"); // заміна react-router-dom
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/PaymentsButtons/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PaymentsButtons/PaymentsButtons.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const ProductCard = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ product, className })=>{
    _s();
    var _s1 = __turbopack_context__.k.signature();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleClick = (e)=>{
        e.preventDefault();
        const html = document.documentElement;
        html.style.scrollBehavior = 'smooth';
        router.push(`/${product.category}/${product.itemId}`).finally(()=>{
            window.scrollTo({
                top: 0
            });
            html.style.scrollBehavior = '';
        });
    };
    const LinkDetails = ({ children, linkClassName })=>{
        _s1();
        const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"])();
        const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
        // Будуємо search string
        const search = params?.toString() ? `?${params?.toString()}` : '';
        // Формуємо from (повний шлях)
        const from = `${pathname}${search}`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: `/${product.category}/${product.itemId}?from=${encodeURIComponent(from)}`,
            className: linkClassName,
            onClick: handleClick,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
            lineNumber: 48,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0));
    };
    _s1(LinkDetails, "Wsvg1QANJmEj1lVNEM/5p1G8H3k=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSearchParams"]
        ];
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card']} ${className ? className : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkDetails, {
                linkClassName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__img-container'],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    src: '/' + product.image,
                    alt: "product",
                    width: 100,
                    height: 100,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__img']
                }, void 0, false, {
                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkDetails, {
                linkClassName: `body-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__title']}`,
                children: product.name
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__price-row'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__price-current'],
                        children: [
                            "$",
                            product.price
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__price-prev'],
                        children: [
                            "$",
                            product.fullPrice
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__line']
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-row'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-name']}`,
                                children: "Screen"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-value']}`,
                                children: product.screen
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-row'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-name']}`,
                                children: "Capacity"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-value']}`,
                                children: product.capacity
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-row'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-name']}`,
                                children: "RAM"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-card__info-value']}`,
                                children: product.ram
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["PaymentsButtons"], {
                product: product.itemId
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
})), "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = ProductCard;
ProductCard.displayName = 'ProductCard';
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductCard$React.memo");
__turbopack_context__.k.register(_c1, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProductCard/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductCard/ProductCard.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProductsSlider/ProductsSlider.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductsSlider",
    ()=>ProductsSlider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ProductsSlider/ProductsSlider.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ButtonType.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ProductCard/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductCard/ProductCard.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-react.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const ProductsSlider = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ title, products })=>{
    _s();
    const swiperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isBeginning, setIsBeginning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isEnd, setIsEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSlideChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProductsSlider.useCallback[handleSlideChange]": (s)=>{
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
        }
    }["ProductsSlider.useCallback[handleSlideChange]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-slider'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-slider__header'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-slider__buttons'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>swiperRef.current?.slidePrev(),
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ButtonType"].Left,
                                disabled: isBeginning,
                                isDisabled: isBeginning,
                                isRatio: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>swiperRef.current?.slideNext(),
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ButtonType"].Right,
                                disabled: isEnd,
                                isDisabled: isEnd,
                                isRatio: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Swiper"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-slider__wrapper'],
                simulateTouch: false,
                onSwiper: (s)=>handleSlideChange(s),
                onSlideChange: (s)=>{
                    handleSlideChange(s);
                },
                onBeforeInit: (swiper)=>{
                    handleSlideChange(swiper);
                    swiperRef.current = swiper;
                },
                spaceBetween: 16,
                slidesPerView: 4,
                slidesOffsetAfter: 16,
                breakpoints: {
                    0: {
                        slidesPerView: 1.5,
                        slidesOffsetAfter: 16
                    },
                    640: {
                        slidesPerView: 2.5,
                        slidesOffsetAfter: 24
                    },
                    1135: {
                        slidesPerView: 4,
                        slidesOffsetAfter: 0
                    }
                },
                children: products.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["SwiperSlide"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-slider__card'],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ProductCard"], {
                            product: product
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                            lineNumber: 74,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, product.id, false, {
                        fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                        lineNumber: 70,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, products.length, false, {
                fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ProductsSlider/ProductsSlider.tsx",
        lineNumber: 28,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
}, "ssvEznCa4ziCnKMrohChDkHMbwI=")), "ssvEznCa4ziCnKMrohChDkHMbwI=");
_c1 = ProductsSlider;
ProductsSlider.displayName = 'ProductsSlider';
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductsSlider$React.memo");
__turbopack_context__.k.register(_c1, "ProductsSlider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProductsSlider/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductsSlider/ProductsSlider.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/getSuggestedProducts.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSuggestedProducts",
    ()=>getSuggestedProducts
]);
const getSuggestedProducts = (item, products)=>{
    return products.filter(// el => el.itemId.includes(item.namespaceId) && (item.capacity === el.capacity || item.color === el.color),
    (el)=>el.price >= item.priceDiscount - 50 && el.price <= item.priceDiscount + 100 && el.category === item.category);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BackLink/BackLink.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
const { jsxDEV: _jsxDEV } = __turbopack_context__.r("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
const LinkDetails = ({ children, linkClassName })=>{
    const pathname = usePathname();
    const params = useSearchParams();
    // Будуємо search string
    const search = params.toString() ? `?${params.toString()}` : '';
    // Формуємо from (повний шлях)
    const from = `${pathname}${search}`;
    return /*#__PURE__*/ _jsxDEV(Link, {
        href: `/${product.category}/${product.itemId}?from=${encodeURIComponent(from)}`,
        className: linkClassName,
        onClick: handleClick,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/BackLink/BackLink.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BackLink/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$BackLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BackLink/BackLink.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BackLink/index.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/BackLink/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$BackLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BackLink/BackLink.tsx [client] (ecmascript)");
}),
"[project]/src/types/ProductColorsType.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productColors",
    ()=>productColors
]);
const productColors = {
    graphite: '#383838',
    gold: '#FFD700',
    sierrablue: '#6CABDD',
    black: '#000000',
    rosegold: '#B76E79',
    silver: '#C0C0C0',
    spacegray: '#4B4F54',
    white: '#FFFFFF',
    yellow: '#FFFF00',
    red: '#c52b2bff',
    coral: '#FF7F50',
    midnight: '#2C3E50',
    purple: '#800080',
    spaceblack: '#1D1D1D',
    blue: '#3333afff',
    pink: '#FFC0CB',
    green: '#008000',
    midnightgreen: '#004953'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/getProducts.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/getProducts.ts
__turbopack_context__.s([
    "getProducts",
    ()=>getProducts
]);
function wait(delay) {
    return new Promise((resolve)=>setTimeout(resolve, delay));
}
async function getProducts(api) {
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
"[project]/src/hooks/useCategoriesRTK.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/hooks/useCategoriesRTK.ts
__turbopack_context__.s([
    "useCategoriesRTK",
    ()=>useCategoriesRTK
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/productsApi.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useCategoriesRTK(api) {
    _s();
    const { data, isLoading, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useGetProductsByCategoryQuery"])(api);
    return {
        categorie: data || [],
        loading: isLoading,
        error: isError
    };
}
_s(useCategoriesRTK, "hCjFeqYFeBeMZC3De2mB0wkKZeM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$productsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useGetProductsByCategoryQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductDetailsPage",
    ()=>ProductDetailsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Breadcrumbs/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Breadcrumbs/Breadcrumbs.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ProductsType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ProductsType.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Loader/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Loader/Loader.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$swipeable$2f$es$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-swipeable/es/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ProductsSlider/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductsSlider/ProductsSlider.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getSuggestedProducts$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getSuggestedProducts.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/BackLink/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BackLink/index.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/PaymentsButtons/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PaymentsButtons/PaymentsButtons.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ProductColorsType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ProductColorsType.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useCategoriesRTK.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
;
;
;
var VariantChangeType = /*#__PURE__*/ function(VariantChangeType) {
    VariantChangeType["VariantColor"] = "color";
    VariantChangeType["VariantCapacity"] = "capacity";
    return VariantChangeType;
}(VariantChangeType || {});
const ProductDetailsPage = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { productId, category } = router.query;
    const { categorie: products, loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCategoriesRTK"])(category);
    const { categorie: allProducts, loading: allProductsLoading, error: allProductsError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCategoriesRTK"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ProductsType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ProductsType"].Products);
    const product = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetailsPage.useMemo[product]": ()=>{
            return products.find({
                "ProductDetailsPage.useMemo[product]": (el)=>el.id === productId
            }["ProductDetailsPage.useMemo[product]"]);
        }
    }["ProductDetailsPage.useMemo[product]"], [
        products,
        productId
    ]);
    const [currentPhoto, setCurrentPhoto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const handlersSwipe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$swipeable$2f$es$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSwipeable"])({
        onSwipedLeft: {
            "ProductDetailsPage.useSwipeable[handlersSwipe]": ()=>{
                if (!product?.images || !currentPhoto) {
                    return;
                }
                const currentIndex = product.images.indexOf(currentPhoto);
                const nextIndex = Math.min(currentIndex + 1, product.images.length - 1);
                setCurrentPhoto(product.images[nextIndex]);
            }
        }["ProductDetailsPage.useSwipeable[handlersSwipe]"],
        onSwipedRight: {
            "ProductDetailsPage.useSwipeable[handlersSwipe]": ()=>{
                if (!product?.images || !currentPhoto) {
                    return;
                }
                const currentIndex = product.images.indexOf(currentPhoto);
                const prevIndex = Math.max(currentIndex - 1, 0);
                setCurrentPhoto(product.images[prevIndex]);
            }
        }["ProductDetailsPage.useSwipeable[handlersSwipe]"],
        trackMouse: true
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetailsPage.useEffect": ()=>{
            if (product?.images?.length) {
                setCurrentPhoto(product.images[0]);
            }
        // else {
        // setCurrentPhoto('img/accessories/apple-watch-series-4/silver/00.webp'); // любе фото якщо немає основного
        // }
        }
    }["ProductDetailsPage.useEffect"], [
        product,
        setCurrentPhoto
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetailsPage.useEffect": ()=>{
            if (error || !product) {
                const timeout = setTimeout({
                    "ProductDetailsPage.useEffect.timeout": ()=>{
                        router.push('/');
                    }
                }["ProductDetailsPage.useEffect.timeout"], 3000);
                return ({
                    "ProductDetailsPage.useEffect": ()=>clearTimeout(timeout)
                })["ProductDetailsPage.useEffect"];
            }
            return undefined;
        }
    }["ProductDetailsPage.useEffect"], [
        error,
        product,
        router
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Loader"], {}, void 0, false, {
            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
            lineNumber: 86,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (error || !product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    className: `not-found__img ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__not-found-img']}`,
                    src: "/img/product-not-found.png",
                    alt: "productNotFound",
                    width: 100,
                    height: 100
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__not-found-title'],
                    children: "Product was not found"
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const descriptionItems = [
        {
            title: 'Screen',
            value: product.screen
        },
        {
            title: 'Resolution',
            value: product.resolution
        },
        {
            title: 'Processor',
            value: product.processor
        },
        {
            title: 'RAM',
            value: product.ram
        },
        {
            title: 'Built in memory',
            value: product.capacity
        },
        {
            title: 'Camera',
            value: product.camera
        },
        {
            title: 'Zoom',
            value: product.zoom
        },
        {
            title: 'Cell',
            value: product.cell.join(', ')
        }
    ];
    const InfoBlock = ({ isSmall = false })=>{
        const normalizedItems = isSmall ? descriptionItems.slice(0, 4) : descriptionItems;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__info'],
            children: normalizedItems.map(({ title, value })=>{
                if (!value) {
                    return;
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__info-row'],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__info-title'], {
                                'body-text': !isSmall,
                                'small-text': isSmall
                            }),
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                            lineNumber: 127,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__info-description'], {
                                'body-text': !isSmall
                            }),
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                            lineNumber: 135,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, value, true, {
                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                    lineNumber: 126,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0));
            })
        }, void 0, false, {
            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    const handleVariantChange = (key, value)=>{
        const currentProduct = products.find((findItem)=>findItem.namespaceId === product.namespaceId && findItem[key] === value && findItem.color === (key === "capacity" ? product.color : value) && findItem.capacity === (key === "color" ? product.capacity : value)) || product;
        router.push(`/${category}/${currentProduct.id}`, undefined, {
            scroll: false
        });
    };
    const ChangeOptionsBlock = ({ variantChange, title })=>{
        const normalizedItems = [];
        switch(variantChange){
            case "color":
                normalizedItems.push(...product.colorsAvailable);
                break;
            case "capacity":
                normalizedItems.push(...product.capacityAvailable);
                break;
            default:
                return;
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__options'],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__options-block']}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `small-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__options-title']}`,
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__options-buttons'],
                            children: normalizedItems.map((el)=>{
                                const normalizedColor = el.split(' ').join('');
                                const color = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ProductColorsType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["productColors"][normalizedColor] || el;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "body-text",
                                    isCapacity: variantChange === "capacity",
                                    isRatio: variantChange === "color",
                                    isCircle: variantChange === "color",
                                    isSelected: product[variantChange] === el,
                                    disabled: product[variantChange] === el,
                                    style: {
                                        color: variantChange === "color" ? color : ''
                                    },
                                    onClick: ()=>handleVariantChange(variantChange, el),
                                    children: variantChange === "capacity" && el
                                }, el, false, {
                                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                    lineNumber: 192,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__options-line']
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    const DescriptionBlock = ({ children, title, className })=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description-block'], className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description-title'],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description-line']
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
            lineNumber: 226,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `container ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details']}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumbs$2f$Breadcrumbs$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Breadcrumbs"], {
                lastTitle: product.name
            }, void 0, false, {
                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page__info",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BackLink$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["BackLink"], {
                        category: product.category
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__main']}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__photo-big'],
                        src: '/' + currentPhoto || '',
                        width: 500,
                        height: 500,
                        alt: "photo",
                        draggable: false,
                        ...handlersSwipe
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__photos-wrapper'],
                        children: product.images.map((img)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__photo-frame'],
                                onClick: ()=>setCurrentPhoto(img),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__photo-small'],
                                    src: '/' + img,
                                    alt: "small-photo",
                                    width: 80,
                                    height: 80
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, img, false, {
                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__controls'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChangeOptionsBlock, {
                                title: 'Available colors',
                                variantChange: "color"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChangeOptionsBlock, {
                                title: 'Select capacity',
                                variantChange: "capacity"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__payment'],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__price'],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: [
                                                    "$",
                                                    product.priceDiscount
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                                lineNumber: 282,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__price-old'],
                                                children: [
                                                    "$",
                                                    product.priceRegular
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                                lineNumber: 283,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PaymentsButtons$2f$PaymentsButtons$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["PaymentsButtons"], {
                                        product: product.id,
                                        isPage: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                        lineNumber: 285,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBlock, {
                                isSmall: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description']}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DescriptionBlock, {
                        title: "About",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description-block--left'],
                        children: product.description.map((el, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description-content'],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        children: el.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    el.text.map((part, partI)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `body-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description-content-text']}`,
                                            children: part
                                        }, partI, false, {
                                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                            lineNumber: 301,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, i, true, {
                                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DescriptionBlock, {
                        title: "Tech specs",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['product-details__description-block--right'],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBlock, {}, void 0, false, {
                            fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            allProductsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Loader"], {}, void 0, false, {
                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                lineNumber: 321,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : allProductsError ? 'error' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductsSlider$2f$ProductsSlider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ProductsSlider"], {
                    title: 'You may also like',
                    products: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getSuggestedProducts$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["getSuggestedProducts"])(product, allProducts)
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                    lineNumber: 326,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx",
        lineNumber: 238,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ProductDetailsPage, "Ed3WK4red9+gd+nQZuCt3v5m3hk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCategoriesRTK"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCategoriesRTK$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCategoriesRTK"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$swipeable$2f$es$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSwipeable"]
    ];
});
_c = ProductDetailsPage;
var _c;
__turbopack_context__.k.register(_c, "ProductDetailsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/[category]/[productId].tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/[category]/ProductDetailsPage/ProductDetailsPage.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const ProductPage = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { category } = router.query;
    if (!category) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f5b$category$5d2f$ProductDetailsPage$2f$ProductDetailsPage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ProductDetailsPage"], {}, void 0, false, {
        fileName: "[project]/src/pages/[category]/[productId].tsx",
        lineNumber: 11,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ProductPage, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProductPage;
const __TURBOPACK__default__export__ = ProductPage;
var _c;
__turbopack_context__.k.register(_c, "ProductPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/[category]/[productId].tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/[category]/[productId]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/[category]/[productId].tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/[category]/[productId].tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/[category]/[productId].tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__5752e652._.js.map