<?php
$APP_VERSION = "v4.0.0-TRUE-IDM"; // Multi-Part & Auto Stitching

// ==========================================
// 1. BYPASS SESSION LOCK (REAL-TIME PROGRESS)
// ==========================================
if (isset($_GET['action']) && $_GET['action'] == 'progress' && isset($_GET['id'])) {
    $file_progress = __DIR__ . '/uploads/.progress_' . preg_replace('/[^a-zA-Z0-9]/', '', $_GET['id']) . '.json';
    if (file_exists($file_progress)) {
        header('Content-Type: application/json');
        echo file_get_contents($file_progress);
    } else {
        echo json_encode(['total' => 0, 'downloaded' => 0, 'speed' => 0]);
    }
    exit;
}

if (isset($_GET['action']) && $_GET['action'] == 'cancel' && isset($_GET['id'])) {
    $cancel_file = __DIR__ . '/uploads/.cancel_' . preg_replace('/[^a-zA-Z0-9]/', '', $_GET['id']);
    file_put_contents($cancel_file, "1");
    echo json_encode(["status" => "cancelled"]);
    exit;
}

session_start();

@ini_set('max_execution_time', '0');
@ini_set('max_input_time', '0');
@ini_set('memory_limit', '-1');
@set_time_limit(0);
error_reporting(0); 

// ==========================================
// 2. KONFIGURASI UTAMA
// ==========================================
$PASSWORD_AKSES = "rahasia123";
$DIREKTORI_UPLOAD = __DIR__ . '/uploads/';
$GITHUB_RAW_URL = "https://raw.githubusercontent.com/modora-official/mdup/main/index.php";

if (!file_exists($DIREKTORI_UPLOAD)) mkdir($DIREKTORI_UPLOAD, 0755, true);

if (isset($_GET['action']) && $_GET['action'] == 'logout') {
    session_destroy(); header("Location: index.php"); exit;
}

if (isset($_POST['password'])) {
    if ($_POST['password'] === $PASSWORD_AKSES) $_SESSION['login'] = true;
    else $error_msg = "Password salah!";
}

$pesan = "";

function formatSizeUnits($bytes) {
    if ($bytes >= 1073741824) return number_format($bytes / 1073741824, 2) . ' GB';
    elseif ($bytes >= 1048576) return number_format($bytes / 1048576, 2) . ' MB';
    elseif ($bytes >= 1024) return number_format($bytes / 1024, 2) . ' KB';
    elseif ($bytes > 1) return $bytes . ' bytes';
    elseif ($bytes == 1) return $bytes . ' byte';
    else return '0 bytes';
}

if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['file']) && isset($_SESSION['login'])) {
    $file_to_delete = basename($_GET['file']);
    $target_delete = $DIREKTORI_UPLOAD . $file_to_delete;
    if (file_exists($target_delete) && is_file($target_delete)) {
        unlink($target_delete);
        $pesan = "<div class='alert success'><i class='fa-solid fa-trash-can'></i> File dihapus.</div>";
    }
}

function getFilenameFromUrl($url, $header) {
    if (preg_match('/filename="(.*?)"/', $header, $matches)) return $matches[1];
    $basename = basename(parse_url($url, PHP_URL_PATH));
    return $basename ? $basename : 'downloaded_' . time();
}

