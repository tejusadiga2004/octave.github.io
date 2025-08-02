/*! 
 * Theme for Simplify blog
 * vuquangtrong.github.io 
 */

/* function to add line number into codeblock */
/*
(function() {
    var pre = document.getElementsByTagName('pre'),
        pl = pre.length;
    for (var i = 0; i < pl; i++) {
        pre[i].innerHTML = '<span class="line-number"></span>' + pre[i].innerHTML + '<span class="cl"></span>';
        var num = pre[i].innerHTML.split(/\n/).length;
        for (var j = 0; j < (num - 1); j++) {
            var line_num = pre[i].getElementsByTagName('span')[0];
            line_num.innerHTML += '<span>' + (j + 1) + '</span>';
        }
    }
})();
*/

/* force to hide expanded navbar when scroll down */
$(window).scroll(function(e) {
    var scroll = $(window).scrollTop();
    if (scroll >= 150) {
        $('#navbarMenu').collapse('hide');
    }
    if (scroll >= 300) {
        $('#backToTop').fadeIn();
    } else {
        $('#backToTop').fadeOut();
    }
});

/* add classes into tables */
$("table:not(.highlighttable)").addClass("table table-hover table-sm table-bordered");
$("thead").addClass("thead-light");

/* add classes into images */
$("img").addClass("img-fluid mx-auto shadow-lg");

/* action to back to top */
$('#backToTop').click(function() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
});

/* Add copy buttons to Swift code blocks */
$(document).ready(function() {
    // Find all code blocks that contain Swift code
    $('.highlight').each(function() {
        var $codeBlock = $(this);
        var $pre = $codeBlock.find('pre');
        var codeText = $pre.find('code').text() || $pre.text();
        
        // Check if this is a Swift code block - more comprehensive detection
        var isSwiftCode = false;
        
        // Check class names
        if ($codeBlock.hasClass('swift') || 
            $codeBlock.hasClass('language-swift') ||
            $codeBlock.find('.language-swift').length > 0 ||
            $codeBlock.find('.highlight-swift').length > 0 ||
            $pre.hasClass('swift') ||
            $pre.find('code').hasClass('swift')) {
            isSwiftCode = true;
        }
        
        // Check content for Swift-specific patterns
        if (!isSwiftCode && codeText) {
            var swiftPatterns = [
                /import\s+(Foundation|UIKit|SwiftUI|IOKit|IOUSBHost)/,
                /func\s+\w+\s*\([^)]*\)\s*(\->\s*\w+)?\s*\{/,
                /(var|let)\s+\w+\s*[:=]/,
                /class\s+\w+\s*:\s*\w+/,
                /struct\s+\w+/,
                /enum\s+\w+/,
                /@\w+/,  // Swift attributes like @IBOutlet, @State, etc.
                /\?\?\s/, // nil coalescing operator
                /\.\w+\(/, // method calls with dot notation
                /override\s+func/
            ];
            
            isSwiftCode = swiftPatterns.some(pattern => pattern.test(codeText));
        }
        
        if (isSwiftCode) {
            // Create copy button
            var copyBtn = $('<button class="code-copy-btn" title="Copy Swift code">Copy</button>');
            
            // Add click handler
            copyBtn.click(function(e) {
                e.preventDefault();
                
                // Get the code text
                var codeText = $pre.find('code').text() || $pre.text();
                
                // Clean up the text (remove line numbers if present)
                codeText = codeText.replace(/^\s*\d+\s/gm, '').trim();
                
                // Copy to clipboard using modern API
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(codeText).then(function() {
                        showCopySuccess(copyBtn);
                    }).catch(function(err) {
                        console.error('Failed to copy: ', err);
                        fallbackCopyTextToClipboard(codeText, copyBtn);
                    });
                } else {
                    // Fallback for older browsers
                    fallbackCopyTextToClipboard(codeText, copyBtn);
                }
            });
            
            // Add the button to the code block
            $codeBlock.append(copyBtn);
        }
    });
});

/* Show copy success feedback */
function showCopySuccess($btn) {
    var originalText = $btn.text();
    $btn.addClass('copied').text('Copied!');
    
    setTimeout(function() {
        $btn.removeClass('copied').text(originalText);
    }, 2000);
}

/* Fallback copy method for older browsers */
function fallbackCopyTextToClipboard(text, $btn) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        var successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess($btn);
        } else {
            console.error('Fallback: Could not copy text');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}