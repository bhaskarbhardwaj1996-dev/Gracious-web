/**
 * Navigation — Mobile Menu Toggle + Sticky Header
 * Gracious Smiles Theme
 * Vanilla JS | No dependencies
 */

( function () {

    'use strict';

    // -------------------------------------------------------------------------
    // Sticky Header
    // -------------------------------------------------------------------------

    const header = document.querySelector( '.gs-site-header' );

    if ( header ) {
        const scrollThreshold = 80;

        const handleScroll = function () {
            if ( window.scrollY > scrollThreshold ) {
                header.classList.add( 'is-scrolled' );
            } else {
                header.classList.remove( 'is-scrolled' );
            }
        };

        // Run on load in case page is refreshed mid-scroll
        handleScroll();

        window.addEventListener( 'scroll', handleScroll, { passive: true } );
    }

    // -------------------------------------------------------------------------
    // Mobile Menu Toggle
    // -------------------------------------------------------------------------

    const toggleBtn  = document.querySelector( '.gs-navbar__toggle' );
    const mobileMenu = document.querySelector( '.gs-mobile-menu' );

    if ( toggleBtn && mobileMenu ) {

        toggleBtn.addEventListener( 'click', function () {
            const isOpen = mobileMenu.classList.contains( 'is-open' );

            mobileMenu.classList.toggle( 'is-open' );
            toggleBtn.classList.toggle( 'is-active' );

            // Accessibility: update aria-expanded
            toggleBtn.setAttribute( 'aria-expanded', ! isOpen );

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        } );

        // Close menu on nav link click (SPA-style navigation feel)
        const mobileLinks = mobileMenu.querySelectorAll( 'a' );
        mobileLinks.forEach( function ( link ) {
            link.addEventListener( 'click', function () {
                mobileMenu.classList.remove( 'is-open' );
                toggleBtn.classList.remove( 'is-active' );
                toggleBtn.setAttribute( 'aria-expanded', 'false' );
                document.body.style.overflow = '';
            } );
        } );

        // Close menu on Escape key
        document.addEventListener( 'keydown', function ( e ) {
            if ( e.key === 'Escape' && mobileMenu.classList.contains( 'is-open' ) ) {
                mobileMenu.classList.remove( 'is-open' );
                toggleBtn.classList.remove( 'is-active' );
                toggleBtn.setAttribute( 'aria-expanded', 'false' );
                document.body.style.overflow = '';
                toggleBtn.focus();
            }
        } );

    }

} )();

/**
 * Services — Active Row Highlight
 * Adds persistent .is-active class on click for desktop hover-state enhancement.
 * Degrades cleanly on mobile (pure CSS hover handles touch).
 */
( function () {
    'use strict';

    const rows = document.querySelectorAll( '[data-gs-service]' );

    if ( ! rows.length ) return;

    rows.forEach( function ( row ) {
        row.addEventListener( 'click', function ( e ) {
            // Only apply active state — do not prevent navigation
            rows.forEach( function ( r ) { r.classList.remove( 'is-active' ); } );
            row.classList.add( 'is-active' );
        } );

        // Keyboard accessibility — treat Enter/Space as activation
        row.addEventListener( 'keydown', function ( e ) {
            if ( e.key === 'Enter' || e.key === ' ' ) {
                rows.forEach( function ( r ) { r.classList.remove( 'is-active' ); } );
                row.classList.add( 'is-active' );
            }
        } );
    } );

} )();

/**
 * Why Choose Us — IntersectionObserver Panel Sync
 * Highlights the active panel and syncs the left progress nav.
 * Uses IntersectionObserver — no scroll listeners, GPU-friendly.
 */