if (isset($_SESSION['login']) && isset($_POST['action_type'])) {
    header('Content-Type: application/json');
    $custom_name = trim($_POST['custom_name']);
    
    // LOGIKA URL LEECHING
    if ($_POST['action_type'] == 'url' && !empty($_POST['url_download'])) {
        $url_input = trim($_POST['url_download']);
        $url_target = $url_input;
        $progress_id = isset($_POST['progress_id']) ? preg_replace('/[^a-zA-Z0-9]/', '', $_POST['progress_id']) : 'default';
        $progress_file = $DIREKTORI_UPLOAD . '.progress_' . $progress_id . '.json';
        $cancel_file = $DIREKTORI_UPLOAD . '.cancel_' . $progress_id;
        $cookie_file = $DIREKTORI_UPLOAD . '.cookie_' . $progress_id . '.txt'; 
        
        // Ekstraktor MediaFire
        if (strpos($url_input, 'mediafire.com') !== false) {
            $ch_mf = curl_init($url_input);
            curl_setopt($ch_mf, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch_mf, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch_mf, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch_mf, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            curl_setopt($ch_mf, CURLOPT_COOKIEJAR, $cookie_file);
            $html = curl_exec($ch_mf);
            curl_close($ch_mf);
            
            if (preg_match('/href="([^"]+)"[^>]*id="downloadButton"/i', $html, $matches) || preg_match('/id="downloadButton"[^>]*href="([^"]+)"/i', $html, $matches)) {
                $url_target = $matches[1];
            } else if (preg_match('/\bhref="([^"]+)"/i', $html, $matches_all)) {
                preg_match_all('/href="([^"]+)"/i', $html, $links);
                foreach($links[1] as $link) {
                    if(strpos($link, 'download') !== false && strpos($link, 'mediafire.com') !== false) {
                        $url_target = $link; break;
                    }
                }
            }
        }

        // Ambil Header
        $ch = curl_init($url_target);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        if (file_exists($cookie_file)) curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file);
        
        $header_data = curl_exec($ch);
        $final_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        $total_size = curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
        curl_close($ch);

        $nama_file = !empty($custom_name) ? $custom_name : getFilenameFromUrl($final_url, $header_data);
        $nama_file = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $nama_file);
        if(strpos($url_input, '.apk') !== false && strpos($nama_file, '.apk') === false) $nama_file .= '.apk';

        $target_file = $DIREKTORI_UPLOAD . $nama_file;
        
        // ==================================================
        // TRUE IDM ARCHITECTURE: TULIS KE PART TERPISAH
        // ==================================================
        if ($total_size > 1048576) { 
            $threads = 16; // 16 Jalur Terpisah untuk menghindari Disk Bottleneck
            $chunk_size = ceil($total_size / $threads);
            $mh = curl_multi_init();
            
            $ch_array = [];
            $part_files = [];
            $fps = [];
            $downloaded = 0;
            $last_update = 0;
            $last_downloaded = 0;
            
            for ($i = 0; $i < $threads; $i++) {
                $start = $i * $chunk_size;
                $end = ($i == $threads - 1) ? $total_size - 1 : ($start + $chunk_size - 1);
                if ($start > $total_size) break;
                
                $part_name = $target_file . '.part' . $i;
                $part_files[] = $part_name;
                $fps[$i] = fopen($part_name, 'w'); // Tulis ke file part masing-masing
                
                $ch = curl_init($final_url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
                curl_setopt($ch, CURLOPT_TCP_FASTOPEN, 1);
                curl_setopt($ch, CURLOPT_RANGE, "$start-$end"); 
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
                if (file_exists($cookie_file)) curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file);
                
                curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($handle, $data) use ($fps, $i, &$downloaded, $progress_file, $cancel_file, &$last_update, &$last_downloaded, $total_size) {
                    if (file_exists($cancel_file)) return 0; 
                    
                    $len = strlen($data);
                    fwrite($fps[$i], $data); // Tulis berurutan, tanpa fseek
                    $downloaded += $len;
                    
                    $now = microtime(true);
                    if ($now - $last_update >= 1.5 || $downloaded >= $total_size) {
                        $speed = 0;
                        $time_diff = $now - $last_update;
                        if ($time_diff > 0 && $last_update > 0) $speed = ($downloaded - $last_downloaded) / $time_diff;
                        file_put_contents($progress_file, json_encode(['total' => $total_size, 'downloaded' => $downloaded, 'speed' => $speed]));
                        $last_update = $now;
                        $last_downloaded = $downloaded;
                    }
                    return $len;
                });
                
                curl_multi_add_handle($mh, $ch);
                $ch_array[] = $ch;
            }
            
            session_write_close();
            
            $active = null;
            do { $mrc = curl_multi_exec($mh, $active); } while ($mrc == CURLM_CALL_MULTI_PERFORM);
            
            while ($active && $mrc == CURLM_OK) {
                if (curl_multi_select($mh) == -1) usleep(10000);
                do { $mrc = curl_multi_exec($mh, $active); } while ($mrc == CURLM_CALL_MULTI_PERFORM);
                if (file_exists($cancel_file)) break;
            }
            
            $sukses = true;
            foreach ($ch_array as $index => $ch) { 
                if(curl_errno($ch) && !file_exists($cancel_file)) $sukses = false;
                curl_multi_remove_handle($mh, $ch); 
                curl_close($ch); 
                fclose($fps[$index]); // Tutup semua file part
            }
            curl_multi_close($mh);
            
            // LOGIKA AUTO-STITCHING (Gabungkan semua part jadi 1)
            if ($sukses && !file_exists($cancel_file)) {
                $final_fp = fopen($target_file, 'w');
                foreach ($part_files as $pf) {
                    if (file_exists($pf)) {
                        $chunk = fopen($pf, 'r');
                        stream_copy_to_stream($chunk, $final_fp);
                        fclose($chunk);
                        unlink($pf); // Hapus part setelah digabung
                    }
                }
                fclose($final_fp);
            }
            
        } else {
            // FALLBACK SINGLE THREAD
            $fp = fopen($target_file, 'w+');
            $ch = curl_init($final_url);
            curl_setopt($ch, CURLOPT_FILE, $fp);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
            if (file_exists($cookie_file)) curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file);
            
            $last_update = 0; $last_downloaded = 0;
            curl_setopt($ch, CURLOPT_NOPROGRESS, false);
            curl_setopt($ch, CURLOPT_PROGRESSFUNCTION, function($res, $d_size, $downloaded, $u_size, $uploaded) use ($progress_file, $cancel_file, &$last_update, &$last_downloaded) {
                if (file_exists($cancel_file)) return 1;
                $now = microtime(true);
                if ($now - $last_update >= 1.0 || $downloaded == $d_size) {
                    $speed = 0; $time_diff = $now - $last_update;
                    if ($time_diff > 0 && $last_update > 0) $speed = ($downloaded - $last_downloaded) / $time_diff;
                    if ($d_size > 0) file_put_contents($progress_file, json_encode(['total' => $d_size, 'downloaded' => $downloaded, 'speed' => $speed]));
                    $last_update = $now; $last_downloaded = $downloaded;
                }
                return 0; 
            });
            
            session_write_close(); 
            $sukses = curl_exec($ch);
            curl_close($ch);
            fclose($fp);
        }

        // Pembersihan
        @unlink($cookie_file);
        
        if (file_exists($cancel_file)) {
            if (isset($part_files)) {
                foreach ($part_files as $pf) { @unlink($pf); } // Hapus semua part kalau dibatalkan
            }
            @unlink($cancel_file); @unlink($progress_file); @unlink($target_file);
            echo json_encode(["status" => "error", "msg" => "Proses dibatalkan! File dibersihkan."]);
            exit;
        }

        @unlink($progress_file);
        
        if ($sukses && filesize($target_file) > 1000) { 
            echo json_encode(["status" => "success", "msg" => "Sempurna! File sukses didownload dan dijahit via True-IDM Engine."]);
        } else {
            @unlink($target_file); 
            echo json_encode(["status" => "error", "msg" => "Gagal! Akses diblokir oleh sistem pelindung MediaFire."]);
        }
        exit;
    } 
    // LOCAL UPLOAD
    else if ($_POST['action_type'] == 'local' && isset($_FILES['file_upload'])) {
        $nama_asli = basename($_FILES['file_upload']['name']);
        $ext = pathinfo($nama_asli, PATHINFO_EXTENSION);
        $nama_file = !empty($custom_name) ? $custom_name . (strpos($custom_name, '.') === false && !empty($ext) ? ".$ext" : "") : $nama_asli;
        $nama_file = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $nama_file);
        
        if (move_uploaded_file($_FILES['file_upload']['tmp_name'], $DIREKTORI_UPLOAD . $nama_file)) {
            echo json_encode(["status" => "success", "msg" => "File lokal berhasil diunggah!"]);
        } else {
            echo json_encode(["status" => "error", "msg" => "Gagal menyimpan file."]);
        }
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MODORA - 3D Advanced Uploader <?php echo $APP_VERSION; ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --bg-base: #0b0c10; --bg-card: #14161c; --text-primary: #e2e8f0; --text-secondary: #94a3b8; --accent-primary: #00f2fe; --accent-hover: #4facfe; --accent-danger: #ff4b4b; --shadow-out: 8px 8px 16px #08090b, -8px -8px 16px #1a1d25; --shadow-in: inset 4px 4px 8px #08090b, inset -4px -4px 8px #1a1d25; }
        
        /* FIX OUTLINE PUTIH SAAT DI KLIK */
        * { outline: none !important; -webkit-tap-highlight-color: transparent !important; }
        *:focus, *:active { outline: none !important; box-shadow: none; }
        button:focus, input:focus, a:focus { outline: none !important; }

        body { font-family: 'Segoe UI', system-ui, Roboto, sans-serif; background-color: var(--bg-base); color: var(--text-primary); margin: 0; padding: 40px 20px; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 850px; }
        .card { background-color: var(--bg-card); padding: 35px; border-radius: 20px; box-shadow: var(--shadow-out); margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.02); }
        .header-section { text-align: center; margin-bottom: 35px; }
        .header-section i { font-size: 48px; background: linear-gradient(135deg, #00f2fe, #4facfe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; display: inline-block; filter: drop-shadow(0 4px 8px rgba(0, 242, 254, 0.3)); }
        .header-section h2 { margin: 0; font-weight: 700; font-size: 26px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .version-badge { font-size: 11px; background: linear-gradient(135deg, #00f2fe, #4facfe); color: #0b0c10; padding: 3px 10px; border-radius: 20px; font-weight: 800; box-shadow: 0 0 10px rgba(0, 242, 254, 0.4); }
        .form-group { margin-bottom: 20px; position: relative; }
        .input-icon { position: absolute; left: 18px; top: 16px; color: var(--text-secondary); }
        
        input[type="password"], input[type="url"], input[type="text"], input[type="file"] { 
            width: 100%; padding: 15px 16px 15px 50px; background-color: var(--bg-base); border: 1px solid transparent; color: var(--text-primary); border-radius: 12px; box-sizing: border-box; font-size: 15px; box-shadow: var(--shadow-in); transition: 0.3s; 
        }
        input[type="file"] { padding-left: 20px; padding-top: 12px; }
        
        /* Modifikasi hover & focus biar gak ada garis putih */
        input:focus { box-shadow: inset 2px 2px 5px #08090b, inset -2px -2px 5px #1a1d25, 0 0 8px rgba(0, 242, 254, 0.3) !important; border-color: transparent !important; }
        
        .btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.2); border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; display: inline-flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 15px; transition: 0.2s; box-shadow: 0 6px 15px rgba(0, 242, 254, 0.3); text-decoration:none; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 242, 254, 0.4); }
        .btn:active { transform: translateY(2px); }
        
        .btn-outline { background: var(--bg-card); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-out); margin-bottom:0; }
        .btn-danger { background: linear-gradient(135deg, #ff4b4b, #ff0000); padding: 10px 14px; width: auto; font-size: 14px; margin-bottom:0;}
        .btn-danger-large { background: linear-gradient(135deg, #2a0808, #ff4b4b); box-shadow: var(--shadow-out); color: #fff; margin-top: 20px; margin-bottom: 0; padding: 14px; }
        .btn-action { background: var(--bg-base); padding: 10px 14px; width: auto; font-size: 14px; box-shadow: var(--shadow-out); color: var(--accent-primary); margin-bottom:0;}
        .alert { padding: 16px; border-radius: 12px; margin-bottom: 25px; font-size: 15px; display: flex; gap: 12px; box-shadow: var(--shadow-in); }
        .alert.error { color: var(--accent-danger); border: 1px solid rgba(255, 75, 75, 0.1); }
        .alert.success { color: var(--status-success); border: 1px solid rgba(16, 185, 129, 0.1); }
        .progress-container { display: none; margin-top: 25px; padding: 20px; border-radius: 15px; background: var(--bg-card); box-shadow: var(--shadow-in); border: 1px solid rgba(255,255,255,0.02); }
        .progress-bar-bg { width: 100%; background-color: var(--bg-base); border-radius: 10px; height: 16px; overflow: hidden; box-shadow: inset 2px 2px 5px #0a0b0d; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #00f2fe, #4facfe); width: 0%; transition: width 0.3s ease; box-shadow: 0 0 10px rgba(0, 242, 254, 0.5); }
        .progress-stats { display: flex; justify-content: space-between; margin-top: 15px; font-size: 14px; color: var(--text-secondary); font-weight: 500; }
        .stats-highlight { color: var(--accent-primary); font-weight: bold; font-size: 16px; }
        table { width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-top: 10px; }
        th, td { padding: 15px; text-align: left; }
        th { color: var(--text-secondary); font-weight: 600; text-transform: uppercase; font-size: 12px; }
        tr { background-color: var(--bg-base); box-shadow: var(--shadow-out); border-radius: 12px; transition: 0.2s; }
        td:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
        td:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
        .table-responsive { overflow-x: auto; padding-bottom: 15px; }
        @media (max-width: 768px) {
            .progress-stats { flex-direction: column; align-items: center; gap: 8px; }
            .btn-action, .btn-danger { display: block; width: 100%; text-align: center; margin-bottom: 8px; }
            .action-td { display: flex; flex-direction: column; gap: 5px; }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="card">
        <?php if (!isset($_SESSION['login'])): ?>
            <div class="header-section">
                <i class="fa-solid fa-cube"></i>
                <h2>MODORA Uploader <span class="version-badge"><?php echo $APP_VERSION; ?></span></h2>
            </div>
            <?php if (isset($error_msg)) echo "<div class='alert error'><i class='fa-solid fa-circle-exclamation'></i> <div>$error_msg</div></div>"; ?>
            <form method="POST">
                <div class="form-group">
                    <i class="fa-solid fa-lock input-icon"></i>
                    <input type="password" name="password" placeholder="Masukan Sandi Akses" required>
                </div>
                <button type="submit" class="btn"><i class="fa-solid fa-arrow-right-to-bracket"></i> Buka Sistem</button>
            </form>
        <?php else: ?>
            <div class="header-section">
                <i class="fa-solid fa-satellite-dish"></i>
                <h2>VPS Engine Modora <span class="version-badge"><?php echo $APP_VERSION; ?></span></h2>
            </div>

            <?php if (!empty($pesan)) echo $pesan; ?>

            <div style="display: flex; gap: 15px; margin-bottom: 25px;">
                <button class="btn btn-outline" onclick="toggleForm('urlForm')" style="width:50%;"><i class="fa-solid fa-link"></i> URL Leeching</button>
                <button class="btn btn-outline" onclick="toggleForm('localForm')" style="width:50%;"><i class="fa-solid fa-hard-drive"></i> Local Upload</button>
            </div>

            <form id="urlForm" onsubmit="urlLeechWithProgress(event)">
                <input type="hidden" name="action_type" value="url">
                <div class="form-group">
                    <i class="fa-solid fa-link input-icon"></i>
                    <input type="url" name="url_download" placeholder="Masukkan Target URL (MediaFire / Direct)" required>
                </div>
                <div class="form-group">
                    <i class="fa-solid fa-pen-to-square input-icon"></i>
                    <input type="text" name="custom_name" placeholder="Nama File Kustom (ex: modora_file.apk)">
                </div>
                <button type="submit" class="btn" id="btnUrlSubmit"><i class="fa-solid fa-cloud-arrow-down"></i> Tarik True IDM Mode</button>
            </form>

            <form id="localForm" style="display: none;">
                <input type="hidden" name="action_type" value="local">
                <div class="form-group">
                    <input type="file" name="file_upload" id="fileInput" required>
                </div>
                <div class="form-group">
                    <i class="fa-solid fa-pen-to-square input-icon"></i>
                    <input type="text" name="custom_name" id="customName" placeholder="Nama File Kustom (Opsional)">
                </div>
                <button type="button" class="btn" id="btnLocalSubmit" onclick="uploadLocalWithProgress()"><i class="fa-solid fa-upload"></i> Unggah File Lokal</button>
            </form>
            
            <div class="progress-container" id="progressContainer">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" id="progressBar"></div>
                </div>
                <div class="progress-stats">
                    <span id="speedDisplay"><i class="fa-solid fa-gauge-high"></i> Memisahkan Part File...</span>
                    <span class="stats-highlight" id="percentDisplay">0%</span>
                    <span id="sizeDisplay">0 MB / 0 MB</span>
                </div>
                
                <button type="button" class="btn btn-danger-large" onclick="cancelProcess()"><i class="fa-solid fa-xmark"></i> Batalkan Proses</button>
            </div>

            <script>
                let activeXhr = null; let activeProgressId = null; let activePollInterval = null; let activeFetchController = null;

                function toggleForm(formId) {
                    document.getElementById('urlForm').style.display = formId === 'urlForm' ? 'block' : 'none';
                    document.getElementById('localForm').style.display = formId === 'localForm' ? 'block' : 'none';
                    document.getElementById('progressContainer').style.display = 'none';
                }

                function formatSpeed(bps) {
                    if (bps >= 1073741824) return (bps / 1073741824).toFixed(2) + " GB/s";
                    if (bps >= 1048576) return (bps / 1048576).toFixed(2) + " MB/s";
                    if (bps >= 1024) return (bps / 1024).toFixed(2) + " KB/s";
                    return Math.round(bps) + " B/s";
                }

                function cancelProcess() {
                    let cancelled = false;
                    if (activeXhr) { activeXhr.abort(); activeXhr = null; cancelled = true; }
                    if (activeFetchController) { activeFetchController.abort(); activeFetchController = null; }
                    if (activeProgressId) { fetch('?action=cancel&id=' + activeProgressId); activeProgressId = null; cancelled = true; }
                    if (activePollInterval) { clearInterval(activePollInterval); activePollInterval = null; }

                    if (cancelled) {
                        document.getElementById('progressContainer').style.display = 'none';
                        const btnUrl = document.getElementById('btnUrlSubmit');
                        const btnLocal = document.getElementById('btnLocalSubmit');
                        if(btnUrl) { btnUrl.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Tarik True IDM Mode'; btnUrl.disabled = false; }
                        if(btnLocal) { btnLocal.innerHTML = '<i class="fa-solid fa-upload"></i> Unggah File Lokal'; btnLocal.disabled = false; }
                        alert("Proses berhasil dibatalkan!");
                    }
                }

                async function urlLeechWithProgress(event) {
                    event.preventDefault();
                    const form = document.getElementById('urlForm');
                    const formData = new FormData(form);
                    
                    activeProgressId = 'prog_' + Math.random().toString(36).substr(2, 9);
                    formData.append('progress_id', activeProgressId);

                    const btn = document.getElementById('btnUrlSubmit');
                    const origText = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengekstrak Cookie & Memecah 16 Part...';
                    btn.disabled = true;

                    document.getElementById('progressContainer').style.display = 'block';
                    document.getElementById('progressBar').style.width = '0%';
                    document.getElementById('percentDisplay').innerText = '0%';
                    document.getElementById('speedDisplay').innerHTML = '<i class="fa-solid fa-microchip"></i> Menghindari Disk Thrashing...';
                    document.getElementById('sizeDisplay').innerText = "Menunggu data...";

                    activePollInterval = setInterval(async () => {
                        try {
                            if (!activeProgressId) return;
                            let res = await fetch('?action=progress&id=' + activeProgressId);
                            let data = await res.json();
                            
                            if (data.total > 0) {
                                btn.innerHTML = '<i class="fa-solid fa-bolt"></i> IDM Engine Aktif...';
                                let percent = Math.round((data.downloaded / data.total) * 100);
                                document.getElementById('progressBar').style.width = percent + '%';
                                document.getElementById('percentDisplay').innerText = percent + '%';
                                
                                if (percent >= 100) {
                                    document.getElementById('speedDisplay').innerHTML = '<i class="fa-solid fa-layer-group"></i> Menjahit File Jadi Satu...';
                                } else {
                                    document.getElementById('speedDisplay').innerHTML = '<i class="fa-solid fa-rocket"></i> ' + formatSpeed(data.speed);
                                }
                                
                                let loadedMB = (data.downloaded / 1048576).toFixed(2);
                                let totalMB = (data.total / 1048576).toFixed(2);
                                document.getElementById('sizeDisplay').innerText = loadedMB + " MB / " + totalMB + " MB";
                            }
                        } catch(e) {}
                    }, 1500);

                    activeFetchController = new AbortController();
                    
                    try {
                        let response = await fetch(window.location.href, { method: 'POST', body: formData, signal: activeFetchController.signal });
                        let result = await response.json();
                        clearInterval(activePollInterval);
                        alert(result.msg);
                        window.location.reload();
                    } catch(err) {
                        clearInterval(activePollInterval);
                        if (err.name !== 'AbortError') {
                            alert("Gagal memproses file! Kemungkinan IP VPS sudah kena limit MediaFire.");
                            btn.innerHTML = origText; btn.disabled = false;
                            document.getElementById('progressContainer').style.display = 'none';
                        }
                    }
                }

                function uploadLocalWithProgress() {
                    const fileInput = document.getElementById('fileInput');
                    if(fileInput.files.length === 0) { alert('Pilih file dulu!'); return; }
                    const btn = document.getElementById('btnLocalSubmit');
                    const origText = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengunggah...';
                    btn.disabled = true;

                    const formData = new FormData();
                    formData.append("action_type", "local");
                    formData.append("file_upload", fileInput.files[0]);
                    formData.append("custom_name", document.getElementById('customName').value);

                    document.getElementById('progressContainer').style.display = 'block';
                    
                    activeXhr = new XMLHttpRequest();
                    let startTime = new Date().getTime(); let previousLoaded = 0;

                    activeXhr.upload.addEventListener("progress", function(e) {
                        if (e.lengthComputable) {
                            let percent = Math.round((e.loaded / e.total) * 100);
                            document.getElementById('progressBar').style.width = percent + '%';
                            document.getElementById('percentDisplay').innerText = percent + '%';

                            let currentTime = new Date().getTime();
                            let timeDiff = (currentTime - startTime) / 1000;
                            if(timeDiff > 0.5) {
                                let loadedDiff = e.loaded - previousLoaded;
                                let speedBps = loadedDiff / timeDiff;
                                document.getElementById('speedDisplay').innerHTML = '<i class="fa-solid fa-gauge-high"></i> ' + formatSpeed(speedBps);
                                startTime = currentTime; previousLoaded = e.loaded;
                            }

                            let totalMB = (e.total / 1048576).toFixed(2);
                            let loadedMB = (e.loaded / 1048576).toFixed(2);
                            document.getElementById('sizeDisplay').innerText = loadedMB + " MB / " + totalMB + " MB";
                        }
                    }, false);

                    activeXhr.addEventListener("load", function(e) {
                        try {
                            const res = JSON.parse(e.target.responseText); alert(res.msg); window.location.reload();
                        } catch(err) { alert("Upload selesai!"); window.location.reload(); }
                    }, false);
                    activeXhr.addEventListener("abort", function() {
                        btn.innerHTML = origText; btn.disabled = false; document.getElementById('progressContainer').style.display = 'none';
                    }, false);

                    activeXhr.open("POST", window.location.href, true);
                    activeXhr.send(formData);
                }
            </script>
        <?php endif; ?>
    </div>

    <?php if (isset($_SESSION['login'])): ?>
    <div class="card">
        <div class="header-section" style="margin-bottom: 25px; text-align: left; display: flex; align-items: center; gap: 15px;">
            <i class="fa-solid fa-server" style="font-size: 32px; margin:0; color: var(--accent-primary);"></i>
            <h2 style="font-size: 20px; margin:0;">Direktori File Server</h2>
        </div>
        
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Nama File</th>
                        <th>Ukuran</th>
                        <th style="text-align: right;">Aksi & Link</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $files = array_diff(scandir($DIREKTORI_UPLOAD), array('.', '..'));
                    $file_count = 0;
                    foreach ($files as $file) {
                        $path = $DIREKTORI_UPLOAD . $file;
                        // Sembunyikan progress, cookie, dan part file dari tabel
                        if (is_file($path) && strpos($file, '.progress_') === false && strpos($file, '.cancel_') === false && strpos($file, '.cookie_') === false && strpos($file, '.part') === false) { 
                            $file_count++;
                            $size = formatSizeUnits(filesize($path));
                            
                            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
                            $host = $_SERVER['HTTP_HOST'];
                            $dir = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
                            $file_url = $protocol . "://" . $host . $dir . "/uploads/" . rawurlencode($file);

                            echo "<tr>
                                    <td><i class='fa-solid fa-file-code' style='color: var(--accent-primary); margin-right: 12px;'></i> <strong>" . htmlspecialchars($file) . "</strong></td>
                                    <td style='color: var(--text-secondary);'>$size</td>
                                    <td class='action-td' style='text-align: right;'>
                                        <button class='btn btn-action' onclick='navigator.clipboard.writeText(\"$file_url\"); alert(\"Link Tersalin: $file_url\");' title='Salin Direct Link'>
                                            <i class='fa-solid fa-copy'></i> Salin
                                        </button>
                                        <a href='?action=delete&file=" . urlencode($file) . "' class='btn btn-danger' onclick='return confirm(\"Yakin hapus dari VPS?\")' title='Hapus'>
                                            <i class='fa-solid fa-trash'></i>
                                        </a>
                                    </td>
                                  </tr>";
                        }
                    }
                    if ($file_count == 0) {
                        echo "<tr><td colspan='3' style='text-align:center; padding:30px; color:var(--text-secondary);'><i class='fa-solid fa-box-open' style='font-size:30px; margin-bottom:10px; display:block;'></i> Storage Kosong</td></tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 35px; display: flex; flex-wrap: wrap; gap: 15px;">
            <a href="?action=update" class="btn btn-outline" style="flex: 1; min-width: 200px;"><i class="fa-solid fa-code-merge"></i> Sinkronisasi Repo</a>
            <a href="?action=logout" class="btn btn-outline" style="flex: 1; min-width: 200px; border-color: rgba(255, 75, 75, 0.3); color: var(--accent-danger);"><i class="fa-solid fa-power-off"></i> Tutup Sesi</a>
        </div>
    </div>
    <?php endif; ?>
</div>

</body>
</html>
