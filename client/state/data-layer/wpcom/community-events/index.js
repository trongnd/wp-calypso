/** @format */

/**
 * Internal dependencies
 */
import { COMMUNITY_EVENTS_REQUEST } from 'state/action-types';
import { communityEventsReceive } from 'state/community-events/actions';
import { dispatchRequestEx } from 'state/data-layer/wpcom-http/utils';
import { errorNotice } from 'state/notices/actions';
import { http } from 'state/data-layer/wpcom-http/actions';

/**
 * Transform the API response into consumable data
 *
 * @param {Object} data returned from API
 * @returns {Object} array of events
 */
const apiTransformer = data => data.events;

/**
 * Dispatch a request to fetch community events
 *
 * @param {Object} action Redux action
 * @returns {Object} original action
 */
const fetchEvents = action =>
	http(
		{
			method: 'GET',
			apiVersion: 'v2',
			path: '/community-events',
		},
		action
	);

const handleSuccess = ( action, events ) => communityEventsReceive( events );

const announceFailure = () => errorNotice( `Sorry, could not retrieve events.` );

export default {
	[ COMMUNITY_EVENTS_REQUEST ]: [
		dispatchRequestEx( {
			fetch: fetchEvents,
			onSuccess: handleSuccess,
			onError: announceFailure,
			fromApi: apiTransformer,
		} ),
	],
};
