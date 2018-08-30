/** @format */

/**
 * Internal dependencies
 */
import { COMMUNITY_EVENTS_RECEIVE, COMMUNITY_EVENTS_REQUEST } from 'state/action-types';

/**
 * Action creator to request local community events
 *
 * @return {Object} action object
 */
export const requestCommunityEvents = () => {
	return {
		type: COMMUNITY_EVENTS_REQUEST,
	};
};

/**
 * Action creator to receive events array
 *
 * @param {Object} events array
 * @returns {Object} action object
 */
export const communityEventsReceive = events => ( {
	type: COMMUNITY_EVENTS_RECEIVE,
	...events,
} );
