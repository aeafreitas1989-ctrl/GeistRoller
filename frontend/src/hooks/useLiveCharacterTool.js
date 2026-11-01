import { useEffect, useLayoutEffect, useRef } from "react";
import { registerLiveCharacterTool } from "../utils/liveCharacterState";

export const useLiveCharacterTool = (readState) => {
    const readStateRef = useRef(readState);

    useLayoutEffect(() => {
        readStateRef.current = readState;
    });

    useEffect(() => {
        if (typeof document === "undefined") {
            return undefined;
        }

        return registerLiveCharacterTool(
            document.modelContext,
            () => readStateRef.current()
        );
    }, []);
};
