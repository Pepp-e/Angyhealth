import { createContext, useContext } from "react";

// Previews reuse existing markup, but must never perform background mutations.
export const SwipePreviewContext = createContext(false);
export const useSwipePreview = () => useContext(SwipePreviewContext);