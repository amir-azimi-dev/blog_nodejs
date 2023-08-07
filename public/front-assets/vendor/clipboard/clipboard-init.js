var snippets = document.querySelectorAll('.markup-example');
[].forEach.call(snippets, function(snippet) {
    snippet.firstElementChild.insertAdjacentHTML('beforebegin', '<button class="btn btn-sm btn-pill btn-theme" data-clipboard-snippet data-toggle="tooltip" data-placement="top" title="Copy to clipboard">Copy</button>');
});

jQuery('[data-clipboard-snippet]').on('mouseleave', function() {
    jQuery(this).tooltip("hide")
});

var clipboardSnippets = new ClipboardJS('[data-clipboard-snippet]',{
    target: function(trigger) {
        return trigger.nextElementSibling;
    }
});
clipboardSnippets.on('success', function(e) {
    jQuery(e.trigger).attr("title", "Copied!").tooltip("_fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("_fixTitle");
    e.clearSelection()
});