( function () {
    'use strict';

    const panels  = document.querySelectorAll( '[data-gs-why-panel]' );
    const navBtns = document.querySelectorAll( '[data-gs-why-nav]' );

    if ( ! panels.length || ! navBtns.length ) return;

    // Sync active state between panels and nav buttons
    function gsWhySetActive( index ) {
        panels.forEach( function ( panel ) {
            panel.classList.remove( 'is-active' );
        } );
        navBtns.forEach( function ( btn ) {
            btn.classList.remove( 'is-active' );
        } );

        const activePanel = document.querySelector( '[data-gs-why-panel="' + index + '"]' );
        const activeBtn   = document.querySelector( '[data-gs-why-nav="' + index + '"]' );

        if ( activePanel ) activePanel.classList.add( 'is-active' );
        if ( activeBtn )   activeBtn.classList.add( 'is-active' );
    }

    // IntersectionObserver — triggers when panel is 40% visible
    const observer = new IntersectionObserver( function ( entries ) {
        entries.forEach( function ( entry ) {
            if ( entry.isIntersecting ) {
                const index = entry.target.getAttribute( 'data-gs-why-panel' );
                gsWhySetActive( index );
            }
        } );
    }, {
        root:       null,
        rootMargin: '0px 0px -40% 0px',
        threshold:  0.2,
    } );

    panels.forEach( function ( panel ) {
        observer.observe( panel );
    } );

    // Nav button click — scroll to the corresponding panel
    navBtns.forEach( function ( btn ) {
        btn.addEventListener( 'click', function () {
            const index       = btn.getAttribute( 'data-gs-why-nav' );
            const targetPanel = document.querySelector( '[data-gs-why-panel="' + index + '"]' );

            if ( targetPanel ) {
                targetPanel.scrollIntoView( {
                    behavior: 'smooth',
                    block:    'center',
                } );
            }

            gsWhySetActive( index );
        } );
    } );

} )();

/**
 * Testimonials — Scroll Reveal
 * Lightweight IntersectionObserver reveal for [data-gs-reveal] elements.
 * No dependencies. Respects prefers-reduced-motion.
 *
 * @package gracious-smiles
 */
( function () {
    'use strict';

    // Bail if reduced motion is preferred — CSS already handles static state
    if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) return;

    const revealEls = document.querySelectorAll( '[data-gs-reveal]' );
    if ( ! revealEls.length ) return;

            const observer = new IntersectionObserver(
            function ( entries ) {
                entries.forEach( function ( entry ) {
                    if ( entry.isIntersecting ) {
                        entry.target.classList.add( 'is-visible' );
                        observer.unobserve( entry.target );
                    }
                } );
            },
            {
                root:       null,
                rootMargin: '0px 0px -20px 0px',
                threshold:  0.05,
            }
        );

    revealEls.forEach( function ( el ) {
        observer.observe( el );
    } );

} )();

/**
 * CTA Block — Magnetic Button
 * Subtle cursor-pull on the primary CTA. Mouse-only, motion-respecting.
 * No effect on touch devices or with reduced motion preferred — falls
 * back cleanly to a normal button.
 */
( function () {
    'use strict';

    const magneticEls = document.querySelectorAll( '[data-gs-magnetic]' );
    if ( ! magneticEls.length ) return;

    const prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
    const hasFinePointer       = window.matchMedia( '(pointer: fine)' ).matches;

    if ( prefersReducedMotion || ! hasFinePointer ) return;

    const strength = 10; // max pull in px — restrained, not a SaaS-template lurch

    magneticEls.forEach( function ( el ) {
        el.addEventListener( 'mousemove', function ( e ) {
            const rect = el.getBoundingClientRect();
            const x = ( e.clientX - rect.left - rect.width / 2 ) / rect.width;
            const y = ( e.clientY - rect.top - rect.height / 2 ) / rect.height;

            el.style.transform = 'translate(' + ( x * strength ).toFixed( 2 ) + 'px, ' + ( y * strength ).toFixed( 2 ) + 'px)';
        } );

        el.addEventListener( 'mouseleave', function () {
            el.style.transform = '';
        } );
    } );

} )();

/**
 * Contact Section — Live Clinic Status Badge
 * Shows "Open Now" or "Closed" based on current IST time.
 */
( function () {
    'use strict';

    const statusEl = document.getElementById( 'gs-clinic-status' );
    if ( ! statusEl ) return;

    function gsGetISTTime() {
        const now     = new Date();
        const utc     = now.getTime() + ( now.getTimezoneOffset() * 60000 );
        const ist     = new Date( utc + ( 5.5 * 3600000 ) );
        return {
            day:     ist.getDay(),    // 0 = Sunday
            hours:   ist.getHours(),
            minutes: ist.getMinutes(),
        };
    }

    function gsIsClinicOpen( t ) {
        if ( t.day === 0 ) return false; // Sunday closed
        const time = t.hours * 60 + t.minutes;
        const morningOpen  = 10 * 60 + 30;  // 10:30
        const morningClose = 13 * 60 + 30;  // 13:30
        const eveningOpen  = 16 * 60 + 30;  // 16:30
        const eveningClose = 19 * 60 + 30;  // 19:30
        return (
            ( time >= morningOpen  && time < morningClose ) ||
            ( time >= eveningOpen  && time < eveningClose )
        );
    }

    const t      = gsGetISTTime();
    const isOpen = gsIsClinicOpen( t );

    statusEl.textContent  = isOpen ? 'Open Now' : 'Closed';
    statusEl.className    = 'gs-contact__hours-status ' + ( isOpen ? 'is-open' : 'is-closed' );

} )();


