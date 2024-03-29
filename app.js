(function(){
	var SuperEditor = function(){
//3.5	
			var view, fileName, isDirty = false,
				unsavedMsg = 'Unsaved changes will be lost. Are you sure? ',
				unsavedTitle = 'Discard changes';
			var markDirty = function(){
				isDirty = true;
			};

			var markClean = function(){
				isDirty = false;
			};
			var checkDirty = function(){
				if(isDirty){ return unsavedMsg;}
			};

			window.addEventListener('beforeunload', checkDirty, false);

			var jump = function(e){
				var hash = location.hash;
				if(hash.indexof('/')>-1 {
					var parts = hash.split('/'),
						fileNameE1 = document.getElementById('file_name');
					view = parts[0].substring(1) + '-view';
					fileName = parts[1];
					fileNameE1.innerHTML = filename;
				} else{
					if(!isDirty || confirm(unsavedMsg, unsavedTitle)){
						markClean();
						view = 'browser-view';
						if(hash != '#list'){
							location.hash = '#list';
						}
					}else{
						location.href = e.oldURL;
					}

				}

				document.body.classmate = view;
			};

			jump();

			window.addEventListener('haschange', jump, false);


			//3.6
			var editVisualButton = document.getElementById('edit_visual'),
				visualView = document.getElementById('file_contents_visual'),
				visualEditor = document.getElementById('file_contents_visual_editor'),
				visualEditorDoc = visualEditor.contentDocument,
				editHtmlButton = document.getElementById('edit_html'),
				htmlView = document.getElementById('file_contents_html'),
				htmlEditor = document.getElementById('file_contents_html_editor');
			visualEditorDoc.designMode = 'on';

			visualEditorDoc.addEventListener('keyup', markDirty, false);
			htmlEditor.addEventListener('keyup', markDirty, false);

			var updateVisualEditor = function(content){
				visualEditorDoc.open();
				visualEditorDoc.write(content);
				visualEditorDoc.close();
				visualEditorDoc.addEventListener('keyup', markDirty, false);
			};

			var updateHtmlEditor = function(){
				htmlEditor.value = content;
			};
		var toggleActiveView = function(){
			if(htmlView.style.display == 'block'){
				editVisualButton.className = 'split_left active';
				visualView.style.display = 'block';
				editHtmlButton.className = 'split_right';
				htmlView.style.display = 'none';
				updateVisualEditor(htmlEditor.value);
			}else{
				editHtmlButton.className = 'split_right active';
				htmlView.style.display ='block';
				editHtmlButton.className = 'split_left';
				visualView.style.display = 'none';

				var x = new XMLSerializer();
				var content = x.serializeToString(visualEditorDoc);
				updateHtmlEditor(content);
			}
		}

		editVisualButton.addEventListener('click',toggleActiveView, false);
		editHtmlButton.addEventListener('click',toggleActiveView, false);


		var visualEditorToolbar =
			document.getElementById('file_contents_visual_toolbar');
		var richTextAction = function(){
			var command,
				node = (e.target.nodeName === "BUTTON") ? e.target :
				e.target.parentNode;
			if(node.dataset){
				command = node.dataset.command;
			}else{
				command = node.getAttribute('data-command');
			}

			var doPopupCommand = function(command, promptText, promptDefault){
				visualEditorDoc.execCommand(command, false, prompt(promptText, promptDefault));
			}

			if(command === 'createLink'){
				doPopupCommand(command, 'Enter link URL:', 'http://www.baidu.com');
			}else if(command === 'insertImage'){
				doPopupCommand(command, 'Enter image URL:',
					'http://www.baidu.com/image.png');

			}else if(command === 'insertMap'){
				if(navigator.geolocation){
					node.innerHTML = 'Loading';
					navigator.geolocation.getCurrentPosition(function(pos){

						var coords = pos.coords.latitude+'.'+pos.coords.longitude;
						var img = 'http://maps.googleapis.com/maps/api/staticmap?markers='
							+coords+'&zoom=11&size=200x200&sensor=false';
						visualEditorDoc.execCommand('insertImage', false, img);
					});
				}else{
					alert('Geolocation not available', 'No geolocation data');
				}

			}




			else{
				visualEditorDoc.execCommand(command);
			}

		};

		visualEditorToolbar.addEventListener('click', richTextAction, false);



		//3.9

		window.requestFileSystem = window.requestFileSystem ||
			window.webkitRequestFileSystem
			|| window.mozRequestFileSystem || window.msRequestFileSystem || false;
		window.storageInfo = navigator.persistentStorage ||
			navigator.webkitPersistentStorage || navigator.mozPersistentStorage ||
			navigator.mozPersistentStorage || false;
		var stType = window.PERSISTENT || 1,
			stSize = (5*2014*1024),
			fileSystem,
			fileListE1 = document.getElementById('files'),
			currentFile;
	var fsError = function(e){
		if(e.code === 9){
			alert('File name already exists.', 'File System Error');
		}else{
			alert('An unexpected error occured. Error code: '+e.code);
		}
	};
	var qmError = function(e){
		if(e.code === 22){
			alert('Quota already exists.', 'Quota Management Error');
		}else{
			alert('An unexpected error occured. Error code: '+e.code);
		}
	};

	if(requestFileSystem && storageInfo){
		var checkQuota = function(currentUsage, quota){
			if(quota === 0){
				storageInfo.requestQuota(stType, stSize, getFS, qmError);
			}else{
				getFS(quota);
			}
		};
		storageInfo.queryUsageAndQuota(stType, checkQuota,qmError);
		
		var getFS = function(quota){
			requestFileSystem(stType, quota, displayFileSystem, fsError);
		}

		var displayFileSystem = function(fs){
			fileSystem = fs;
			updateBrowserFilesList();
			if(view === 'editor'){
				loadFile(filename);
			}
		}
		var displayBrowserFileList = function(files){
			fileListE1.innerHTML = '';
			document.getElementById('file_count').innerHTML = file.length;
			if(files.length>0){
				files.forEach(function(file, i){
					var li = '<li id="li_'+i+'" draggable="true">'+filename
						+'<div><button id="view_'+i+_'">View</button>'
						+'<button class="green" id="edit_'+i+'">Edit</button>'
						+'<button class="red" id="del_'+i+'">Delete</button>'
						+'</div></li>';
					fileListE1.insertAdjacentHTML('beforeend', li);

					var listItem = document.getElementById('li_'+i),
						viewBtn = document.getElementById('view_'+i),
						editBtn = document.getElementById('edit_'+i),
						deleteBtn = document.getElementById('del_'+i);

					var doDrag = function(e){dragFile(file, e);}
					var doView = function(){viewFile(file);}
					var doEdit = function(){editFile(file);}
					var doDelete = function(){deleteFile(file);}

					viewBtn.addEventListener('click',doView, false);
					editBtn.addEventListener('click', doEdit, false);
					deleteBtn.addEventListener('click', doDelete, false);
					listItem.addEventListener('dragstart', doDrag, false);

				});
			}else{
				fileListE1.innerHTML = '<li class="empty"> No files to display</li>'
			}
		};


		var updateBrowserFilesList = function(){
			var dirReader = fileSystem.root.createReader(),
				files = [];

					var readFileList = function(){
						dirReader.readEntries(fucntion(fileSet){
							if(!fileSet.length){
								displayBrowserFileList(files.sort());
							} else {
								for (var i=0, len=fileSet.length; i<len; i++){
									files.push(fileSet[i]);
								}
								readFileList();
							}
						}, fsError);
					}
					readFileList();
			};


		var loadFile = function(name){
			fileSystem.root.getFile(name, {}, function(fileEntry){
				currentFile = fileEntry;
				fileEntry.file(function(file){
					var reader = new FileReader();
					reader.onloadend = function(e){
						updateVisualEditor(this.result);
					updateHtmlEditor(this.result);
					}
					reader.readerText(file);
				}, fsError);

			}, fsError);
		};
//3.13
		var viewFile = function(file){
			window.open(file.toURL(), 'SuperEditorPreview', 'width=800,heigth=600');
		};

		var editFile = function(file){
			loadFile(file.name);
			location.href = '#editor/'+file.name;

		};

		var deleteFile = fucntion(file){
			var deleteSuccess = function(){
				alert('File '+file.name+' deleted successfully', 'File deleted');
				updateBrowserFilesList();
			}

			if(confirm('File will be deleted. Are you sure?', 'Confirm delete')){
				file.remove(deleteSuccess, fsError);
			}
		};


		//3.14

		var createFile = function(field){
			var config = {
				create:true,
				exclusive:true
			};

			var createSuccess = fucntion(file){
				alert('File '+file.name+' created successfully', 'File created');
				updateBrowserFilesList();
				field.value = '';
			};
			fileSystem.root.getFile(field.value, config, createSuccess, fsError);
		};

		var createFormSubmit = fucntion(e){
			e.preventDefault();
			var name = document.forms.create.name;
			if(name.value.length>0){
				var len = name.value.length;
				if(name.value.substring(len-5, len) === '.html'){
					createFile(name);
				}else{
					alert('Only extension .html allowed', 'Create Error');
				}
			} else{
				alert('You must enter a file name', 'Create Error');
			}

		};

		document.forms.create.addEventListener('submit', createFormSubmit, false);


	}else{
		alert('File System API not supported', 'Unsupported');
	}

};
		


	var init = function(){
		new SuperEditor(
			

		)

	}
	window.addEventListener('load', init, false);
})();