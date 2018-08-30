/** @format */

/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import { COMMUNITY_EVENTS_RECEIVE } from 'state/action-types';

export const events = ( state = null, action ) => {
	switch ( action.type ) {
		case COMMUNITY_EVENTS_RECEIVE:
			return action.events;
		default:
			return state;
	}
};

export default combineReducers( {
	events,
} );
