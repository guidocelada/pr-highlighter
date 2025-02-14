const TEST_PATTERNS = [
    /[-_.]test\./i,
    /[-_.]spec\./i,
    /[\\/]tests?[\\/]/i,  // Matches /test/ or /tests/ directories
    /[\\/]__tests__[\\/]/,
    /[\\/]__test__[\\/]/,
    /[\\/]spec[\\/]/i,
    /[\\/]specs[\\/]/i
];


function getFileType(filepath) {
    const normalizedPath = filepath.replace(/\\/g, '/');

    let fileType = 'regular';

    if (TEST_PATTERNS.some(pattern => pattern.test(normalizedPath))) {
        fileType = 'test';
    }

    return fileType;
}

function processSingleFileView() {
    // Find all file headers in the PR
    const fileHeaders = document.querySelectorAll('.file-header:not([data-highlighter-file-highlighter-type])');

    fileHeaders.forEach(fileHeader => {
        // Skip if already processed
        if (fileHeader.hasAttribute('data-highlighter-file-highlighter-type')) {
            return;
        }

        // Get the file full path and name
        const filepath = fileHeader.querySelector('.file-info a.Link--primary')?.title;
        if (!filepath) return;

        // Mark what type this file is
        let fileType = getFileType(filepath);
        fileHeader.classList.add(`file-highlighter-type-${fileType}`);
        fileHeader.setAttribute('data-highlighter-file-highlighter-type', fileType);
    });
}

// Watch for dynamic content changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            processSingleFileView();
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial processing
processSingleFileView();