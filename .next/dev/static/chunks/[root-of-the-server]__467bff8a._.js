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
"[project]/src/pages/HomePage.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
});
}),
"[project]/src/components/BannerSlider/BannerSlider.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "banner-slider": "BannerSlider-module-scss-module__XbnGJq__banner-slider",
  "banner-slider__arrow": "BannerSlider-module-scss-module__XbnGJq__banner-slider__arrow",
  "banner-slider__block": "BannerSlider-module-scss-module__XbnGJq__banner-slider__block",
  "banner-slider__button": "BannerSlider-module-scss-module__XbnGJq__banner-slider__button",
  "banner-slider__button--active": "BannerSlider-module-scss-module__XbnGJq__banner-slider__button--active",
  "banner-slider__buttons": "BannerSlider-module-scss-module__XbnGJq__banner-slider__buttons",
  "banner-slider__slider-image": "BannerSlider-module-scss-module__XbnGJq__banner-slider__slider-image",
  "banner-slider__wrapper": "BannerSlider-module-scss-module__XbnGJq__banner-slider__wrapper",
  "container": "BannerSlider-module-scss-module__XbnGJq__container",
});
}),
"[project]/src/assets/img/slider/slider-image-1.jpg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/slider-image-1.acbbc1b0.jpg");}),
"[project]/src/assets/img/slider/slider-image-1.jpg.mjs { IMAGE => \"[project]/src/assets/img/slider/slider-image-1.jpg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$1$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/img/slider/slider-image-1.jpg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$1$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1200,
    height: 630,
    blurWidth: 8,
    blurHeight: 4,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAIAAAA8r+mnAAAAb0lEQVR42gFkAJv/AP////////79/v36+f37+vz8/PT09f7+/gD+/v759vbd2+Kuqr3Yvbjd29+0srP4+PgA6+70mqPAmpisnaa+v7rBuqywuKak8e/xAPn6+97j7N/h5/Dv8PP09+7s7e3p6Pv6+spKVEMBB7LHAAAAAElFTkSuQmCC"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/img/slider/slider-image-2.jpg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/slider-image-2.eb5c36c2.jpg");}),
"[project]/src/assets/img/slider/slider-image-2.jpg.mjs { IMAGE => \"[project]/src/assets/img/slider/slider-image-2.jpg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$2$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/img/slider/slider-image-2.jpg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$2$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1200,
    height: 630,
    blurWidth: 8,
    blurHeight: 4,
    blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCAAEAAgDAREAAhEBAxEB/9sAQwAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47/9sAQwEKCwsODQ4cEBAcOygiKDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmZNKsf+ELDi2QSfZBJvx827Gc5ryPaz+sWv1Pa9lD6te3Q//Z"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/img/slider/slider-image-3.jpg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/slider-image-3.348d81c9.jpg");}),
