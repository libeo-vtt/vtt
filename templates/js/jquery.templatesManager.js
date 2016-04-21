var TemplatesManager = function() {
    this.config = {
        jsonFile: '/src/sass/styles.json'
    }

    this.$generateButton = $('.json-preview-generate');
    this.$importButton = $('.json-preview-import');
    this.$resetButton = $('.json-preview-reset');
    this.$downloadButton = $('.json-preview-download');
    this.$jsonPreview = $('.json-preview');

    this.bindEvents();
};

$.extend(TemplatesManager.prototype, {

    // Component initialization
    bindEvents: function() {
        this.$resetButton.on('click', this.resetLocalJSON);
    },

    getJSON: function(callback) {
        // Set the global ajax config to synchronous
        $.ajaxSetup({ async: false });

        if (this.currentJSON) {
            return this.currentJSON;
        } else {
            $.getJSON(this.config.jsonFile, $.proxy(function(data) {
                var localJSON = this.getLocalJSON();

                this.currentJSON = data;

                // Return local JSON if more recent than file JSON
                if (localJSON !== null && localJSON.lastUpdated > data.lastUpdated) {
                    this.currentJSON = localJSON;
                    this.showResetButton();
                } else {
                    this.hideResetButton();
                }

                if (typeof callback === 'function') {
                    callback(this.currentJSON);
                }
            }, this));

            return this.currentJSON;
        }
    },

    showResetButton: function() {
        this.$resetButton.show();
    },

    hideResetButton: function() {
        this.$resetButton.hide();
    },

    getImportJSON: function() {
        var jsonPreviewValue = this.$jsonPreview.val();
        var data = (jsonPreviewValue !== '' ? JSON.parse(jsonPreviewValue) : false);
        return data;
    },

    getLocalJSON: function(callback) {
        return JSON.parse(localStorage.getItem('JSON'));
    },

    saveLocalJSON: function(data) {
        this.currentJSON = data;
        localStorage.setItem('JSON', JSON.stringify(data, null, 2));
        this.showResetButton();
    },

    resetLocalJSON: function() {
        localStorage.removeItem('JSON');
        window.location.reload();
    },

    updateJSON: function(data) {
        this.$jsonPreview.val(JSON.stringify(data, null, 2));
        this.saveLocalJSON(data);
    },

    downloadJSON: function(data) {
        var url = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
        var link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', 'styles.json');
        document.body.appendChild(link);
        setTimeout(function() {
            link.click();
            document.body.removeChild(link);
        }, 100);
    }

});