/**
 * Contact Section — Form Validation + Submit Handler
 * Client-side validation with accessible error messaging.
 * Submit sends via fetch to admin-ajax or falls back gracefully.
 */
( function () {
    'use strict';

    const form      = document.getElementById( 'gs-appointment-form' );
    const submitBtn = document.getElementById( 'gs-submit-btn' );
    const statusEl  = document.getElementById( 'gs-form-status' );
    const successEl = document.getElementById( 'gs-contact-success' );

    if ( ! form ) return;

    // --- Validation rules ---

    function gsValidateName( val ) {
        if ( ! val.trim() ) return 'Please enter your full name.';
        if ( val.trim().length < 2 ) return 'Name must be at least 2 characters.';
        return '';
    }

    function gsValidatePhone( val ) {
        const cleaned = val.replace( /[\s\-().+]/g, '' );
        if ( ! val.trim() ) return 'Please enter your phone number.';
        if ( ! /^[0-9]{7,15}$/.test( cleaned ) ) return 'Please enter a valid phone number.';
        return '';
    }

    function gsValidateEmail( val ) {
        if ( ! val.trim() ) return ''; // Optional field
        if ( ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( val.trim() ) ) return 'Please enter a valid email address.';
        return '';
    }

    // --- Show / clear field error ---

    function gsShowFieldError( inputId, errorId, message ) {
        const input = document.getElementById( inputId );
        const error = document.getElementById( errorId );
        if ( ! input || ! error ) return;
        if ( message ) {
            input.classList.add( 'has-error' );
            error.textContent = message;
            input.setAttribute( 'aria-invalid', 'true' );
        } else {
            input.classList.remove( 'has-error' );
            error.textContent = '';
            input.removeAttribute( 'aria-invalid' );
        }
    }

    // --- Live validation on blur ---

    const nameInput  = document.getElementById( 'gs-name' );
    const phoneInput = document.getElementById( 'gs-phone' );
    const emailInput = document.getElementById( 'gs-email' );

    if ( nameInput ) {
        nameInput.addEventListener( 'blur', function () {
            gsShowFieldError( 'gs-name', 'gs-name-error', gsValidateName( nameInput.value ) );
        } );
        nameInput.addEventListener( 'input', function () {
            if ( nameInput.classList.contains( 'has-error' ) ) {
                gsShowFieldError( 'gs-name', 'gs-name-error', gsValidateName( nameInput.value ) );
            }
        } );
    }

    if ( phoneInput ) {
        phoneInput.addEventListener( 'blur', function () {
            gsShowFieldError( 'gs-phone', 'gs-phone-error', gsValidatePhone( phoneInput.value ) );
        } );
        phoneInput.addEventListener( 'input', function () {
            if ( phoneInput.classList.contains( 'has-error' ) ) {
                gsShowFieldError( 'gs-phone', 'gs-phone-error', gsValidatePhone( phoneInput.value ) );
            }
        } );
    }

    if ( emailInput ) {
        emailInput.addEventListener( 'blur', function () {
            gsShowFieldError( 'gs-email', 'gs-email-error', gsValidateEmail( emailInput.value ) );
        } );
    }

    // --- Form submit ---

    form.addEventListener( 'submit', function ( e ) {
        e.preventDefault();

        // Validate all required fields
        const nameError  = gsValidateName( nameInput ? nameInput.value : '' );
        const phoneError = gsValidatePhone( phoneInput ? phoneInput.value : '' );
        const emailError = emailInput ? gsValidateEmail( emailInput.value ) : '';

        gsShowFieldError( 'gs-name',  'gs-name-error',  nameError );
        gsShowFieldError( 'gs-phone', 'gs-phone-error', phoneError );
        gsShowFieldError( 'gs-email', 'gs-email-error', emailError );

        if ( nameError || phoneError || emailError ) {
            // Focus first errored field
            if ( nameError && nameInput )   { nameInput.focus();  return; }
            if ( phoneError && phoneInput ) { phoneInput.focus(); return; }
            if ( emailError && emailInput ) { emailInput.focus(); return; }
            return;
        }

        // Loading state
        submitBtn.classList.add( 'is-loading' );
        submitBtn.setAttribute( 'aria-disabled', 'true' );
        if ( statusEl ) {
            statusEl.textContent = '';
            statusEl.className   = 'gs-contact__status';
        }

        // Build form data
        const data     = new FormData( form );
        const nonce    = form.querySelector( '[name="gs_nonce"]' );
        data.append( 'action', 'gs_appointment_submit' );
        if ( nonce ) data.append( 'nonce', nonce.value );

        // Submit via fetch to WordPress admin-ajax
        fetch( window.gsAjax ? window.gsAjax.url : '/wp-admin/admin-ajax.php', {
            method:      'POST',
            credentials: 'same-origin',
            body:        data,
        } )
        .then( function ( res ) {
            if ( ! res.ok ) throw new Error( 'Network error' );
            return res.json();
        } )
        .then( function ( response ) {
            submitBtn.classList.remove( 'is-loading' );
            submitBtn.removeAttribute( 'aria-disabled' );

            if ( response.success ) {
                // Show success overlay
                form.setAttribute( 'aria-hidden', 'true' );
                if ( successEl ) {
                    successEl.setAttribute( 'aria-hidden', 'false' );
                    successEl.focus();
                }
            } else {
                // Show error message
                if ( statusEl ) {
                    statusEl.textContent = response.data || 'Something went wrong. Please call us directly.';
                    statusEl.classList.add( 'has-error' );
                }
            }
        } )
        .catch( function () {
            submitBtn.classList.remove( 'is-loading' );
            submitBtn.removeAttribute( 'aria-disabled' );
            if ( statusEl ) {
                statusEl.textContent = 'Unable to send. Please call us or try again.';
                statusEl.classList.add( 'has-error' );
            }
        } );

    } );

} )();

