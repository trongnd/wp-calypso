/** @format */

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import { COMMUNITY_EVENTS_RECEIVE, COMMUNITY_EVENTS_REQUEST_FAILURE } from 'state/action-types';

const events = createReducer(
	{},
	{
		// [ COMMUNITY_EVENTS_REQUEST ]: ( state ) => {
		// 	return {
		// 		...state,
		// 		events: [],
		// 		isLoading: true,
		// 		error: null,
		// 	};
		// },
		[ COMMUNITY_EVENTS_RECEIVE ]: ( state, action ) => {
			return {
				...state,
				events: action.events,
				isLoading: false,
				error: null,
			};
		},
		[ COMMUNITY_EVENTS_REQUEST_FAILURE ]: ( state, action ) => {
			return {
				...state,
				events: [],
				isLoading: false,
				error: action.error,
			};
		},
	}
);

export default events;
