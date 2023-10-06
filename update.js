function dniSendAnalyticsData(data, callback) {
  var dniUrl = 'https://marketingservice-1986.twil.io/DynamicNumberInsertion';
  fetch(dniUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(function(response) {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(function(responseData) {
    console.log('Server response:', responseData);
    callback(null, responseData);
  })
  .catch(function(error) {
    console.error('Error:', error);
    callback(error, null);
  });
}

function dniFormatPhoneNumber(dniNumber, format) {
  var match = dniNumber.toString().replace(/\D/g, '').match(/^(\d{3})(\d{3})(\d{4})$/);
  if (!match) return '';
  return format === 'href' ? 'tel:1(' + match[1] + ')' + match[2] + '-' + match[3]
       : format === 'html' ? '(' + match[1] + ') ' + match[2] + '-' + match[3]
       : '';
}

function dniUpdatePhoneNumbers(dniNumber) {
  function dniIsValidPhoneNumber(number) {
    var strippedNumber = number.replace(/\D/g, '');
    return strippedNumber.length === 10 || strippedNumber.length === 11;
  }
  function replaceTextNodes(element, newText) {
      Array.prototype.forEach.call(element.childNodes, function(child) {
        if (child.nodeType === 3) {
          if (dniIsValidPhoneNumber(child.nodeValue)) {
            child.nodeValue = newText;
          }
        } else if (child.nodeType === 1) {
          replaceTextNodes(child, newText);
        }
      });
    }
  
    var linkElements = document.querySelectorAll('a');
    var divElements = document.querySelectorAll('div');
  
    Array.prototype.forEach.call(linkElements, function(link) {


    var phoneNumberMatchesHref = link.href.match(/tel:1?(\d{3}\D?\d{3}\D?\d{4})/);
    if (phoneNumberMatchesHref && dniIsValidPhoneNumber(phoneNumberMatchesHref[1])) {
      link.href = dniFormatPhoneNumber(dniNumber, 'href');
    }

    // Check if innerText contains "http" and skip
    if (link.innerText.includes("http") || link.innerText.includes(",") ) {
      return;
    }

    // Replace text nodes only, leave child elements untouched
    replaceTextNodes(link, dniFormatPhoneNumber(dniNumber, 'html'));
  });

  Array.prototype.forEach.call(divElements, function(div) {

    // Skip elements with specific IDs or classes
    if (div.id === 'nav-button'||div.innerText.includes("http")||div.innerText.includes(",")) {
      return;
  }
    var phoneNumberMatchesInnerText = div.innerText.match(/\d+/g);

    if (phoneNumberMatchesInnerText && phoneNumberMatchesInnerText.join('').length >= 10) {
      replaceTextNodes(div, dniFormatPhoneNumber(dniNumber, 'html'));
    }
  });
}

// Function to extract parameters from URL
function dniExtractParameters() {
  var searchParams = new URLSearchParams(new URL(decodeURI(window.location.href)).search);
  var parameters = {};
  searchParams.forEach(function(value, key) {
    parameters[key] = value;
  });
  return parameters;
}

//Browser Data 
function dniParseData() {

  //Get Parameters 
  var searchParams = new URLSearchParams(new URL(decodeURI(window.location.href)).search);
  var parameters = {};
  searchParams.forEach(function(value, key) {
    parameters[key] = value;
  });
  // Parsing cookies
  var cookies = document.cookie.split(';');
  var cookieData = {};

  cookies.forEach(function(cookie) {
      var cookieParts = cookie.trim().split('=');
      var name = cookieParts[0];
      var value = decodeURIComponent(cookieParts[1]);
      cookieData[name] = value;
  });

  // Parsing localStorage
  var localStorageData = {};
  for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);
      localStorageData[key] = value;
  }

  // Parsing sessionStorage
  var sessionStorageData = {};
  for (var i = 0; i < sessionStorage.length; i++) {
      var key = sessionStorage.key(i);
      var value = sessionStorage.getItem(key);
      sessionStorageData[key] = value;
  }

  return {
      cookies: cookieData,
      localStorage: localStorageData,
      sessionStorage: sessionStorageData, 
      parameters: parameters
  };
}

// Function to parse cookies
function dniParseCookies() {
  var cookies = document.cookie.split(';');
  var cookieData = {};

  cookies.forEach(function(cookie) {
      var cookieParts = cookie.trim().split('=');
      var name = cookieParts[0];
      var value = decodeURIComponent(cookieParts[1]);
      cookieData[name] = value;
  });

  return cookieData;
}








function dniStoreSource() {
  if (typeof(Storage) !== "undefined") {
      if (!localStorage.getItem("origionalref")) {
          var firstReferrer = encodeURI(document.referrer);
          localStorage.setItem("origionalref", firstReferrer);
      } else {
      }
  } else {
  }

  //Set Cookies 
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 10);
  var expiresDate = "expires=" + currentDate.toUTCString();
    var cookies = document.cookie.split("; ");
    var found = false;
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("origionalref")) {
            found = true;
            break;}}

    if (!found) {
        var firstReferrer = encodeURI(document.referrer);
        document.cookie = "origionalref=" + firstReferrer + ";"+ expiresDate +"; SameSite=None; Secure";
    }}

    function dniStoreIP(ip) {
      if (!ip) {
        console.error("IP is not provided");
        return;
      }
    
      if (typeof(Storage) !== "undefined") {
        if (!localStorage.getItem("ip")) {
          localStorage.setItem("ip", ip);
        }
      }
    
      // Store ip in Cookies 
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 10);
      var expiresDate = "expires=" + currentDate.toUTCString();
      var cookies = document.cookie.split("; ");
      var found = false;
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("ip")) {
          found = true;
          break;
        }
      }
    
      if (!found) {
        document.cookie = "ip=" + ip + "; " + expiresDate + "; SameSite=None; Secure";
      }
    }

//Check if Bot Traffic 
function isBot() {
  return /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
}
// Not supposed to deploy pages 
function isValidURL() {
  const url = window.location.href;
  if (url.includes("serviceability") || url.includes("confirmation") || url.includes("my.goaptive.com")) {
      return false;}
  return true;
}

// Main execution
document.addEventListener("DOMContentLoaded", function() {
  if (isValidURL()){
    dniStoreSource();
    dniStoreIP(ip);
    var urlData = decodeURI(window.location.href);
    var url = urlData.split('?')[0];
    var params = dniExtractParameters();
    var cookies = dniParseCookies();
    var browserData = dniParseData();
    
    var jsonData = {
      url: url,
      params: params,
      cookies: cookies,
      browserData: browserData
    };

    if (!isBot()){
      dniSendAnalyticsData(jsonData, function(error, phoneNumber) {
        if (error) {
          console.error('Error:', error);
          return;
        }
        dniUpdatePhoneNumbers(phoneNumber);
        dniStoreSource();
      });
    }
  }
});
