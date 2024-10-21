import domtoimage from "dom-to-image";

export const easyPrintExtension = {
  customPrintMap: function (event, filename) {
    if (filename) {
      this.options.filename = filename;
    }
    if (!this.options.exportOnly) {
      this._page = window.open(
        "",
        "_blank",
        "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10, top=10, width=200, height=250, visible=none"
      );
      this._page.document.write(
        this._createSpinner(
          this.options.customWindowTitle,
          this.options.customSpinnerClass,
          this.options.spinnerBgCOlor
        )
      );
    }
    this.originalState = {
      mapWidth: this.mapContainer.style.width,
      widthWasAuto: false,
      widthWasPercentage: false,
      mapHeight: this.mapContainer.style.height,
      zoom: this._map.getZoom(),
      center: this._map.getCenter(),
    };
    if (this.originalState.mapWidth === "auto") {
      this.originalState.mapWidth = this._map.getSize().x + "px";
      this.originalState.widthWasAuto = true;
    } else if (this.originalState.mapWidth.includes("%")) {
      this.originalState.percentageWidth = this.originalState.mapWidth;
      this.originalState.widthWasPercentage = true;
      this.originalState.mapWidth = this._map.getSize().x + "px";
    }
    this._map.fire("easyPrint-start", { event: event });
    if (!this.options.hidden) {
      this._togglePageSizeButtons({ type: null });
    }
    if (this.options.hideControlContainer) {
      this._toggleControls();
    }
    if (this.options.hideClasses) {
      this._toggleClasses(this.options.hideClasses);
    }
    var sizeMode = typeof event !== "string" ? event.target.className : event;
    if (sizeMode === "CurrentSize") {
      return this._printOpertion(sizeMode);
    }
    this.outerContainer = this._createOuterContainer(this.mapContainer);
    if (this.originalState.widthWasAuto) {
      this.outerContainer.style.width = this.originalState.mapWidth;
    }
    console.log("xxx my custom print");
    // this._createImagePlaceholder(sizeMode);
    this._customCreateImagePlaceholder(sizeMode);
  },
  _customCreateImagePlaceholder: function (sizeMode) {
    console.log("xxx my custom image placeholder");
    var plugin = this;
    domtoimage
      .toPng(this.mapContainer, {
        width: parseInt(this.originalState.mapWidth.replace("px")),
        height: parseInt(this.originalState.mapHeight.replace("px")),
      })
      .then(function (dataUrl) {
        plugin.blankDiv = document.createElement("div");
        var blankDiv = plugin.blankDiv;
        plugin.outerContainer.parentElement.insertBefore(
          blankDiv,
          plugin.outerContainer
        );
        blankDiv.className = "epHolder";
        blankDiv.style.backgroundImage = 'url("' + dataUrl + '")';
        blankDiv.style.position = "absolute";
        blankDiv.style.zIndex = 1011;
        blankDiv.style.display = "initial";
        blankDiv.style.width = plugin.originalState.mapWidth;
        blankDiv.style.height = plugin.originalState.mapHeight;
        // plugin._resizeAndPrintMap(sizeMode);
        plugin._customResizeAndPrintMap(sizeMode);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  },
  _customResizeAndPrintMap: function (sizeMode) {
    this.outerContainer.style.opacity = 0;
    var pageSize = this.options.sizeModes.filter(function (item) {
      return item.className.indexOf(sizeMode) > -1;
    });
    pageSize = pageSize[0];
    this.mapContainer.style.width = pageSize.width + "px";
    this.mapContainer.style.height = pageSize.height + "px";
    if (this.mapContainer.style.width < this.mapContainer.style.height) {
      this.orientation = "portrait";
    } else {
      this.orientation = "landscape";
    }
    this._map.setView(this.originalState.center);
    this._map.setZoom(this.originalState.zoom);
    this._map.invalidateSize();
    if (this.options.tileLayer) {
      this._pausePrint(sizeMode);
    } else {
      this._printOpertion(sizeMode);
    }
  },
};
