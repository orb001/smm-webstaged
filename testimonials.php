<?php
/* Testimonial custom post type, ACF field group, and the [testimonials]
   shortcode. Drop [testimonials] into a Divi Code module to render the
   white testimonial card as a draggable carousel. Add testimonials from
   Testimonials -> Add New in wp-admin; client name is the post title. */

add_action( 'init', 'divi_child_register_testimonial_cpt' );
function divi_child_register_testimonial_cpt() {
	register_post_type( 'testimonial', array(
		'labels' => array(
			'name'          => 'Testimonials',
			'singular_name' => 'Testimonial',
			'add_new_item'  => 'Add New Testimonial',
			'edit_item'     => 'Edit Testimonial',
			'all_items'     => 'All Testimonials',
			'menu_name'     => 'Testimonials',
		),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'menu_icon'    => 'dashicons-format-quote',
		'supports'     => array( 'title', 'page-attributes' ),
	) );
}

add_action( 'acf/init', 'divi_child_register_testimonial_fields' );
function divi_child_register_testimonial_fields() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group( array(
		'key'      => 'group_testimonial_details',
		'title'    => 'Testimonial Details',
		'fields'   => array(
			array(
				'key'   => 'field_testimonial_headline',
				'label' => 'Headline',
				'name'  => 'headline',
				'type'  => 'text',
				'instructions' => 'Short bold line shown above the quote, e.g. "Solid Mass Media are fantastic at ad management."',
			),
			array(
				'key'   => 'field_testimonial_quote',
				'label' => 'Quote',
				'name'  => 'quote',
				'type'  => 'textarea',
				'rows'  => 4,
			),
			array(
				'key'          => 'field_testimonial_company',
				'label'        => 'Client Company',
				'name'         => 'company',
				'type'         => 'text',
				'instructions' => "Client's name goes in the post title above.",
			),
		),
		'location' => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'testimonial',
				),
			),
		),
	) );
}

add_shortcode( 'testimonials', 'divi_child_testimonials_shortcode' );
function divi_child_testimonials_shortcode( $atts ) {
	$atts = shortcode_atts( array(
		'autoplay' => 'false',
		'interval' => '6000',
		'dots'     => 'true',
	), $atts, 'testimonials' );

	$query = new WP_Query( array(
		'post_type'      => 'testimonial',
		'posts_per_page' => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
	) );

	if ( ! $query->have_posts() ) {
		wp_reset_postdata();
		return '';
	}

	$autoplay = filter_var( $atts['autoplay'], FILTER_VALIDATE_BOOLEAN ) ? 'true' : 'false';
	$dots     = filter_var( $atts['dots'], FILTER_VALIDATE_BOOLEAN ) ? 'true' : 'false';
	$interval = absint( $atts['interval'] );

	if ( $interval < 1000 ) {
		$interval = 6000;
	}

	ob_start();
	?>
	<div class="testimonials-carousel" data-autoplay="<?php echo esc_attr( $autoplay ); ?>" data-interval="<?php echo esc_attr( $interval ); ?>" data-dots="<?php echo esc_attr( $dots ); ?>" role="region" aria-roledescription="carousel" aria-label="Client testimonials">
		<div class="testimonials-track">
			<?php
			while ( $query->have_posts() ) :
				$query->the_post();

				$headline = get_field( 'headline' );
				$quote    = get_field( 'quote' );
				$company  = get_field( 'company' );
				$name     = get_the_title();

				$attribution = trim( $name . ( $company ? ', ' . $company : '' ) );
				?>
				<div class="testimonial-slide">
					<div class="testimonial-card">
						<div class="testimonial-stars" aria-label="5 out of 5 stars">
							<?php echo str_repeat( '★', 5 ); ?>
						</div>
						<div class="testimonial-copy">
							<div class="testimonial-quote-mark" aria-hidden="true">&#8220;</div>
							<?php if ( $headline ) : ?>
								<p class="testimonial-headline"><?php echo esc_html( $headline ); ?></p>
							<?php endif; ?>
							<?php if ( $quote ) : ?>
								<p class="testimonial-quote"><?php echo esc_html( $quote ); ?></p>
							<?php endif; ?>
							<?php if ( $attribution ) : ?>
								<p class="testimonial-attribution">&mdash; <?php echo esc_html( $attribution ); ?></p>
							<?php endif; ?>
						</div>
					</div>
				</div>
			<?php endwhile; ?>
		</div>
		<?php if ( 'true' === $dots && $query->post_count > 1 ) : ?>
			<div class="testimonials-dots"></div>
		<?php endif; ?>
	</div>
	<?php
	wp_reset_postdata();

	return ob_get_clean();
}
