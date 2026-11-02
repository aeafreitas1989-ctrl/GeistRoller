import { useEffect, useLayoutEffect, useRef } from "react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const useCharacterSync = (characterId, onCharacterUpdate) => {
    const onCharacterUpdateRef = useRef(onCharacterUpdate);

    useLayoutEffect(() => {
        onCharacterUpdateRef.current = onCharacterUpdate;
    });

    useEffect(() => {
        if (!characterId || typeof EventSource === "undefined") {
            return undefined;
        }

        const source = new EventSource(
            `${API}/characters/${characterId}/events`
        );

        const handleCharacterUpdated = (event) => {
            try {
                const payload = JSON.parse(event.data);
                const updatedCharacter = payload?.character;

                if (
                    !updatedCharacter ||
                    updatedCharacter.id !== characterId
                ) {
                    return;
                }

                onCharacterUpdateRef.current?.(updatedCharacter);
            } catch (error) {
                console.error(
                    "Failed to parse character sync event:",
                    error
                );
            }
        };

        source.addEventListener(
            "character_updated",
            handleCharacterUpdated
        );

        source.onerror = () => {};

        return () => {
            source.removeEventListener(
                "character_updated",
                handleCharacterUpdated
            );
            source.close();
        };
    }, [characterId]);
};
