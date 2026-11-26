import React from 'react';
import iconNames from '../../generated/game-icons.json';
export const GAME_ICON_NAMES = iconNames;
const iconIds = new Set(iconNames);
export const hasGameIcon = id => iconIds.has(id);
export const GameIcon = ({ id, className = '' }) => {
    if (!hasGameIcon(id)) return null;
    const url = 'url("' + (process.env.PUBLIC_URL || '') + '/game-icons/' + id + '.svg")';
    return <span aria-hidden="true" className={'inline-block shrink-0 ' + className}
        style={{backgroundColor:'currentColor', maskImage:url, WebkitMaskImage:url,
            maskSize:'contain', WebkitMaskSize:'contain', maskRepeat:'no-repeat', WebkitMaskRepeat:'no-repeat',
            maskPosition:'center', WebkitMaskPosition:'center'}} />;
};
