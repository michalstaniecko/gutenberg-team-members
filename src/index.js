import { registerBlockType, createBlock } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './team-member';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => {
					const innerBlocks = attributes.images.map(
						( { url, id, alt } ) => {
							return createBlock( 'blocks-course/team-member', {
								alt,
								id,
								url,
							} );
						}
					);
					return createBlock(
						'blocks-course/team-members',
						{
							columns: attributes.columns || 2,
						},
						innerBlocks
					);
				},
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				isMultiBlock: true,
				transform: ( attributes ) => {
					const innerBlocks = attributes.map(
						( { url, id, alt } ) => {
							return createBlock( 'blocks-course/team-member', {
								alt,
								id,
								url,
							} );
						}
					);
					return createBlock(
						'blocks-course/team-members',
						{
							columns:
								attributes.length > 3 ? 3 : attributes.length,
						},
						innerBlocks
					);
				},
			},
		],
	},
} );
