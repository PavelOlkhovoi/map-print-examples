import domtoimage from "dom-to-image";
import fileSaver from "file-saver";

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
    // this._createImagePlaceholder(sizeMode);
    this._customCreateImagePlaceholder(sizeMode);
  },
  _customCreateImagePlaceholder: function (sizeMode) {
    var plugin = this;
    domtoimage
      .toPng(this.mapContainer, {
        width: parseInt(this.originalState.mapWidth.replace("px")),
        height: parseInt(this.originalState.mapHeight.replace("px")),
      })
      .then(function (dataUrl) {
        plugin.blankDiv = document.createElement("div");
        var blankDiv = plugin.blankDiv;
        var header = document.createElement("h1");
        blankDiv.appendChild(header);
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
      //   this._printOpertion(sizeMode);
      this._customPrintOpertion(sizeMode);
    }
  },
  _customPrintOpertion: function (sizemode) {
    var plugin = this;
    var widthForExport = this.mapContainer.style.width;
    if (
      (this.originalState.widthWasAuto && sizemode === "CurrentSize") ||
      (this.originalState.widthWasPercentage && sizemode === "CurrentSize")
    ) {
      widthForExport = this.originalState.mapWidth;
    }
    domtoimage
      .toPng(plugin.mapContainer, {
        width: parseInt(widthForExport),
        height: parseInt(plugin.mapContainer.style.height.replace("px")),
      })
      .then(function (dataUrl) {
        var blob = plugin._dataURItoBlob(dataUrl);
        if (plugin.options.exportOnly) {
          fileSaver.saveAs(blob, plugin.options.filename + ".png");
        } else {
          //   plugin._sendToBrowserPrint(dataUrl, plugin.orientation);
          plugin._customSendToBrowserPrint(dataUrl, plugin.orientation);
        }
        plugin._toggleControls(true);
        plugin._toggleClasses(plugin.options.hideClasses, true);

        if (plugin.outerContainer) {
          if (plugin.originalState.widthWasAuto) {
            plugin.mapContainer.style.width = "auto";
          } else if (plugin.originalState.widthWasPercentage) {
            plugin.mapContainer.style.width =
              plugin.originalState.percentageWidth;
          } else {
            plugin.mapContainer.style.width = plugin.originalState.mapWidth;
          }
          plugin.mapContainer.style.height = plugin.originalState.mapHeight;
          plugin._removeOuterContainer(
            plugin.mapContainer,
            plugin.outerContainer,
            plugin.blankDiv
          );
          plugin._map.invalidateSize();
          plugin._map.setView(plugin.originalState.center);
          plugin._map.setZoom(plugin.originalState.zoom);
        }
        plugin._map.fire("easyPrint-finished");
      })
      .catch(function (error) {
        console.error("Print operation failed", error);
      });
  },
  _customSendToBrowserPrint: function (img, orientation) {
    this._page.resizeTo(600, 800);
    // var pageContent = this._createNewWindow(img, orientation, this);
    var pageContent = this._customCreateNewWindow(img, orientation, this);
    this._page.document.body.innerHTML = "";
    this._page.document.write(pageContent);
    this._page.document.close();
  },
  _customCreateNewWindow: function (img, orientation, plugin) {
    return (
      `<html><head>
        <style>@media print {
          img { max-width: 98%!important; max-height: 98%!important; }
          @page { size: ` +
      orientation +
      `;}}
        </style>
        <script>function step1(){
        setTimeout('step2()', 10);}
        function step2(){window.print();window.close()}
        </script></head><body onload='step1()'>
        <div><h1>Header</h1><div>
        <img class="custom-print-img" src="` +
      img +
      `" style="display:block; margin:auto; width: 1000px"></body></html>`
    );
  },
};
