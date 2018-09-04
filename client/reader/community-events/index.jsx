/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { times } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import CardHeading from 'components/card-heading';
import CompactCard from 'components/card/compact';
import DocumentHead from 'components/data/document-head';
import EventPlaceholder from './placeholder';
import ExternalLink from 'components/external-link';
import Main from 'components/main';
import MobileBackToSidebar from 'components/mobile-back-to-sidebar';
import { recordAction, recordGaEvent, recordTrack } from 'reader/stats';
import { requestCommunityEvents } from 'state/community-events/actions';
import SectionHeader from 'components/section-header';

// TODO - maybe add item for this section in Reader to wordpress-com.js
// TODO - add WP News and input so the user can search for other locations

const debug = debugFactory( 'calypso:reader:community-events' );

class CommunityEvents extends React.Component {
	static propTypes = {
		events: PropTypes.array,
		error: PropTypes.string,
		isLoading: PropTypes.bool,
	};

	static defaultProps = {
		isLoading: true,
	};

	componentDidMount() {
		this.props.requestCommunityEvents();
	}

	recordAction = () => {
		recordAction( 'clicked_event_details_on_community_event' );
		recordGaEvent( 'Clicked Event Details on Community Event' );
		recordTrack( 'calypso_reader_event_details_on_community_event_clicked' );
	};

	renderLoading() {
		const { events } = this.props;
		const count = events ? events.length : 2;

		return times( count, i => {
			return <EventPlaceholder key={ 'community-event-placeholder-' + i } />;
		} );
	}

	renderNoEvents() {
		debug( 'Error loading events' );
		const { translate } = this.props;

		return (
			<CompactCard className="community-events__sorry">
				{ translate( "Sorry, there don't seem to be any events in your" + ' area right now.' ) }
			</CompactCard>
		);
	}

	renderEvents() {
		const { events } = this.props;

		return events.map( ( event, index ) => {
			const {
				title = '',
				meetup = '',
				formatted_date = '',
				formatted_time = '',
				location: { location } = '',
				url = '',
			} = event;

			return (
				<CompactCard key={ index }>
					{ title && (
						<CardHeading tagName="h2" size={ 16 }>
							{ title }
						</CardHeading>
					) }
					<div className="community-events__event">
						<div className="community-events__event-details">
							<strong>{ meetup }</strong>
							<div className="community-events__event-date">
								{ formatted_date } { formatted_time }
							</div>
							{ location }
						</div>
						{ url && (
							<ExternalLink
								icon={ true }
								href={ url }
								className="community-events__event-link"
								onClick={ this.recordAction }
							>
								{ this.props.translate( 'Event details' ) }
							</ExternalLink>
						) }
					</div>
				</CompactCard>
			);
		} );
	}

	render() {
		const { events, isLoading, translate } = this.props;
		let content = '';

		if ( isLoading ) {
			content = this.renderLoading();
		} else {
			content = events ? this.renderEvents() : this.renderNoEvents();
		}

		return (
			<Main className="community-events">
				<DocumentHead title={ 'Community Events' } />
				<MobileBackToSidebar>
					<h1>{ translate( 'Streams' ) }</h1>
				</MobileBackToSidebar>
				<SectionHeader label={ translate( 'Community Events Near You' ) } />
				<div className="community-events__events">{ content }</div>
			</Main>
		);
	}
}

const mapStateToProps = state => ( {
	events: state.communityEvents.events || [],
	isLoading: state.communityEvents.isLoading,
	error: state.communityEvents.error,
} );

const mapDispatchToProps = {
	requestCommunityEvents,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( localize( CommunityEvents ) );
