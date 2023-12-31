import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';

registerBlockType( 'blocks-course/team-member', {
	title: __( 'Team member', 'team-members' ),
	description: __( 'A team member', 'team-member' ),
	icon: 'admin-users',
	parent: [ 'blocks-course/team-members' ],
	supports: {
		reusable: false,
		html: false,
	},
	attributes: {
		name: {
			type: 'string',
			source: 'html',
			selector: 'h4',
		},
		bio: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		id: {
			type: 'number',
		},
		alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
			default: '',
		},
		url: {
			type: 'string',
			source: 'attribute',
			attribute: 'src',
			selector: 'img',
			default: '',
		},
		socialLinks: {
			type: 'array',
			default: [],
			source: 'query',
			selector: '.wp-block-blocks-course-team-member-social-links ul li',
			query: {
				icon: {
					source: 'attribute',
					attribute: 'data-icon',
				},
				link: {
					selector: 'a',
					source: 'attribute',
					attribute: 'href',
				},
			},
		},
	},
	edit: Edit,
	save: Save,
} );
