/*
すべての線幅を変更.jsx
Copyright (c) 2016 Toshiyuki Takahashi
Released under the MIT license
http://opensource.org/licenses/mit-license.php
http://www.graphicartsunit.com/
*/
(function() {

	// Settings
	var settings = {
		'scale' : 50,
		'preview' : true,
		'onChanging' : true
	}

	// Initialize
	var SCRIPT_TITLE = 'すべての線幅を変更';
	var SCRIPT_VERSION = '0.5.4';

	var doc = app.activeDocument;
	var targetItems = doc.selection;
	if(typeof settings.preview != 'boolean') settings.preview = false;
	if(typeof settings.onChanging != 'boolean') settings.onChanging = false;

	// Load setting from json file
	var saveOptions = {
		'os' : File.fs,
		'jsxPath' : $.fileName,
		'reverseDomain' : 'com.graphicartsunit',
		'fileName' : 'resize_all_stroke_width.json',
		'path' : ''
	};
	saveOptions.path = getSettingFilePath(saveOptions);
	loadSettings();

	// UI dialog
	function MainDialog() {
		this.init();
		return this;
	};
	MainDialog.prototype.init = function() {
		var unit = 10;
		var thisObj = this;
		thisObj.dlg = new Window('dialog', SCRIPT_TITLE + ' - ver.' + SCRIPT_VERSION);
		thisObj.dlg.margins = [unit, unit * 3, unit, unit * 3];

		// Dialog - Text field
		thisObj.scaleGroup = thisObj.dlg.add('group', undefined);
		thisObj.scaleGroup.margins = [unit, unit, unit, unit];

		thisObj.scaleGroup.add('statictext', undefined, '比率', {alignment:'left'});
		thisObj.scaleText = thisObj.scaleGroup.add('edittext', undefined, settings.scale);
		thisObj.scaleText.minimumSize = [unit * 6, unit];
		thisObj.scaleGroup.add('statictext', undefined, '%', {alignment:'left'});

		// Dialog - Hint message
		var aiv = app.version.split('.')[0];
		if(!settings.onChanging && Number(aiv) > 16) {
			thisObj.noteGroup = thisObj.dlg.add('panel', undefined, 'HINT:');

			var noteText = saveOptions.os == 'Windows' ? '［Alt］、［Ctrl］' : '［command］［option］［control］';
			thisObj.noteText = thisObj.noteGroup.add('statictext', undefined, 'CC以降は' + noteText + 'のいずれかを押してもプレビューを更新できます', {multiline:true});
			thisObj.noteText.alignment = 'center';
			thisObj.noteText.minimumSize = [unit * 25, undefined];
		}

		// Dialog - Footer group
		thisObj.footerGroup = thisObj.dlg.add('group', undefined);
		thisObj.footerGroup.margins = [unit, unit/2, unit, unit * 0];
		thisObj.footerGroup.alignment = 'center';
		thisObj.footerGroup.orientation = 'row';

		// Dialog - Preview checkbox
		thisObj.checkboxGroup = thisObj.footerGroup.add('group', undefined);
		thisObj.checkboxGroup.margins = [0, 0, unit, 0];

		thisObj.previewCheckbox = thisObj.checkboxGroup.add('checkbox', undefined, 'プレビュー');
		thisObj.previewCheckbox.value = settings.preview;

		// Dialog - Buttons
		thisObj.buttonGroup = thisObj.footerGroup.add('group', undefined);

		thisObj.cancel = thisObj.buttonGroup.add('button', undefined, 'キャンセル', {name: 'cancel'});
		thisObj.ok = thisObj.buttonGroup.add('button', undefined, '実行', { name:'ok'});

		// Preview
		function preview(event) {
			var previewScale = validateScale(settings.preview ? thisObj.scaleText.text : 100);
			if(previewScale != -1) {
				settings.scale = settings.preview ? previewScale : thisObj.scaleText.text;
				resizeStrokeWidth(previewScale);
				var dummyObject = doc.pathItems.add();
				dummyObject.remove();
				app.redraw();
				app.undo();
				thisObj.scaleText.active = true;
			}
			if(thisObj.scaleText.text !== settings.scale) thisObj.scaleText.text = settings.scale;
		}

		// Set event for preview
		thisObj.scaleText.active = true;
		var previewEvent = settings.onChanging ? 'changing' : 'change';
		thisObj.scaleText.addEventListener(previewEvent, preview);
		thisObj.scaleText.dispatchEvent(new UIEvent(previewEvent));
		if(!settings.onChanging) {
			thisObj.scaleText.addEventListener('keyup', function(e) {
				if(e.keyName == 'Alt' || e.keyName == 'Meta' || e.keyName == 'Control') {
					thisObj.scaleText.dispatchEvent(new UIEvent(previewEvent));
				}
			});
		}

		// Preview checkbox action
		thisObj.previewCheckbox.onClick = function() {
			settings.preview = this.value;
			thisObj.scaleText.dispatchEvent(new UIEvent(previewEvent));
		}

		// Button action
		thisObj.ok.onClick = function() {
			try {
				var scale = validateScale(thisObj.scaleText.text);
				if(scale != -1) {
					settings.scale = scale;
					resizeStrokeWidth(scale);
					saveSettings();
					thisObj.closeDialog();
				} else {
					thisObj.scaleText.text = settings.scale;
				}
			} catch(e) {
				alert('エラーが発生して処理を実行できませんでした\nエラー内容：' + e);
			}
		}
		thisObj.cancel.onClick = function() {
			thisObj.closeDialog();
		}
	};
	MainDialog.prototype.showDialog = function() {
		this.dlg.show();
	};
	MainDialog.prototype.closeDialog = function() {
		this.dlg.close();
	};

	var dialog = new MainDialog();

	if (!doc) {
		alert('対象ドキュメントがありません');
	} else if (targetItems.length <= 0) {
		alert('少なくとも1つ以上のオブジェクトを選択してください');
	} else {
		dialog.showDialog();
	}

	// Main Process
	function resizeStrokeWidth(scale) {
		for (var i = 0; i < targetItems.length; i++) {
			targetItems[i].resize(100, 100, true, true, true, true, scale, Transformation.CENTER);
		}
	}

	// Validation for scale value
	function validateScale(v) {
		if(!isNaN(v) && v.indexOf('0') != 0) {
			if(v <= 0) {
				alert('0以下の値は1％として処理されます');
				return 1;
			} else if(v > 1000) {
				alert('1000より大きい値は1000％として処理されます');
				return 1000;
			}
			return v;
		} else {
			alert('入力できるのは半角数字のみです');
			return -1;
		}
	}

	// Get path of json file
	function getSettingFilePath(options) {
		var filepath = '';
		switch(options.os) {
			case 'Macintosh':
				filepath = Folder.userData + '/' + options.reverseDomain + '/Illustrator/Scripts/' + options.fileName;
				break;
			case 'Windows':
				filepath = Folder.userData + '/' + options.reverseDomain + '/Illustrator/Scripts' + options.fileName;
				break;
			default :
				break;
		}
		return filepath;
	}

	// Load settings from json file
	function loadSettings() {
		var dir = saveOptions.path.match(/(.*)(\/)/)[1];
		if(!new Folder(dir).exists) {
			new Folder(dir).create();
		} else if(new File(saveOptions.path).exists) {
			var settingFile = new File(saveOptions.path);
			settingFile.encoding = 'UTF-8';
			settingFile.open('r');
			var loadedSettings = settingFile.readln();
			loadedSettings = (new Function('return' + loadedSettings))();
			settingFile.close();
			loadedSettings.onChanging = settings.onChanging;
			settings = loadedSettings;
		}
	}

	// Save settings to json file
	function saveSettings() {
		var settingFile = new File(saveOptions.path);
		settingFile.open('w');
		settingFile.write(settings.toSource());
		settingFile.close();
	}

}());