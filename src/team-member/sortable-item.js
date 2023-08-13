// eslint-disable-next-line import/no-extraneous-dependencies
import { useSortable } from '@dnd-kit/sortable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSS } from '@dnd-kit/utilities';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

export default function SortableItem( props ) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable( { id: props.id } );

	const style = {
		transform: CSS.Transform.toString( transform ),
		transition,
	};

	return (
		<li
			ref={ setNodeRef }
			style={ style }
			{ ...attributes }
			{ ...listeners }
			className={
				props.selectedLink === props.index ? 'is-selected' : ''
			}
		>
			<button
				aria-label={ __( 'Edit social link', 'team-members' ) }
				onClick={ () => props.setSelectedLink( props.index ) }
			>
				<Icon icon={ props.icon } />
			</button>
		</li>
	);
}