/* =============================================================================
   SERVICES PAGE — JS additions
   Append this block to assets/js/main.js
   Vanilla JS only. No jQuery.
   Covers:
     1. Concern navigator tab switching
     2. FAQ accordion
   The existing [data-gs-reveal] scroll observer in main.js
   already handles all reveal animations — no duplication here.
   ============================================================================= */

( function () {

    'use strict';

    /* ------------------------------------------------------------------
       1. CONCERN NAVIGATOR — Tab Switcher
       Tabs: [data-gs-concern] buttons in role=tablist
       Panels: matching role=tabpanel with [hidden] attribute
    ------------------------------------------------------------------ */

    const gsSvcNavInit = function () {

        const tabList = document.querySelector( '.gs-svc-nav__tabs[role="tablist"]' );
        if ( ! tabList ) return;

        const tabs   = Array.from( tabList.querySelectorAll( '.gs-svc-nav__tab' ) );
        const panels = Array.from( document.querySelectorAll( '.gs-svc-nav__panel[role="tabpanel"]' ) );

        const activateTab = function ( tab ) {

            // Deactivate all
            tabs.forEach( function ( t ) {
                t.classList.remove( 'is-active' );
                t.setAttribute( 'aria-selected', 'false' );
            } );

            panels.forEach( function ( p ) {
                p.hidden = true;
                p.classList.remove( 'is-active' );
            } );

            // Activate selected
            tab.classList.add( 'is-active' );
            tab.setAttribute( 'aria-selected', 'true' );

            const targetId = 'panel-' + tab.dataset.gsConcern;
            const targetPanel = document.getElementById( targetId );

            if ( targetPanel ) {
                targetPanel.hidden = false;
                targetPanel.classList.add( 'is-active' );
            }

        };

        tabs.forEach( function ( tab ) {

            tab.addEventListener( 'click', function () {
                activateTab( tab );
            } );

            // Keyboard navigation — arrow keys
            tab.addEventListener( 'keydown', function ( e ) {

                let idx = tabs.indexOf( tab );

                if ( e.key === 'ArrowRight' || e.key === 'ArrowDown' ) {
                    e.preventDefault();
                    idx = ( idx + 1 ) % tabs.length;
                    tabs[ idx ].focus();
                    activateTab( tabs[ idx ] );
                }

                if ( e.key === 'ArrowLeft' || e.key === 'ArrowUp' ) {
                    e.preventDefault();
                    idx = ( idx - 1 + tabs.length ) % tabs.length;
                    tabs[ idx ].focus();
                    activateTab( tabs[ idx ] );
                }

                if ( e.key === 'Home' ) {
                    e.preventDefault();
                    tabs[ 0 ].focus();
                    activateTab( tabs[ 0 ] );
                }

                if ( e.key === 'End' ) {
                    e.preventDefault();
                    tabs[ tabs.length - 1 ].focus();
                    activateTab( tabs[ tabs.length - 1 ] );
                }

            } );

        } );

    };


    /* ------------------------------------------------------------------
       2. FAQ ACCORDION
       Items: [data-gs-faq-item]
       Button: .gs-svc-faq__question  (aria-expanded)
       Answer: .gs-svc-faq__answer    (hidden attribute + max-height)
    ------------------------------------------------------------------ */

    const gsSvcFaqInit = function () {

        const items = Array.from( document.querySelectorAll( '[data-gs-faq-item]' ) );
        if ( ! items.length ) return;

        const closeItem = function ( item ) {

            const btn    = item.querySelector( '.gs-svc-faq__question' );
            const answer = item.querySelector( '.gs-svc-faq__answer' );

            if ( ! btn || ! answer ) return;

            btn.setAttribute( 'aria-expanded', 'false' );
            item.classList.remove( 'is-open' );

            // Animate shut via max-height
            answer.style.maxHeight = answer.scrollHeight + 'px';
            // Force reflow
            answer.offsetHeight; // eslint-disable-line no-unused-expressions
            answer.style.maxHeight = '0';

            answer.addEventListener( 'transitionend', function handler () {
                answer.removeEventListener( 'transitionend', handler );
                answer.hidden = true;
                answer.style.maxHeight = '';
            } );

        };

        const openItem = function ( item ) {

            const btn    = item.querySelector( '.gs-svc-faq__question' );
            const answer = item.querySelector( '.gs-svc-faq__answer' );

            if ( ! btn || ! answer ) return;

            btn.setAttribute( 'aria-expanded', 'true' );
            item.classList.add( 'is-open' );

            answer.hidden = false;
            answer.style.maxHeight = '0';

            // Force reflow then animate open
            answer.offsetHeight; // eslint-disable-line no-unused-expressions
            answer.style.maxHeight = answer.scrollHeight + 'px';

            answer.addEventListener( 'transitionend', function handler () {
                answer.removeEventListener( 'transitionend', handler );
                answer.style.maxHeight = '';  // let CSS take over
            } );

        };

        items.forEach( function ( item ) {

            const btn = item.querySelector( '.gs-svc-faq__question' );
            if ( ! btn ) return;

            btn.addEventListener( 'click', function () {

                const isOpen = item.classList.contains( 'is-open' );

                // Close all open items first
                items.forEach( function ( i ) {
                    if ( i.classList.contains( 'is-open' ) ) {
                        closeItem( i );
                    }
                } );

                // If was closed, open it
                if ( ! isOpen ) {
                    openItem( item );
                }

            } );

        } );

    };


    /* ------------------------------------------------------------------
       3. SMOOTH SCROLL — hero CTA scrolls to concern nav
    ------------------------------------------------------------------ */

    const gsSvcSmoothScrollInit = function () {

        const btn = document.querySelector( '.gs-svc-hero__action-btn[href^="#"]' );
        if ( ! btn ) return;

        btn.addEventListener( 'click', function ( e ) {

            const targetId = btn.getAttribute( 'href' );
            const target   = document.querySelector( targetId );

            if ( ! target ) return;

            e.preventDefault();

            const offset = 80; // header height approx
            const top    = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo( {
                top      : top,
                behavior : window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
                           ? 'auto'
                           : 'smooth',
            } );

        } );

    };


    /* ------------------------------------------------------------------
       INIT — run when DOM is ready
    ------------------------------------------------------------------ */

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', function () {
            gsSvcNavInit();
            gsSvcFaqInit();
            gsSvcSmoothScrollInit();
        } );
    } else {
        gsSvcNavInit();
        gsSvcFaqInit();
        gsSvcSmoothScrollInit();
    }

}() );

