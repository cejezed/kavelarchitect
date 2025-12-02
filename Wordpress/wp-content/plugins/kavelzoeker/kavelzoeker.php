<?php
/*
Plugin Name: Kavelzoeker Wizard
Description: Meerstaps formulier [kavelzoeker] met REST submit, directe matches via Google Sheet via WP-proxy, mailnotificaties, Google Sheet WRITE, en eigen CPT.
Version: 1.4.3
Author: Zwijsen.net
License: GPL2+
*/

if (!defined('ABSPATH')) { exit; }

class Kavelzoeker_Wizard {
  const CPT = 'kavelzoekprofiel';
  // Vul hier je Google Apps Script deployment URL in:
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzI_R9Bm3mx-h1hBLlse2NCIcBkmYR97XuP0yg29LbPKAhk2QMfeoKNIq8t34LwibrV/exec';

  public function __construct() {
    add_action('init',               [$this, 'register_cpt']);
    add_action('init',               [$this, 'register_assets']);
    add_shortcode('kavelzoeker',     [$this, 'shortcode']);
    add_action('rest_api_init',      [$this, 'register_rest_routes']);

    add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
      header('Access-Control-Allow-Origin: *');
      header('Vary: Origin');
      header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
      header('Access-Control-Allow-Headers: Content-Type, Authorization');
      if ($request->get_method() === 'OPTIONS') { status_header(204); return true; }
      return $served;
    }, 10, 4);

    add_action('wp_mail_failed', function($wp_error){
      if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Kavelzoeker wp_mail_failed] '. print_r($wp_error, true));
      }
    });
  }

  public function register_cpt() {
    register_post_type(self::CPT, [
      'labels'      => ['name' => 'Zoekprofielen', 'singular_name' => 'Zoekprofiel'],
      'public'      => false,
      'show_ui'     => true,
      'show_in_menu'=> true,
      'menu_icon'   => 'dashicons-location-alt',
      'supports'    => ['title','custom-fields'],
    ]);
  }

  public function register_assets() {
    $ver = '1.4.3';
    wp_register_style('kavelzoeker-css', plugins_url('assets/kavelzoeker.css', __FILE__), [], $ver);
    wp_register_script('kavelzoeker-js',  plugins_url('assets/kavelzoeker.js',  __FILE__), ['jquery'], $ver, true);
  }

  public function register_rest_routes() {
    register_rest_route('kavelzoeker/v1', '/ping', [
      'methods'  => 'GET',
      'permission_callback' => '__return_true',
      'callback' => function() { return ['ok' => true, 'ts' => time()]; },
    ]);

    register_rest_route('kavelzoeker/v1', '/submit', [
      'methods'  => ['POST', 'OPTIONS'],
      'permission_callback' => '__return_true',
      'callback' => [$this, 'handle_submit_rest'],
    ]);

    register_rest_route('kavelzoeker/v1', '/match', [
      'methods'  => 'GET',
      'permission_callback' => '__return_true',
      'callback' => [$this, 'handle_match_rest'],
    ]);
  }

  public function shortcode($atts = []) {
    $atts = shortcode_atts([
      'type'          => 'allebei',
      'success'       => 'Bedankt! We nemen snel contact met je op.',
      'notify'        => get_option('admin_email'),
      'apps_read_url' => '',
      'pve_link'      => 'https://brikxai.nl/pve/start',
      'intake_link'   => 'https://brikxai.nl/intake',
      'form_id'       => wp_generate_uuid4(),
    ], $atts, 'kavelzoeker');

    wp_enqueue_style('kavelzoeker-css');
    wp_enqueue_script('kavelzoeker-js');

    $privacy_url = function_exists('get_privacy_policy_url') && get_privacy_policy_url()
      ? get_privacy_policy_url()
      : home_url('/privacybeleid');

    $submit_url   = rest_url('kavelzoeker/v1/submit');
    $fallback_url = add_query_arg('rest_route', '/kavelzoeker/v1/submit', home_url('/'));
    $ping_url     = rest_url('kavelzoeker/v1/ping');
    $match_url    = rest_url('kavelzoeker/v1/match');

    $cfg = [
      'url'            => $submit_url,
      'fallbackUrl'    => $fallback_url,
      'pingUrl'        => $ping_url,
      'matchUrl'       => $match_url,
      'successMessage' => $atts['success'],
      'privacyUrl'     => $privacy_url,
      'notify'         => $atts['notify'],
      'appsReadUrl'    => $atts['apps_read_url'],
      'pveLink'        => $atts['pve_link'],
      'intakeLink'     => $atts['intake_link'],
      'formId'         => $atts['form_id'],
    ];
    wp_add_inline_script('kavelzoeker-js', 'window.KAVELZOEKER='. wp_json_encode($cfg) .';', 'before');

    ob_start(); ?>
    <div class="kavelzoeker" data-type="<?php echo esc_attr($atts['type']); ?>" data-form-id="<?php echo esc_attr($atts['form_id']); ?>">
      <form class="kz-form" novalidate autocomplete="off" data-scope="<?php echo esc_attr($atts['form_id']); ?>">
        <p class="kz-intro">Hoe meer je invult, hoe gerichter we kunnen zoeken. Kort invullen mag ook – we helpen je verder in de intake.</p>

        <input type="hidden" name="kz_type" value="<?php echo esc_attr($atts['type']); ?>" />
        <input type="hidden" name="form_id" value="<?php echo esc_attr($atts['form_id']); ?>" />
        <input type="text" name="_maple" class="kz-hp" autocomplete="off" tabindex="-1" aria-hidden="true" hidden />

        <div class="kz-steps">
          <div class="kz-step active" data-step="1">
            <h3>Wat zoek je?</h3>
            <div class="kz-grid">
              <?php if ($atts['type'] !== 'verbouw'): ?>
              <label class="kz-card"><input type="radio" name="doel" value="bouwkavel" required />
                <span><strong>Bouwgrond (kavel)</strong><small>Ik wil een kavel vinden om nieuw te bouwen.</small></span>
              </label><?php endif; ?>
              <?php if ($atts['type'] !== 'kavel'): ?>
              <label class="kz-card"><input type="radio" name="doel" value="verbouw" required />
                <span><strong>Te verbouwen woning</strong><small>Ik zoek een huis dat ik kan (ver)bouwen.</small></span>
              </label><?php endif; ?>
              <?php if ($atts['type'] === 'allebei'): ?>
              <label class="kz-card"><input type="radio" name="doel" value="beide" required />
                <span><strong>Beide opties</strong><small>Laat beide sporen onderzoeken.</small></span>
              </label><?php endif; ?>
            </div>
            <div class="kz-nav"><button type="button" class="kz-next">Volgende</button></div>
          </div>

          <div class="kz-step" data-step="2">
            <h3>Waar en wanneer?</h3>
            <div class="kz-grid">
              <label>Regio / Plaats(en)
                <input type="text" name="regio" placeholder="Bijv. Utrecht, Gooi & Vecht, Gelderland" required autocomplete="off" />
              </label>
              <label>Startmoment
                <select name="start">
                  <option value="binnen_3mnd">Binnen 3 maanden</option>
                  <option value="3_6mnd">3–6 maanden</option>
                  <option value="6_12mnd">6–12 maanden</option>
                  <option value="12plus">12+ maanden</option>
                  <option value="flexibel">Flexibel</option>
                </select>
              </label>
            </div>
            <div class="kz-nav"><button type="button" class="kz-prev">Terug</button><button type="button" class="kz-next">Volgende</button></div>
          </div>

          <div class="kz-step" data-step="3">
            <h3>Budget & omvang</h3>
            <div class="kz-grid">
              <label>Budget (totaal)
                <input type="text" name="budget" placeholder="Bijv. 650.000" inputmode="numeric" autocomplete="off" />
              </label>
              <label class="kz-if-kavel">Min. kaveloppervlakte (m²)
                <input type="number" name="kavel_min" placeholder="Bijv. 400" autocomplete="off" />
              </label>
              <label class="kz-if-verbouw">Gewenste woonopp. (m²)
                <input type="number" name="woonopp" placeholder="Bijv. 180" autocomplete="off" />
              </label>
            </div>
            <div class="kz-nav"><button type="button" class="kz-prev">Terug</button><button type="button" class="kz-next">Volgende</button></div>
          </div>

          <div class="kz-step" data-step="4">
            <h3>Wensen & randvoorwaarden</h3>
            <div class="kz-grid">
              <label>Type woonomgeving
                <select name="omgeving">
                  <option>Vrijstaand/landelijk</option><option>Dorps</option><option>Stedelijk</option><option>Flexibel</option>
                </select>
              </label>
              <label>Must-haves <input type="text" name="must" placeholder="Bijv. water aan/zicht, tuin op zuid, 2 parkeerplekken" autocomplete="off" /></label>
              <label>No-go's <input type="text" name="nogo" placeholder="Bijv. drukke weg, hoogspanningsmast" autocomplete="off" /></label>
              <label>Opmerkingen <textarea name="opmerkingen" rows="3" placeholder="Bijv. voorkeur voor modern/tijdloos, vergunningsvrij willen uitbouwen, etc."></textarea></label>
            </div>
            <div class="kz-nav"><button type="button" class="kz-prev">Terug</button><button type="button" class="kz-next">Volgende</button></div>
          </div>

          <div class="kz-step" data-step="5">
            <h3>Contactgegevens</h3>
            <div class="kz-grid">
              <label>Naam <span class="kz-req">*</span>
                <input type="text" name="naam" required aria-required="true" autocomplete="off" />
              </label>
              <label>E-mail <span class="kz-req">*</span>
                <input type="email" name="email" required aria-required="true" autocomplete="off" />
              </label>
              <label>Telefoon <input type="tel" name="tel" autocomplete="off" /></label>
              <label class="kz-check">
                <input type="checkbox" name="toestemming" required aria-required="true" />
                <span>Ik ga akkoord met het opslaan van mijn gegevens volgens de <a href="<?php echo esc_url($privacy_url); ?>" target="_blank" rel="noopener">privacyverklaring</a>.</span>
              </label>
            </div>
            <div class="kz-nav"><button type="button" class="kz-prev">Terug</button><button type="submit" class="kz-submit">Profiel versturen</button></div>
          </div>
        </div>

        <div class="kz-result" hidden></div>
      </form>
    </div>
    <?php
    return ob_get_clean();
  }

  public function handle_submit_rest(\WP_REST_Request $request) {
    $hp = (string) $request->get_param('_maple');
    if (strlen(trim($hp)) > 0) {
      return new \WP_REST_Response(['success' => false, 'data' => ['message' => 'Spam/honeypot geactiveerd.']], 400);
    }

    $fields = ['form_id','doel','regio','start','budget','kavel_min','woonopp','omgeving','must','nogo','opmerkingen','naam','email','tel','notify'];
    $data   = [];
    foreach ($fields as $f) {
      $val = (string) $request->get_param($f);
      $data[$f] = ($f==='email') ? sanitize_email($val) : (($f==='opmerkingen') ? sanitize_textarea_field($val) : sanitize_text_field($val));
    }

    if (defined('WP_DEBUG') && WP_DEBUG) { error_log('[Kavelzoeker submit] data: '. print_r($data, true)); }

    if (empty($data['doel']) || empty($data['regio']) || empty($data['naam']) || empty($data['email'])) {
      return new \WP_REST_Response(['success'=>false,'data'=>['message'=>'Vul alle verplichte velden in.']], 400);
    }

    $title = sprintf('%s – %s (%s)', $data['naam'], $data['doel'], date_i18n('Y-m-d H:i'));
    $post_id = wp_insert_post(['post_type'=>self::CPT,'post_status'=>'publish','post_title'=>$title], true);
    if (is_wp_error($post_id)) {
      return new \WP_REST_Response(['success'=>false,'data'=>['message'=>'Kon niet opslaan.']], 500);
    }
    foreach ($data as $k=>$v) update_post_meta($post_id, $k, $v);

    // Mail naar beheerder
    $to_admin = is_email($data['notify']) ? $data['notify'] : get_option('admin_email');
    $body_admin = "Nieuwe inzending via Kavelzoeker:\n\n".print_r($data, true)."\n\nBekijk in WP: ".admin_url('post.php?post='.$post_id.'&action=edit');
    $headers = [];
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    if (is_email($data['email'])) {
      $headers[] = 'Reply-To: ' . $data['email'];
    }
    $sent_admin = wp_mail($to_admin, 'Nieuwe kavel/verbouw zoekopdracht', $body_admin, $headers);

    if (defined('WP_DEBUG') && WP_DEBUG) { error_log('[Kavelzoeker wp_mail admin] to='.$to_admin.' sent='.($sent_admin?'true':'false')); }

    // Bevestigingsmail naar inzender
    $sent_user = false;
    if (is_email($data['email'])) {
      $body_user = "Hallo " . $data['naam'] . ",\n\n";
      $body_user .= "Bedankt voor je inzending! We hebben je gegevens goed ontvangen en gaan er meteen mee aan de slag.\n\n";
      $body_user .= "Je zoekopdracht:\n";
      $body_user .= "- Wat: " . $data['doel'] . "\n";
      $body_user .= "- Regio: " . $data['regio'] . "\n";
      $body_user .= "- Budget: " . ($data['budget'] ? '€ ' . $data['budget'] : 'niet ingevuld') . "\n";
      $body_user .= "- Start: " . $data['start'] . "\n\n";
      $body_user .= "We nemen snel contact met je op!\n\n";
      $body_user .= "Met vriendelijke groet,\n" . get_bloginfo('name');
      
      $headers_user = ['Content-Type: text/plain; charset=UTF-8'];
      $sent_user = wp_mail($data['email'], 'Bedankt voor je inzending!', $body_user, $headers_user);
      
      if (defined('WP_DEBUG') && WP_DEBUG) { error_log('[Kavelzoeker wp_mail user] to='.$data['email'].' sent='.($sent_user?'true':'false')); }
    }

    // Stuur naar Google Sheet
    $this->send_to_google_sheet($data);

    do_action('kavelzoeker_after_submit', $data, $post_id);

    return new \WP_REST_Response([
      'success'=>true,
      'data'=>['message'=>'Bedankt! We nemen snel contact met je op.','emailSent'=>(bool)($sent_admin||$sent_user)]
    ], 200);
  }

  public function send_to_google_sheet($data) {
    // Controleer of URL is ingevuld
    if (strpos(self::GOOGLE_SHEET_URL, 'YOUR_DEPLOYMENT_ID') !== false) {
      if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Kavelzoeker Google Sheet] Deployment URL niet geconfigureerd - sla over');
      }
      return;
    }

    $payload = json_encode($data);
    
    $response = wp_remote_post(self::GOOGLE_SHEET_URL, [
      'method'   => 'POST',
      'timeout'  => 10,
      'headers'  => ['Content-Type' => 'application/json'],
      'body'     => $payload,
    ]);

    if (is_wp_error($response)) {
      if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Kavelzoeker Google Sheet] Error: ' . $response->get_error_message());
      }
    } else {
      $code = wp_remote_retrieve_response_code($response);
      $body = wp_remote_retrieve_body($response);
      if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Kavelzoeker Google Sheet] code=' . $code . ' body=' . substr($body, 0, 200));
      }
    }
  }

  public function handle_match_rest(\WP_REST_Request $req) {
    $apps = esc_url_raw($req->get_param('appsUrl'));
    if (empty($apps)) {
      return new \WP_REST_Response(['matches'=>[], 'note'=>'appsUrl ontbreekt'], 200);
    }
    $args = [
      'regio'    => sanitize_text_field($req->get_param('regio')),
      'minPrijs' => (int)$req->get_param('minPrijs'),
      'maxPrijs' => (int)$req->get_param('maxPrijs'),
      'minM2'    => (int)$req->get_param('minM2'),
      'doel'     => sanitize_text_field($req->get_param('doel')),
    ];
    $url = add_query_arg(array_filter($args, function($v){ return $v !== null && $v !== ''; }), $apps);

    $res = wp_remote_get($url, ['timeout'=>10]);
    if (is_wp_error($res)) {
      if (defined('WP_DEBUG') && WP_DEBUG) { error_log('[Kavelzoeker match proxy] wp_remote_get error: '. $res->get_error_message()); }
      return new \WP_REST_Response(['matches'=>[], 'note'=>'proxy_failed'], 200);
    }
    $code = wp_remote_retrieve_response_code($res);
    $body = wp_remote_retrieve_body($res);
    if ($code !== 200 || empty($body)) {
      if (defined('WP_DEBUG') && WP_DEBUG) { error_log('[Kavelzoeker match proxy] upstream code='.$code.' body_len='.strlen($body)); }
      return new \WP_REST_Response(['matches'=>[], 'note'=>'upstream_empty'], 200);
    }
    $json = json_decode($body, true);
    if (!is_array($json)) $json = ['matches'=>[]];

    return new \WP_REST_Response($json, 200);
  }
}

new Kavelzoeker_Wizard();