"[project]/src/assets/img/slider/slider-image-3.jpg.mjs { IMAGE => \"[project]/src/assets/img/slider/slider-image-3.jpg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$3$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/img/slider/slider-image-3.jpg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$3$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1200,
    height: 675,
    blurWidth: 8,
    blurHeight: 5,
    blurDataURL: "data:image/webp;base64,UklGRu0AAABXRUJQVlA4TOEAAAAvBwABAM1VICICHgiACQMAAAA9DBAAAAAAFDgAgANAAAK4AAAABAAAAKAAcAgA4iC/A8ZDEECoDAAAgAcCYMIAAABw/srWBBE6QQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQgQkI6bfNAAEwYAAAAzv8dCo8QDkAAgAAAAAAAAAAAAAAAAAAAAAAAAAAQAASJAMpebZ1WZJ12iZi6OXybHC4PsSK9gf5BiHalY+LSBaFTB0c/zufy19zdPcKLm/N/vX54QyHgzFmUKLWwIdvdl6PzTSegYzIxqFT22o6vWiYA"
};
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
"[project]/src/components/BannerSlider/BannerSlider.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BannerSlider",
    ()=>BannerSlider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/BannerSlider/BannerSlider.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$1$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$1$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/img/slider/slider-image-1.jpg.mjs { IMAGE => "[project]/src/assets/img/slider/slider-image-1.jpg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$2$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$2$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/img/slider/slider-image-2.jpg.mjs { IMAGE => "[project]/src/assets/img/slider/slider-image-2.jpg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$3$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$3$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/img/slider/slider-image-3.jpg.mjs { IMAGE => "[project]/src/assets/img/slider/slider-image-3.jpg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/classnames/index.js [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-slick'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'slick-carousel/slick/slick.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
// import { Button } from '../Button';
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/ButtonType.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.tsx [client] (ecmascript)");
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
const bannerImages = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$1$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$1$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$2$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$2$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$3$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$img$2f$slider$2f$slider$2d$image$2d$3$2e$jpg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
];
const BannerSlider = ()=>{
    _s();
    const [bannerId, setBannerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const sliderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        pauseOnHover: false,
        afterChange: (index)=>setBannerId(index)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__block'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ButtonType"].Left,
                        onClick: ()=>sliderRef.current?.slickPrev(),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__arrow']
                    }, void 0, false, {
                        fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Slider, {
                        ref: sliderRef,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__wrapper'],
                        ...settings,
                        children: bannerImages.map((image)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__slider-image'],
                                src: image,
                                alt: "slide"
                            }, image, false, {
                                fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$ButtonType$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ButtonType"].Right,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__arrow'],
                        onClick: ()=>sliderRef.current?.slickNext()
                    }, void 0, false, {
                        fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__buttons'],
                children: bannerImages.map((image, i)=>{
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$classnames$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__button'], {
                            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['banner-slider__button--active']]: bannerId === i
                        }),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>sliderRef.current?.slickGoTo(i),
                            className: "icon icon--slider-button"
                        }, void 0, false, {
                            fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                            lineNumber: 72,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, image, false, {
                        fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                        lineNumber: 66,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BannerSlider/BannerSlider.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(BannerSlider, "hAzik35HJD3iSnlVj0aU0qjrEaM=");
_c = BannerSlider;
var _c;
__turbopack_context__.k.register(_c, "BannerSlider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BannerSlider/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BannerSlider/BannerSlider.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/components/CategoriesBlock/CategoriesBlock.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
});
}),
"[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoriesBlock",
    ()=>CategoriesBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/components/CategoriesBlock/CategoriesBlock.module.scss [client] (css module)");
(()=>{
    const e = new Error("Cannot find module 'react-router-dom'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
const CategoriesBlock = ({ categories })=>{
    const CategorieCard = ({ categorie })=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].categories__card,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                    to: categorie.url,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].categories__img,
                    style: {
                        backgroundColor: categorie.bgColor
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: categorie.photo,
                        alt: categorie.title
                    }, void 0, false, {
                        fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].categories__details,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].categories__name,
                            children: categorie.title
                        }, void 0, false, {
                            fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `body-text ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].categories__description}`,
                            children: [
                                categorie.count,
                                " models"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Shop by category"
            }, void 0, false, {
                fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].categories,
                children: categories.map((categorie)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategorieCard, {
                        categorie: categorie
                    }, categorie.title, false, {
                        fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_c = CategoriesBlock;
var _c;
__turbopack_context__.k.register(_c, "CategoriesBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/components/CategoriesBlock/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomePage",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$HomePage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/HomePage.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/BannerSlider/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BannerSlider/BannerSlider.tsx [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../components/ProductsSlider'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../types/ProductsType'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../components/Loader'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/pages/components/CategoriesBlock/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/components/CategoriesBlock/CategoriesBlock.tsx [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../hooks/useSortedProducts'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../hooks/useCategoriesRTK'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
const HomePage = ()=>{
    _s();
    const { categorie: products, loading, error } = useCategoriesRTK(ProductsType.Products);
    const sortByBiggestDiscount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HomePage.useCallback[sortByBiggestDiscount]": (a, b)=>b.fullPrice - b.price - (a.fullPrice - a.price)
    }["HomePage.useCallback[sortByBiggestDiscount]"], []);
    const sortByNewModels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HomePage.useCallback[sortByNewModels]": (a, b)=>b.year - a.year
    }["HomePage.useCallback[sortByNewModels]"], []);
    const productsNewModels = useSortedProducts(products, sortByNewModels);
    const productsHotPrices = useSortedProducts(products, sortByBiggestDiscount);
    const allCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HomePage.useMemo[allCategories]": ()=>{
            const categoryMap = {
                [ProductsType.Phones]: {
                    count: 0,
                    url: '/phones',
                    title: 'Mobile phones',
                    photo: 'img/category-phones.webp',
                    bgColor: '#6D6474'
                },
                [ProductsType.Tablets]: {
                    count: 0,
                    url: '/tablets',
                    title: 'Tablets',
                    photo: 'img/category-tablets.webp',
                    bgColor: '#8D8D92'
                },
                [ProductsType.Accessories]: {
                    count: 0,
                    url: '/accessories',
                    title: 'Accessories',
                    photo: 'img/category-accessories.png',
                    bgColor: '#D53C51'
                }
            };
            products.forEach({
                "HomePage.useMemo[allCategories]": (product)=>{
                    if (categoryMap[product.category]) {
                        categoryMap[product.category].count += 1;
                    }
                }
            }["HomePage.useMemo[allCategories]"]);
            return Object.values(categoryMap);
        }
    }["HomePage.useMemo[allCategories]"], [
        products
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "hidden-title",
                children: "Product Catalog"
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$HomePage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].welcome}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$HomePage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].welcome__title,
                            children: "Welcome to Nice Gadgets store!"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/index.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BannerSlider$2f$BannerSlider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["BannerSlider"], {}, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$HomePage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['new-models']}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Loader, {}, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 74,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : error ? 'error' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductsSlider, {
                        title: 'Brand new models',
                        products: productsNewModels
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 78,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/pages/index.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$HomePage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['categories-block']}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$components$2f$CategoriesBlock$2f$CategoriesBlock$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["CategoriesBlock"], {
                        categories: allCategories
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/pages/index.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: `section ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$HomePage$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['hot-prices']}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Loader, {}, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 92,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : error ? 'error' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductsSlider, {
                        title: 'Hot prices',
                        products: productsHotPrices
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 96,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/pages/index.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(HomePage, "D3rVaBZa4c3E77CnFI3J4AKEuEM=", false, function() {
    return [
        useCategoriesRTK,
        useSortedProducts,
        useSortedProducts
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/index.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__467bff8a._.js.map