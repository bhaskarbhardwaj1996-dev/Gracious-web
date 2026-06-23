<?php
/**
 * Index — Fallback Template
 * Required by WordPress. Specific templates (front-page.php, page.php) take precedence.
 *
 * @package gracious-smiles
 */

get_header();
?>

<section class="gs-section">
    <div class="gs-container">
        <p><?php esc_html_e( 'Content coming soon.', 'gracious-smiles' ); ?></p>
    </div>
</section>

<?php
get_footer();