/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import MobileBackToSidebar from 'components/mobile-back-to-sidebar';
import ReaderMain from 'components/reader-main';

class CommunityEvents extends React.Component {
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

export default localize( CommunityEvents );
