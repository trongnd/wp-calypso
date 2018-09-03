/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import MobileBackToSidebar from 'components/mobile-back-to-sidebar';
import ReaderMain from 'components/reader-main';
import { requestCommunityEvents } from 'state/community-events/actions';

class CommunityEvents extends React.Component {
	constructor( props ) {
		super( props );
		// TODO - maybe add item for this section in Reader to wordpress-com.js
		this.props.requestCommunityEvents();
	}

	render() {
		const { translate } = this.props;
		return (
			<ReaderMain className="community-events">
				<DocumentHead title={ 'Community Events' } />
				<MobileBackToSidebar>
					<h1>{ translate( 'Streams' ) }</h1>
				</MobileBackToSidebar>
				<h2 className="community-events__header">{ translate( 'Community Events' ) }</h2>
			</ReaderMain>
		);
	}
}

export default connect(
	null,
	{
		requestCommunityEvents,
	}
)( localize( CommunityEvents ) );
