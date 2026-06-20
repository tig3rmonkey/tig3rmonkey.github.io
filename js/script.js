/**
 * BlackHat.nz — script.js
 *
 * 1. Terminal background: scrolling hacking tool commands drawn on <canvas>
 * 2. Alert banner: slides in after load, dismissible
 */
(function () {
  'use strict';

  /* ============================================================
     Terminal content
     Each block: first element = command, rest = output lines.
     All commands and output are accurate to the real tools.
     ============================================================ */

  var BLOCKS = [

    /* ---- Nmap ---- */
    [
      'nmap -sV -p- -Pn 10.10.14.23',
      'Starting Nmap 7.94 ( https://nmap.org )',
      'Nmap scan report for 10.10.14.23',
      'Host is up (0.087s latency).',
      'Not shown: 65529 filtered tcp ports (no-response)',
      'PORT      STATE  SERVICE      VERSION',
      '22/tcp    open   ssh          OpenSSH 8.9p1 Ubuntu 3ubuntu0.6',
      '80/tcp    open   http         Apache httpd 2.4.52 ((Ubuntu))',
      '443/tcp   open   ssl/http     Apache httpd 2.4.52',
      '445/tcp   open   netbios-ssn  Samba smbd 4.6.2',
      '3306/tcp  open   mysql        MySQL 8.0.31',
      '8080/tcp  open   http-proxy   Squid http proxy 5.7',
      'Service detection performed.',
      'Nmap done: 1 IP address (1 host up) scanned in 143.21 seconds'
    ],

    /* ---- Hydra ---- */
    [
      'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.14.23 -t 4',
      'Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak',
      '[WARNING] Many SSH configurations limit the number of parallel tasks,',
      '[WARNING] it is recommended to set the tasks to 4 via -t 4',
      '[DATA] max 4 tasks per 1 server, overall 4 tasks, 14344399 login tries',
      '[DATA] attacking ssh://10.10.14.23:22/',
      '[STATUS] 64.00 tries/min, 64 tries in 00:01h, 14344335 left',
      '[STATUS] 58.33 tries/min, 175 tries in 00:03h, 14344224 left',
      '[22][ssh] host: 10.10.14.23   login: admin   password: Password123!',
      '1 of 1 target successfully completed, 1 valid password found',
      'Hydra (https://github.com/vanhauser-thc/thc-hydra) finished.'
    ],

    /* ---- ssh-audit ---- */
    [
      'ssh-audit 10.10.14.23',
      '# general',
      '(gen) banner: SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6',
      '(gen) software: OpenSSH 8.9p1',
      '(gen) compatibility: OpenSSH 7.4+, Dropbear SSH 2018.76+',
      '# key exchange algorithms',
      '(kex) curve25519-sha256                 -- [info] available since OpenSSH 6.5',
      '(kex) ecdh-sha2-nistp256                -- [warn] using weak elliptic curves',
      '(kex) diffie-hellman-group14-sha256      -- [warn] 2048-bit modulus only 112 bits',
      '# host-key algorithms',
      '(key) ecdsa-sha2-nistp256               -- [fail] using weak elliptic curves',
      '(key) ssh-rsa                           -- [fail] using broken SHA-1 hash algorithm',
      '# encryption algorithms',
      '(enc) chacha20-poly1305@openssh.com     -- [info] available since OpenSSH 6.5',
      '(enc) aes256-ctr                        -- [info] available since OpenSSH 3.7',
      '# mac algorithms',
      '(mac) hmac-sha2-256                     -- [info] available since OpenSSH 5.9',
      '(mac) hmac-sha1                         -- [fail] using broken SHA-1 hash algorithm',
      'Critical: 2  High: 0  Medium: 3  Low: 0'
    ],

    /* ---- Gobuster ---- */
    [
      'gobuster dir -u http://10.10.14.23 -w /usr/share/wordlists/dirb/common.txt -x php,txt',
      '===============================================================',
      'Gobuster v3.6',
      'by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)',
      '===============================================================',
      '[+] Url:         http://10.10.14.23',
      '[+] Method:      GET',
      '[+] Threads:     10',
      '[+] Wordlist:    /usr/share/wordlists/dirb/common.txt',
      '[+] Extensions:  php,txt',
      '===============================================================',
      '/index.php       (Status: 200) [Size: 4521]',
      '/login.php       (Status: 200) [Size: 1834]',
      '/admin           (Status: 301) [Size: 314] [--> /admin/]',
      '/backup          (Status: 200) [Size: 8921]',
      '/config.php      (Status: 403) [Size: 287]',
      '/.git            (Status: 301) [Size: 308] [--> /.git/]',
      '/upload          (Status: 301) [Size: 310] [--> /upload/]',
      '/robots.txt      (Status: 200) [Size: 23]',
      'Progress: 18456 / 18460 (99.98%)'
    ],

    /* ---- Impacket secretsdump ---- */
    [
      'impacket-secretsdump -just-dc-ntlm CORP/administrator:Password123!@10.10.14.1',
      'Impacket v0.11.0 - Copyright 2023 Fortra',
      '',
      '[*] Dumping Domain Credentials (domain\\uid:rid:lmhash:nthash)',
      '[*] Using the DRSUAPI method to get NTDS.DIT secrets',
      'CORP\\Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::',
      'CORP\\krbtgt:502:aad3b435b51404eeaad3b435b51404ee:a0c6f3f8c5f8e3b4d9e7c2f1b8d5a9e2:::',
      'CORP\\jsmith:1103:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::',
      'CORP\\svc_sql:1104:aad3b435b51404eeaad3b435b51404ee:e3d0516ab18a32d5bc29f0bb38d7ac79:::',
      'CORP\\svc_backup:1105:aad3b435b51404eeaad3b435b51404ee:4e966c490c4a7f09e6d4feeb65b47bc6:::',
      '[*] Cleaning up...'
    ],

    /* ---- Enum4linux ---- */
    [
      'enum4linux -a 10.10.14.23',
      'Starting enum4linux v0.9.1',
      '==========================',
      '|   Target Information   |',
      '==========================',
      'Target ........... 10.10.14.23',
      'RID Range ........ 500-550,1000-1050',
      '[+] Got domain/workgroup name: CORP',
      "[+] Server allows null sessions: YES",
      '=============================================',
      '|   Share Enumeration on 10.10.14.23       |',
      '=============================================',
      '[+] IPC$      Mapping: OK     Browsing: N/A',
      '[+] ADMIN$    Mapping: DENIED Browsing: N/A',
      '[+] C$        Mapping: DENIED Browsing: N/A',
      '[+] SYSVOL    Mapping: OK     Browsing: OK',
      '[+] NETLOGON  Mapping: OK     Browsing: OK',
      'user:[Administrator] rid:[0x1f4]',
      'user:[Guest]         rid:[0x1f5]',
      'user:[jsmith]        rid:[0x44f]',
      'user:[svc_sql]       rid:[0x450]',
      'enum4linux complete on 10.10.14.23'
    ],

    /* ---- Responder (MDNS NTLM poisoning) ---- */
    [
      'responder -I eth0 -wF',
      '  .----.-----.-----.-----.-----.-----.--|  |.-----.----.',
      "  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|",
      '  |__| |_____|_____|   __|_____|__|__|_____||_____|__|',
      '                   |__|',
      '       NBT-NS, LLMNR & MDNS Responder 3.1.4.0',
      '',
      '[+] Poisoners:  LLMNR, NBT-NS, MDNS, DNS, DHCP',
      '[+] Servers:    HTTP, HTTPS, SMB, LDAP, SQL, FTP, IMAP, POP3',
      '[+] Listening for events...',
      '',
      '[MDNS]  Poisoned answer sent to 10.10.14.50 for name FILESERVER.local',
      '[SMB]   NTLMv2-SSP Client   : 10.10.14.50',
      '[SMB]   NTLMv2-SSP Username : CORP\\jsmith',
      '[SMB]   NTLMv2-SSP Hash     : jsmith::CORP:4a1b2c3d4e5f6a7b:A1B2C3D4E5F6:0101000000...'
    ],

    /* ---- SQLMap ---- */
    [
      'sqlmap -u "http://10.10.14.23/index.php?id=1" --dbs --batch',
      '        ___',
      '       __H__',
      ' ___ ___[(]_____ ___ ___  {1.7.12#stable}',
      "|_ -| . [,]     | .'| . |",
      '|___|_  ["]_|_|_|__,|  _|   https://sqlmap.org',
      '',
      '[*] testing connection to the target URL',
      '[*] checking if the target is protected by WAF/IPS',
      "[*] GET parameter 'id' is dynamic",
      "[*] heuristic test shows parameter 'id' might be injectable (DBMS: MySQL)",
      '',
      'sqlmap identified the following injection point(s):',
      'Parameter: id (GET)',
      '    Type: boolean-based blind',
      '    Payload: id=1 AND 5337=5337',
      '    Type: time-based blind',
      '    Payload: id=1 AND SLEEP(5)--',
      '    Type: UNION query',
      '    Payload: id=1 UNION ALL SELECT NULL,NULL,NULL--',
      '',
      'available databases [4]:',
      '[*] information_schema',
      '[*] mysql',
      '[*] performance_schema',
      '[*] webapp_db'
    ],

    /* ---- BloodHound (bloodhound-python) ---- */
    [
      'bloodhound-python -u jsmith -p "Password123!" -d corp.local -ns 10.10.14.1 -c all',
      'INFO: Found AD domain: corp.local',
      'INFO: Getting TGT for user',
      'INFO: Connecting to LDAP server: dc01.corp.local',
      'INFO: Kerberos auth to LDAP failed, trying NTLM',
      'INFO: Found 1 domains',
      'INFO: Found 2 domain controllers',
      'INFO: Found 45 computers',
      'INFO: Found 312 users',
      'INFO: Found 1024 groups',
      'INFO: Found 89 ACLs',
      'INFO: Found 8 GPOs',
      'INFO: Done in 00M 28S',
      'INFO: Compressing output into 20240115143022_BloodHound.zip'
    ],

    /* ---- Masscan ---- */
    [
      'masscan -p1-65535 10.10.14.0/24 --rate=10000 -e eth0',
      'Starting masscan 1.3.2 at 2024-01-15 14:30:22 GMT',
      'Initiating SYN Stealth Scan',
      'Scanning 256 hosts [65535 ports/host]',
      'Discovered open port 22/tcp   on 10.10.14.23',
      'Discovered open port 80/tcp   on 10.10.14.24',
      'Discovered open port 443/tcp  on 10.10.14.24',
      'Discovered open port 3389/tcp on 10.10.14.30',
      'Discovered open port 445/tcp  on 10.10.14.23',
      'Discovered open port 8080/tcp on 10.10.14.24',
      'Discovered open port 1433/tcp on 10.10.14.35',
      'Discovered open port 5985/tcp on 10.10.14.23',
      'Discovered open port 389/tcp  on 10.10.14.1',
      'masscan done in 00:00:23.'
    ]

  ];

  /* ============================================================
     Canvas terminal animation
     ============================================================ */

  var canvas = document.getElementById('terminalBg');
  var ctx    = canvas.getContext('2d');

  var W = 0, H = 0;

  /* Rendering constants */
  var FONT_PX   = 11;
  var LINE_H    = 17;
  var COL_W     = 340;
  var CMD_ALPHA = 0.22;   /* command lines — slightly brighter */
  var OUT_ALPHA = 0.09;   /* output lines — dimmer */

  var cols = [];

  /* Build a flat line array for one column, cycling through blocks */
  function buildLines(startOffset) {
    var lines = [];
    var n     = BLOCKS.length;
    for (var j = 0; j < n; j++) {
      var block = BLOCKS[(j + startOffset) % n];
      for (var k = 0; k < block.length; k++) {
        lines.push({
          text:  block[k],
          alpha: k === 0 ? CMD_ALPHA : OUT_ALPHA
        });
      }
      /* Two blank gap lines between blocks */
      lines.push({ text: '', alpha: 0 });
      lines.push({ text: '', alpha: 0 });
    }
    return lines;
  }

  function initCols() {
    cols = [];
    var num = Math.ceil(W / COL_W) + 1;
    for (var i = 0; i < num; i++) {
      var lines = buildLines(i * 3);
      cols.push({
        x:       i * COL_W + 10,
        lines:   lines,
        totalH:  lines.length * LINE_H,
        scrollY: Math.random() * lines.length * LINE_H,
        speed:   0.25 + (i % 6) * 0.07   /* gentle spread: 0.25 – 0.60 px/frame */
      });
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initCols();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.font         = FONT_PX + 'px "Source Code Pro","Courier New",monospace';
    ctx.textBaseline = 'top';

    for (var c = 0; c < cols.length; c++) {
      var col = cols[c];

      col.scrollY += col.speed;
      if (col.scrollY >= col.totalH) col.scrollY -= col.totalH;

      var firstLine = Math.floor(col.scrollY / LINE_H);
      var yOff      = -(col.scrollY % LINE_H);
      var visible   = Math.ceil(H / LINE_H) + 2;

      for (var i = 0; i < visible; i++) {
        var entry = col.lines[(firstLine + i) % col.lines.length];
        if (!entry.text || entry.alpha === 0) continue;
        ctx.fillStyle = 'rgba(0,210,55,' + entry.alpha + ')';
        ctx.fillText(entry.text, col.x, yOff + i * LINE_H);
      }
    }

    requestAnimationFrame(draw);
  }

  /* ============================================================
     Alert banner
     ============================================================ */

  var alertEl  = document.getElementById('alert');
  var closeBtn = document.getElementById('alertClose');

  closeBtn.addEventListener('click', function () {
    alertEl.classList.remove('alert--visible');
    alertEl.classList.add('alert--hidden');
  });

  setTimeout(function () {
    alertEl.classList.add('alert--visible');
  }, 2200);

  /* ============================================================
     Boot — wait for fonts so canvas renders Source Code Pro
     ============================================================ */

  window.addEventListener('resize', resize);

  document.fonts.ready.then(function () {
    resize();
    draw();
  });

}());