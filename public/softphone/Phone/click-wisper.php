<?php
session_start();
// $server_ip = $_SERVER['SERVER_ADDR'];
$server_ip = '103.113.27.163';
$name = $_SESSION['user'];
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$server = $server_ip;
$domain = $server_ip;
$sokect ='8089';
$path ='/ws';


?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">

        <title>Browser Phone</title>
        <meta name="description" content="Browser Phone is a fully featured browser based WebRTC SIP phone for Asterisk. Designed to work with Asterisk PBX. It will connect to Asterisk PBX via web socket, and register an extension.  Calls are made between contacts, and a full call detail is saved. Audio and Video Calls can be recorded locally.">

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>

        <!-- Cache -->
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
        <meta http-equiv="Expires" content="0"/>

        <link rel="icon" type="image/x-icon" href="favicon.ico">
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.2/dist/sweetalert2.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.2/dist/sweetalert2.min.css">

        <!-- Styles -->
        <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/Normalize/normalize-v8.0.1.css"/>
        <link rel="stylesheet preload prefetch" type="text/css" as="style" href="https://dtd6jl0d42sve.cloudfront.net/lib/fonts/font_roboto/roboto.css"/>
        <link rel="stylesheet preload prefetch" type="text/css" as="style" href="https://dtd6jl0d42sve.cloudfront.net/lib/fonts/font_awesome/css/font-awesome.min.css"/>
        <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery-ui-1.13.2.min.css"/>
        <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/Croppie/Croppie-2.6.4/croppie.css"/>
        <link rel="stylesheet" type="text/css" href="phone.css"/>

        <!-- Provisioning -->
        <script type="text/javascript">
            // Provision runtime options can go here.
            var phoneOptions = {
                loadAlternateLang: true,
                SingleInstance: true,
                VoiceMailSubscribe: false,
                EnableTextMessaging: false,
                DisableFreeDial: false,
                DisableBuddies: false,
                ChatEngine: "SIMPLE",
                profileName:"<?= $name ?>",
                wssServer:"<?= $server ?>",
                WebSocketPort:"<?= $sokect ?>",
                ServerPath:"<?= $path ?>",
                SipDomain:"<?= $domain ?>",
                SipUsername:"<?= $user ?>",
                SipPassword:"<?= $pass ?>"
            }

            var web_hook_on_register = function(ua){
                let urlParams = new URLSearchParams(window.location.search);
                if(urlParams.has("d")){
                    window.setTimeout(function(){
                        console.log("Performing Auto Dial: ", urlParams.get("d"));
                        /**
                         * Primary method for making a call. 
                         * @param {string} type (required) Either "audio" or "video". Will setup UI according to this type.
                         * @param {Buddy} buddy (optional) The buddy to dial if provided.
                         * @param {sting} numToDial (required) The number to dial.
                         * @param {string} CallerID (optional) If no buddy provided, one is generated automatically using this callerID and the numToDial
                         * @param {Array<string>} extraHeaders = (optional) Array of headers to include in the INVITE eg: ["foo: bar"] (Note the space after the :)
                         */
                        DialByLine("audio", null, urlParams.get("d"));
                    }, 1000);
                }
            }
            var web_hook_on_registrationFailed = function(e){
                window.parent.CloseWindow();
            }
            var web_hook_on_unregistered = function(){
                window.parent.CloseWindow();
            }
            var web_hook_on_terminate = function(session){
                window.setTimeout(function(){
                    window.parent.CloseWindow();
                }, 1000);
            }
        </script>
    </head>

    <body>
        <!-- Loading Animation -->
        <div class=loading>
            <span class="fa fa-circle-o-notch fa-spin"></span>
        </div>

        <!-- The Phone -->
        <div id=Phone></div>
    </body>

    <!-- Loadable Scripts -->
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery-3.6.1.min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery-ui-1.13.2.min.js"></script>
    <script type="text/javascript" src="phone.js"></script>

    <!-- Deferred Scripts -->
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery.md5-min.js" defer="true"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/Chart/Chart.bundle-2.7.2.min.js" defer="true"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/SipJS/sip-0.20.0.min.js" defer="true"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/FabricJS/fabric-2.4.6.min.js" defer="true"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/Moment/moment-with-locales-2.24.0.min.js" defer="true"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/Croppie/Croppie-2.6.4/croppie.min.js" defer="true"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/XMPP/strophe-1.4.1.umd.min.js" defer="true"></script>

</html>