/**
 * Contact Page — Clinic Status Badge
 */
( function () {
    'use strict';

    const statusEl = document.getElementById( 'gs-ct-clinic-status' );
    if ( ! statusEl ) return;

    function gsGetIST() {
        const now = new Date();
        const ist = new Date( now.getTime() + ( now.getTimezoneOffset() + 330 ) * 60000 );
        return { day: ist.getDay(), mins: ist.getHours() * 60 + ist.getMinutes() };
    }

    function gsIsOpen( t ) {
        if ( t.day === 0 ) return false;
        return ( t.mins >= 630 && t.mins < 810 ) || ( t.mins >= 990 && t.mins < 1170 );
    }

    const t = gsGetIST();
    statusEl.textContent = gsIsOpen( t ) ? 'Open Now' : 'Closed';
    statusEl.className   = 'gs-ct-info-card__status ' + ( gsIsOpen( t ) ? 'is-open' : 'is-closed' );

} )();


/**
 * Contact Page — Form Validation + Submit
 */
( function () {
    'use strict';

    const form    = document.getElementById( 'gs-ct-appointment-form' );
    const btn     = document.getElementById( 'gs-ct-submit' );
    const status  = document.getElementById( 'gs-ct-status' );
    const success = document.getElementById( 'gs-ct-success' );

    if ( ! form ) return;

    function validate( id, errId, fn ) {
        const el  = document.getElementById( id );
        const err = document.getElementById( errId );
        if ( ! el ) return '';
        const msg = fn( el.value );
        if ( err ) err.textContent = msg;
        el.classList.toggle( 'has-error', !! msg );
        el.setAttribute( 'aria-invalid', msg ? 'true' : 'false' );
        return msg;
    }

    function vName( v )  { return ! v.trim() ? 'Please enter your name.' : v.trim().length < 2 ? 'Name is too short.' : ''; }
    function vPhone( v ) { const c = v.replace( /[\s\-().+]/g, '' ); return ! v.trim() ? 'Please enter your phone number.' : ! /^[0-9]{7,15}$/.test( c ) ? 'Please enter a valid number.' : ''; }
    function vEmail( v ) { return v.trim() && ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( v.trim() ) ? 'Please enter a valid email.' : ''; }

    [ ['gs-ct-name', 'gs-ct-name-err', vName], ['gs-ct-phone', 'gs-ct-phone-err', vPhone], ['gs-ct-email', 'gs-ct-email-err', vEmail] ].forEach( function( cfg ) {
        const el = document.getElementById( cfg[0] );
        if ( ! el ) return;
        el.addEventListener( 'blur',  function() { validate( cfg[0], cfg[1], cfg[2] ); } );
        el.addEventListener( 'input', function() { if ( el.classList.contains('has-error') ) validate( cfg[0], cfg[1], cfg[2] ); } );
    } );

    form.addEventListener( 'submit', function( e ) {
        e.preventDefault();

        const e1 = validate( 'gs-ct-name',  'gs-ct-name-err',  vName  );
        const e2 = validate( 'gs-ct-phone', 'gs-ct-phone-err', vPhone );
        const e3 = validate( 'gs-ct-email', 'gs-ct-email-err', vEmail );

        if ( e1 ) { document.getElementById('gs-ct-name').focus();  return; }
        if ( e2 ) { document.getElementById('gs-ct-phone').focus(); return; }
        if ( e3 ) { document.getElementById('gs-ct-email').focus(); return; }

        btn.classList.add('is-loading');
        btn.setAttribute('aria-disabled','true');
        if ( status ) { status.textContent = ''; status.className = 'gs-ct-form__status'; }

        const data = new FormData( form );
        data.append( 'action', 'gs_appointment_submit' );

        fetch( window.gsAjax ? window.gsAjax.url : '/wp-admin/admin-ajax.php', {
            method: 'POST', credentials: 'same-origin', body: data
        })
        .then( function(r) { if (!r.ok) throw new Error('Network'); return r.json(); })
        .then( function(res) {
            btn.classList.remove('is-loading');
            btn.removeAttribute('aria-disabled');
            if ( res.success ) {
                form.setAttribute('aria-hidden','true');
                if ( success ) { success.setAttribute('aria-hidden','false'); success.focus(); }
            } else {
                if ( status ) { status.textContent = res.data || 'Something went wrong. Please call us directly.'; status.classList.add('has-error'); }
            }
        })
        .catch( function() {
            btn.classList.remove('is-loading');
            btn.removeAttribute('aria-disabled');
            if ( status ) { status.textContent = 'Unable to send. Please call us directly.'; status.classList.add('has-error'); }
        });
    });

} )();

( function () {
    const track = document.getElementById( 'gs-trust-track' );
    if ( ! track ) return;

    // If user prefers reduced motion, CSS already handles fallback — bail.
    if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) return;

    // Pause animation when tab is hidden (battery/perf)
    document.addEventListener( 'visibilitychange', function () {
        track.style.animationPlayState = document.hidden ? 'paused' : 'running';
    } );
} )();