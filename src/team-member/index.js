import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType( 'blocks-course/team-member', {
	title: __( 'Team member', 'team-members' ),
	description: __( 'A team member', 'team-member' ),
	icon: 'admin-users',
	parent: [ 'blocks-course/team-members' ],
	edit: () => <p>edit</p>,
	save: () => <p>save</p>,
} );
