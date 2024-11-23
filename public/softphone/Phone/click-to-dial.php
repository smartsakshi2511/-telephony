<?php
session_start();
// $server_ip = $_SERVER['SERVER_ADDR'];
$server_ip = '192.168.0.33';
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

            var web_hook_on_register = function(ua) {
                var user = <?= $user ?>;
                // alert(user);
    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("d")) {
        let numToDial = urlParams.get("d");
        let user = urlParams.get("user");

        window.setTimeout(function() {
            console.log("Performing click to Dial: ", user, numToDial);

            /**
             * Primary method for making a call. 
             * @param {string} type (required) Either "audio" or "video". Will setup UI according to this type.
             * @param {Buddy} buddy (optional) The buddy to dial if provided.
             * @param {sting} numToDial (required) The number to dial.
             * @param {string} CallerID (optional) If no buddy provided, one is generated automatically using this callerID and the numToDial
             * @param {Array<string>} extraHeaders = (optional) Array of headers to include in the INVITE eg: ["foo: bar"] (Note the space after the :)
             */
            DialByLine("audio", null, numToDial);
               //    himanshu
   // Ensure SweetAlert2 is loaded in the parent window
(function loadSweetAlertInParent() {
    const parentDocument = window.parent.document;

    // Load SweetAlert2 stylesheet
    const swalStylesheet = parentDocument.createElement('link');
    swalStylesheet.rel = 'stylesheet';
    swalStylesheet.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
    parentDocument.head.appendChild(swalStylesheet);

    // Load SweetAlert2 script
    const swalScript = parentDocument.createElement('script');
    swalScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    parentDocument.head.appendChild(swalScript);
})();

setTimeout(() => {
    // Wait until SweetAlert2 is fully loaded in the parent window
    const checkSwal = setInterval(() => {
        if (typeof window.parent.Swal !== 'undefined') {
            clearInterval(checkSwal);

            // Fetch data
            fetch('/vicidial-master/agent/fetch_data.php?dialledNumber=' + numToDial, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Default values for the form fields
                let {
                    company_name = '',
                    employee_size = '',
                    industry = '',
                    country = '',
                    city = '',
                    department = '',
                    designation = '',
                    email = '',
                    name = '',
                    phone_number = numToDial,
                    phone_2 = '',
                    date = '',
                    dialstatus = ''
                } = {};

                // If data is not empty, populate the form fields
                if (data.length > 0) {
                    ({
                        company_name = '',
                        employee_size = '',
                        industry = '',
                        country = '',
                        city = '',
                        department = '',
                        designation = '',
                        email = '',
                        name = '',
                        phone_number = '',
                        phone_2 = '',
                        date = '',
                        dialstatus = ''
                    } = data[0]);
                }

                // Fetch disposition data
                return fetch('/vicidial-master/agent/get_followup.php', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(dispodata => {
                    if (dispodata.error) {
                        throw new Error(dispodata.error);
                    }

                    // Process the fetched disposition data
                    const inputOptions = dispodata.map(item => item.dispo);

                    // Display form in SweetAlert2 modal with prefilled data and disposition options
                    window.parent.Swal.fire({
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        title: "Fill the Form",
                        html: `<style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f2f2f2;
                            margin: 0;
                            padding: 20px;
                        }
                        .form-section {
                            background-color: #ffffff;
                            padding: 20px;
                            margin-bottom: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .form-section-title {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: #333;
                        }
                        .form-input {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 10px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            box-sizing: border-box;
                            font-size: 16px;
                        }
                        .form-button {
                            background-color: #4CAF50;
                            border: none;
                            color: white;
                            padding: 14px 20px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin-top: 10px;
                            cursor: pointer;
                            border-radius: 4px;
                        }
                        .form-button:hover {
                            background-color: #45a049;
                        }
                        .row {
                            display: flex;
                            flex-wrap: wrap;
                            margin: 0 -10px; /* Adjust for columns padding */
                        }
                        .col-4, .col-6, .col-2 {
                            padding: 0 10px; /* Column padding */
                            box-sizing: border-box;
                        }
                        .col-4 {
                            flex: 0 0 33.33%;
                            max-width: 33.33%;
                        }
                        .col-6 {
                            flex: 0 0 50%;
                            max-width: 50%;
                        }
                        .col-2 {
                            flex: 0 0 16.67%;
                            max-width: 16.67%;
                        }
                    </style>
                    
                    <form id="dataForm">
                        <div class="form-section">
                            <div class="form-section-title">Company Information</div>
                            <div class="row">
                                <div class="col-4">
                                    <input class="form-input" type="text" placeholder="Company Name" name="company_name" value="${company_name}">
                                </div>
                                <div class="col-4">
                                    <input class="form-input" type="text" placeholder="Employee Size" name="employee_size" value="${employee_size}">
                                </div>
                                <div class="col-4">
                                    <input class="form-input" type="text" placeholder="Industry" name="industry" value="${industry}">
                                </div>
                            </div>
                        </div>
                        <div class="form-section">
                            <div class="form-section-title">Location Information</div>
                            <div class="row">
                                <div class="col-6">
                                    <input class="form-input" type="text" placeholder="Country" name="country" value="${country}">
                                </div>
                                <div class="col-6">
                                    <input class="form-input" type="text" placeholder="City" name="city" value="${city}">
                                </div>
                            </div>
                        </div>
                        <div class="form-section">
                            <div class="form-section-title">Contact Information</div>
                            <div class="row">
                                <div class="col-6">
                                    <input class="form-input" type="text" placeholder="Department" name="department" value="${department}">
                                </div>
                                <div class="col-6">
                                    <input class="form-input" type="text" placeholder="Designation" name="designation" value="${designation}">
                                </div>
                                <div class="col-6">
                                    <input class="form-input" type="email" placeholder="Email" name="email" value="${email}">
                                </div>
                                <div class="col-6">
                                    <input class="form-input" type="text" placeholder="Name" name="name" value="${name}" required>
                                </div>
                                <div class="col-6">
                                    <input class="form-input" type="text" placeholder="Phone Number" name="phone_number" value="${phone_number}" required>
                                </div>
                                <div class="col-6">
                                    <input class="form-input" type="text" placeholder="Phone 2" name="phone_2" value="${phone_2}">
                                </div>
                            </div>
                        </div>
                        <div class="form-section">
                            <div class="form-section-title">Additional Information</div>
                            <div class="row">
                                <div class="col-6">
                                    <input class="form-input" type="date" placeholder="Date" name="date" value="${date}">
                                </div>
                                <div class="col-6">
                                    <select class="form-input" name="dialstatus" id="dialstatus">
                                    ${inputOptions.map(option => `
                                    <option value="${option}" ${option === dialstatus ? 'selected' : ''}>${option}</option>
                                `).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button class="form-button" type="button" onclick="window.parent.submitForm()">Submit</button>
                    </form>`,
                        showConfirmButton: false
                    });

                    // Define form submission function
                    window.parent.submitForm = function submitForm() {
                        const form = window.parent.document.getElementById('dataForm');
                        const formData = new FormData(form);

                        // Validate required fields
                        const name = formData.get('name');
                        const phoneNumber = formData.get('phone_number');

                        if (!name || !phoneNumber) {
                            window.parent.Swal.fire({
                                title: "Error",
                                text: "Name and Phone Number are required fields",
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                            return;
                        }

                        fetch('/vicidial-master/agent/insert_data.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.text())
                        .then(data => {
                            window.parent.Swal.fire({
                                title: "Form Submitted",
                                text: data,
                                icon: "success",
                                confirmButtonText: "OK"
                            });
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            window.parent.Swal.fire({
                                title: "Error",
                                text: "An error occurred while submitting the form",
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                        });
                    };
                })
                .catch(error => {
                    console.error('Error fetching disposition data:', error);
                    window.parent.Swal.fire({
                        title: "Error",
                        text: error.message || "An error occurred while fetching disposition data",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                window.parent.Swal.fire({
                    title: "Error",
                    text: error.message || "An error occurred while fetching the data",
                    icon: "error",
                    confirmButtonText: "OK"
                });

                // Ensure form is displayed even if there is an error fetching data
                window.parent.Swal.fire({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: "Fill the Form",
                    html: `<style>
                        .form-button {
                            background-color: #4CAF50; /* Green */
                            border: none;
                            color: white;
                            padding: 10px 20px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            cursor: pointer;
                            border-radius: 4px;
                        }
                        .form-button:hover {
                            background-color: #45a049;
                        }
                    </style>
                    <form id="dataForm">
                        <div class="form-section">
                            <div class="form-section-title">Company Information</div>
                            <input class="form-input" type="text" placeholder="Company Name" name="company_name" value="">
                            <input class="form-input" type="text" placeholder="Employee Size" name="employee_size" value="">
                            <input class="form-input" type="text" placeholder="Industry" name="industry" value="">
                        </div>
                        <div class="form-section">
                            <div class="form-section-title">Location Information</div>
                            <input class="form-input" type="text" placeholder="Country" name="country" value="">
                            <input class="form-input" type="text" placeholder="City" name="city" value="">
                        </div>
                        <div .form-section-title">Contact Information</div>
                            <input class="form-input" type="text" placeholder="Department" name="department" value="">
                            <input class="form-input" type="text" placeholder="Designation" name="designation" value="">
                            <input class="form-input" type="email" placeholder="Email" name="email" value="">
                            <input class="form-input" type="text" placeholder="Name" name="name" value="" required>
                            <input class="form-input" type="text" placeholder="Phone Number" name="phone_number" value="" required>
                            <input class="form-input" type="text" placeholder="Phone 2" name="phone_2" value="">
                        </div>
                        <div class="form-section">
                            <div class="form-section-title">Additional Information</div>
                            <input class="form-input" type="date" placeholder="Date" name="date" value="">
                            <div class="form-section">
                                <div class="form-section-title">Select Dial Status</div>
                                <select class="form-input" name="dialstatus" id="dialstatus">
                                    ${inputOptions.map(option => `
                                        <option value="${option}">${option}</option>
                                    `).join('')}
                                </select>
                            </div>                            
                        </div>
                        <button class="form-button" type="button" onclick="window.parent.submitForm()">Submit</button>
                    </form>`,
                    showConfirmButton: false
                });
            });
        }
    }, 100);
}, 1000);
               }, 1000);
    }
};
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